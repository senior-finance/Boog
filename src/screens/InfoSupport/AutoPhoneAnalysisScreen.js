// src/AutoPhoneAnalysisScreen.js
import React, { useState, useEffect } from 'react';
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
import { ScrollView } from 'react-native';
import { addNotification, getNotifications } from '../../database/mongoDB';
import PushNotification from 'react-native-push-notification';
import { useUser } from '../Login/UserContext';

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

  const { userInfo } = useUser(); // 로그인 시 setUserInfo로 저장된 값

  useEffect(() => {
    // 1. 푸시 알림 설정 (한 번만)
    PushNotification.configure({
      // (필요 시) 토큰 받기
      onRegister: function (token) {
        // console.log('TOKEN:', token);
      },
      // 알림 탭/닫기 시
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
        notification.finish(PushNotification.FetchResult.NoData);
      },
      // Android 권한 요청
      requestPermissions: true,
    });

    // 2. Android용 채널 생성 (Android 8.0+)
    PushNotification.createChannel(
      {
        channelId: 'default-channel-id', // 채널 ID
        channelName: '부금이 알람 채널',  // 채널 이름
        // importance: 3,                   // (optional) 중요도
      },
      // (created) => console.log(`createChannel returned '${created}'`)
    );
  }, []);

  // 버튼 눌렀을 때 호출
  const sendHiNotification = () => {
    PushNotification.localNotification({
      /* Android & iOS 공통 */
      channelId: 'default-channel-id', // Android는 필수
      title: '제목이야',                   // 제목
      message: '내용이야',                 // 본문

      /* iOS 전용 옵션 (필요 시) */
      // soundName: 'default',
      // playSound: true,
    });
  };

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
    const userName = userInfo?.username || 'Guest';
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      setResultText('권한이 거부되었습니다. 설정에서 권한을 허용해주세요.');
      return;
    }

    setLoading(true);
    setTimeout(() => setLoading(false), 2000);

    let found = [];

    await new Promise((resolve) => {
      PhoneAnalysisModule.getAllSMS((smsList) => {
        smsList.forEach((sms) => {
          if (isToday(sms.timestamp)) {
            const matches = phishingKeywords.filter((kw) => sms.body.includes(kw));
            const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/gi;
            const hasLink = urlRegex.test(sms.body);

            if (hasLink && !matches.includes('링크 포함')) {
              matches.push('링크 포함');
            }

            if (matches.length > 0 || hasLink) {
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
      setResultText('✅오늘은 의심스러운 문자나 통화 기록이 없습니다.');
      await addNotification(userName, {
        icon: 'checkbox-outline',
        iconColor: '#4CAF50',
        content: '오늘 통화/문자 분석 결과 이상 없어요!'
      });
      PushNotification.localNotification({
        channelId: 'default-channel-id',
        title: '통화/문자 분석 완료',
        message: '오늘 분석 결과 이상이 없어요!'
      });
    } else {
      const smsCount = autoCheckedFound.filter(item => item.type === 'sms').length;
      const callCount = autoCheckedFound.filter(item => item.type === 'call').length;
      setResultText(`의심 기록 ${autoCheckedFound.length}건 발견됨!`);
      await addNotification(userName, { content: `의심 기록 ${autoCheckedFound.length}건 발견됨` });
      PushNotification.localNotification({
        channelId: 'default-channel-id',
        title: '분석 완료',
        message: `의심 기록 ${autoCheckedFound.length}건 발견됨`,
      });

      setTimeout(() => {
        showModal(
          '분석 요소',
          `총 ${autoCheckedFound.length}개의 의심 기록이 발견되었습니다.\n\n문자: ${smsCount}개\n통화: ${callCount}건`
        );
      }, 500);
      await addNotification(userName, {
        icon: ' warning-outline',
        iconColor: '#F44336',
        content: `의심 기록 ${autoCheckedFound.length}건 발견됨`
      });
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
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }} style={{ width: '100%' }}>
              <View style={{ alignItems: 'center' }}>
                <TouchableOpacity style={styles.analyzeButton} onPress={analyze}>
                  <CustomText style={styles.analyzeButtonText}>🔍 오늘 기록 스캔하기</CustomText>
                </TouchableOpacity>
                <CustomText style={styles.resultText}>{resultText}</CustomText>
                {suspiciousList.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.itemBox}
                    onPress={() => handleItemPress(item)}
                  >
                    <View style={styles.itemHeader}>
                      <CustomText style={styles.itemSender}>
                        {item.type === 'sms' ? '💬' : '📞'} {item.sender} ({item.type === 'sms' ? '문자' : '통화'})
                      </CustomText>
                    </View>

                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 5, alignItems: 'center' }}>
                      <CustomText style={styles.itemTextTitle}>
                        📩 의심 사유 :{' '}
                      </CustomText>
                      <CustomText style={styles.itemText}>
                        {item.keywords.includes('링크 포함') ? '링크가 포함된 문자입니다.' : '피싱 키워드'}
                      </CustomText>
                    </View>

                    <CustomText style={styles.itemTextKeyword}>
                      ❗ 의심 키워드 : {item.keywords.join(', ')}
                    </CustomText>

                    {item.type === 'call' && item.whowhoResult !== null && (
                      <CustomText style={styles.itemText}>
                        분석 결과: {item.whowhoResult ? '❗ 스팸(의심)' : '✅ 정상'}
                      </CustomText>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
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
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#B3D1FF',
    width: '95%',
    alignSelf: 'center',
  },
  itemHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  itemSender: { color: '#0052CC', fontWeight: 'bold' },

  itemText: {
    color: '#1A237E',
    fontSize: 14,
    marginBottom: 5,
  },
  itemTextKeyword: {
    color: '#D32F2F',
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemTextTitle: {
    color: '#1A237E',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default AutoPhoneAnalysisScreen;
