// src/AutoPhoneAnalysisScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { NativeModules, PermissionsAndroid } from 'react-native';
import { checkSpamForNumber } from './PhoneUtils';  // 새로 만든 파일에서 함수 import

const { SMSModule, CallLogModule } = NativeModules;

const phishingKeywords = ['입금', '계좌', '검찰', '세금', '송금', '파출소', '고객센터'];

const isToday = (timestamp) => {
  const today = new Date();
  const date = new Date(timestamp);
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
};

const AutoPhoneAnalysisScreen = () => {
  const [resultText, setResultText] = useState('');
  const [suspiciousList, setSuspiciousList] = useState([]);

  const requestPermissions = async () => {
    const smsGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_SMS
    );
    const callGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CALL_LOG
    );

    return (
      smsGranted === PermissionsAndroid.RESULTS.GRANTED &&
      callGranted === PermissionsAndroid.RESULTS.GRANTED
    );
  };

  const analyze = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      setResultText('❗ 권한이 거부되었습니다. 설정에서 권한을 허용해주세요.');
      return;
    }

    let found = [];

    await new Promise((resolve) => {
      SMSModule.getAllSMS((smsList) => {
        smsList.forEach((sms) => {
          if (isToday(sms.timestamp)) {
            const matches = phishingKeywords.filter((kw) => sms.body.includes(kw));
            if (matches.length > 0) {
              found.push({
                type: 'sms',
                sender: sms.sender,
                text: sms.body,
                keywords: matches,
              });
            }
          }
        });
        resolve();
      });
    });

    await new Promise((resolve) => {
      CallLogModule.getRecentCallLogs((logs) => {
        logs.forEach((log) => {
          if (isToday(log.timestamp)) {
            if (log.number.startsWith('070') || log.duration < 5) {
              found.push({
                type: 'call',
                sender: log.number,
                text: `통화 (${log.duration}초)`,
                keywords: ['070 또는 짧은 통화'],
              });
            }
          }
        });
        resolve();
      });
    });

    setSuspiciousList(found);

    if (found.length === 0) {
      setResultText('✅ 오늘은 의심스러운 문자나 통화 기록이 없습니다.');
    } else {
      setResultText(`❗ 의심 기록 ${found.length}건 발견됨!`);
    }
  };

  // 기존 Linking을 사용한 후후 조회 함수
  const openWhowho = (number) => {
    const url = `https://whowho.co.kr/number-search/?tel=${number}`;
    Linking.openURL(url);
  };

  // 자동으로 후후 조회해서 스팸 여부를 확인하는 함수
  const autoCheckSpam = async (number) => {
    const isSpam = await checkSpamForNumber(number);
    if (isSpam) {
      Alert.alert('스팸 확인', `${number}는 스팸(의심) 번호로 판별되었습니다.`);
    } else {
      Alert.alert('정상 확인', `${number}는 이상 없는 번호입니다.`);
    }
  };

  return (
    <LinearGradient colors={['#F8F8F8', '#F8F8F8']} style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.title}>📱 오늘의 통화/문자 분석</Text>

        <TouchableOpacity style={styles.analyzeButton} onPress={analyze}>
          <Text style={styles.analyzeButtonText}>🔍 오늘 기록 스캔하기</Text>
        </TouchableOpacity>

        <Text style={styles.resultText}>{resultText}</Text>

        {suspiciousList.map((item, index) => (
          <View key={index} style={styles.itemBox}>
            <Text style={styles.itemText}>
              [{item.type === 'sms' ? '문자' : '통화'}] {item.sender}
            </Text>
            <Text style={styles.itemText}>{item.text}</Text>
            <Text style={styles.itemText}>⚠️ 키워드: {item.keywords.join(', ')}</Text>

            <TouchableOpacity onPress={() => openWhowho(item.sender)}>
              <Text style={styles.link}>📞 후후에서 번호 조회</Text>
            </TouchableOpacity>

            {/* 자동으로 후후 조회 결과를 앱 내 팝업으로 확인 */}
            <TouchableOpacity onPress={() => autoCheckSpam(item.sender)}>
              <Text style={styles.link}>🤖 자동 스캔 후 결과 확인</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  title: { marginTop: 30, fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: '#333', marginBottom: 20 },
  analyzeButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  analyzeButtonText: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
  resultText: { textAlign: 'center', fontSize: 16, color: '#333', marginBottom: 15 },
  itemBox: { backgroundColor: '#FFF', borderRadius: 12, padding: 15, marginBottom: 15, elevation: 2 },
  itemText: { fontSize: 14, color: '#333', marginBottom: 5 },
  link: { color: '#10B981', fontWeight: 'bold', marginTop: 5 },
});

export default AutoPhoneAnalysisScreen;
