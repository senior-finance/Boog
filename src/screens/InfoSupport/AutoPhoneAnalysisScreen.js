// src/AutoPhoneAnalysisScreen.js
import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { NativeModules, PermissionsAndroid } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';
import { checkSpamForNumber } from './PhoneUtils';
import CustomText from '../../components/CustomText';
import CustomModal from '../../components/CustomModal';

const { PhoneAnalysisModule } = NativeModules;

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
  // 커스텀 모달
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalButtons, setModalButtons] = useState([]);

  const showModal = (title, message, buttons = [{ text: '확인', onPress: () => setModalVisible(false), color: '#4B7BE5' }]) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalButtons(buttons);
    setModalVisible(true);
  };

  const [resultText, setResultText] = useState('');
  const [suspiciousList, setSuspiciousList] = useState([]);
  const [loading, setLoading] = useState(false);

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
      setResultText('권한이 거부되었습니다. 설정에서 권한을 허용해주세요.');
      return;
    }

    setLoading(true);
    setTimeout(() => setLoading(false), 2000); // 최소 2초 로딩 보장

    let found = [];

    await new Promise((resolve) => {
      PhoneAnalysisModule.getAllSMS((smsList) => {
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
      PhoneAnalysisModule.getRecentCallLogs((logs) => {
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

    const autoCheckedFound = await Promise.all(found.map(async (item) => {
      try {
        const isSpam = await checkSpamForNumber(item.sender);
        return { ...item, whowhoResult: isSpam };
      } catch (err) {
        console.log(item.sender, '번호 조회 에러:', err);
        return { ...item, whowhoResult: null };
      }
    }));

    setSuspiciousList(autoCheckedFound);

    if (autoCheckedFound.length === 0) {
      setResultText('오늘은 의심스러운 문자나 통화 기록이 없습니다.');
    } else {
      const smsCount = autoCheckedFound.filter(item => item.type === 'sms').length;
      const callCount = autoCheckedFound.filter(item => item.type === 'call').length;
      setResultText(`의심 기록 ${autoCheckedFound.length}건 발견됨!`);

      setTimeout(() => {
        showModal(
          '분석 요소',
          `총 ${autoCheckedFound.length}개의 의심 기록이 발견되었습니다.\n\n문자: ${smsCount}개\n통화: ${callCount}건`
        );
      }, 500);
    }
  };

  const handleItemPress = (item) => {
    let detail = item.type === 'sms'
      ? '이 문자는 피싱 가능성이 있는 키워드를 포함하고 있어 주의가 필요합니다.'
      : '짧은 통화나 070 번호는 스팸일 가능성이 높습니다. 꼭 확인하세요!';

    showModal(
      item.type === 'sms' ? '문자 상세 분석' : '통화 상세 분석',
      `${item.sender}\n\n내용: ${item.text}\n\n의심 키워드: ${item.keywords.join(', ')}\n\n${detail}`
    );
  };

  return (
    <LinearGradient colors={['#D4E6FF', '#EAF4FF']} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.top}>
          <CustomText style={styles.title}>📱 오늘의 통화/문자 분석</CustomText>

          {loading ? (
            <LottieView
              source={require('../../assets/loadingg.json')}
              autoPlay
              loop
              style={styles.loadingAnimation}
            />
          ) : (
            <>
              <TouchableOpacity style={styles.analyzeButton} onPress={analyze}>
                <CustomText style={styles.analyzeButtonText}>🔍 오늘 기록 스캔하기</CustomText>
              </TouchableOpacity>
              <CustomText style={styles.resultText}>{resultText}</CustomText>
              {suspiciousList.map((item, index) => (
                <TouchableOpacity key={index} style={styles.itemBox} onPress={() => handleItemPress(item)}>
                  <View style={styles.itemHeader}>
                    {item.type === 'sms' ? (
                      <Ionicons name="chatbubble-outline" size={20} color="#4B7BE5" style={styles.icon} />
                    ) : (
                      <Ionicons name="call-outline" size={20} color="#4B7BE5" style={styles.icon} />
                    )}
                    <CustomText style={styles.itemSender}>
                      {item.sender} {item.type === 'sms' ? '(문자)' : '(통화)'}
                    </CustomText>
                  </View>

                  <CustomText style={styles.itemText}>{item.text}</CustomText>
                  <CustomText style={styles.itemText}>의심: {item.keywords.join(', ')}</CustomText>
                  {item.type === 'call' && item.whowhoResult !== null && (
                    <CustomText style={styles.itemText}>
                      통화 분석 결과: {item.whowhoResult ? '스팸(의심)' : '정상'}
                    </CustomText>
                  )}
                </TouchableOpacity>
              ))}
            </>
          )}
        </View>
      </View>
      <CustomModal
        visible={modalVisible}
        title={modalTitle}
        message={modalMessage}
        buttons={modalButtons}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 20 },
  top: { flex: 1, justifyContent: 'flex-start', alignItems: 'center' },
  loadingAnimation: {
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 40,
  },
  title: {
    marginTop: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1A237E',
    marginBottom: 20,
  },
  analyzeButton: {
    backgroundColor: 'rgba(49, 116, 199, 0.97)',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
    width: '80%',
  },
  analyzeButtonText: { fontWeight: 'bold', color: '#FFFFFF' },
  resultText: { textAlign: 'center', color: '#1A237E', marginBottom: 15 },
  itemBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#B3D1FF',
  },
  itemHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  icon: { marginRight: 8 },
  itemSender: { color: '#0052CC', fontWeight: 'bold' },
  itemText: { color: '#0052CC', marginBottom: 5 },
});

export default AutoPhoneAnalysisScreen;
