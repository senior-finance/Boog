// ✅ WithdrawAuthScreen.tsx
// ✅ 기존 기능 유지 + UI를 전달한 이미지와 동일하게 업데이트

import { React, useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import ReactNativeBiometrics from 'react-native-biometrics';
import { deposit, withdraw, mongoDB, addNotification } from '../../database/mongoDB';
import CustomModal from '../../components/CustomModal';
import CustomNumPad from '../../components/CustomNumPad';
import PushNotification from 'react-native-push-notification';

const { height } = Dimensions.get('window');

export default function WithdrawAuthScreen() {
  const nav = useNavigation();
  const {
    accountNumTo,
    bankTo,
    formattedAmount,
    rawAmount,
    amount,
    bankName,
    accountNum,
    testBedAccount,
  } = useRoute().params;

  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalButtons, setModalButtons] = useState([]);
  const [authTries, setAuthTries] = useState(0);
  const [showNumPad, setShowNumPad] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [counterpartyName, setCounterpartyName] = useState('');
  const [isOwnTransfer, setIsOwnTransfer] = useState(false);
  const slideAnim = useRef(new Animated.Value(height)).current;

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

  const sendHiNotification = (bankName, amountNum) => {
    PushNotification.localNotification({
      /* Android & iOS 공통 */
      channelId: 'default-channel-id', // Android는 필수
      title: '송금 안내',                   // 제목
      message: `${bankName}에서${amountNum}을 송금했어요`,                 // 본문

      /* iOS 전용 옵션 (필요 시) */
      // soundName: 'default',
      // playSound: true,
    });
  };

  +useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: showNumPad ? 0 : height,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [showNumPad]);

  useEffect(() => {
    (async () => {
      const accounts = await mongoDB('find', testBedAccount, 'account', { query: {} });
      const normalized = accountNumTo.replace(/-/g, '');
      const isOwn = accounts.some(acc => acc.accountNum.replace(/-/g, '') === normalized);

      if (isOwn) {
        setCounterpartyName('나');
        setIsOwnTransfer(true);
      } else {
        const other = await mongoDB(
          'findOne',
          'common',
          'name',
          { query: { dbName: { $ne: testBedAccount } } }
        );
        setCounterpartyName(other?.koreaName || '상대방');
        setIsOwnTransfer(false);
      }
    })();
  }, [accountNumTo, testBedAccount]);

  const showModal = (title, message, buttons = [{ text: '확인', onPress: () => setModalVisible(false), color: '#4B7BE5' }]) => {
    // PIN 패드 모달이 떠있다면 숨기고
    setShowNumPad(false);
    setModalTitle(title);
    setModalMessage(message);
    setModalButtons(buttons);
    setModalVisible(true);
  };

  const handleWithdraw = async () => {
    const amountNum = Number(rawAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return showModal('오류', '유효한 금액을 입력해주세요.');
    }
    try {
      const fromDb = testBedAccount;
      const toDb = isOwnTransfer ? fromDb : (fromDb === 'kmj' ? 'hwc' : 'kmj');

      await withdraw(
        fromDb,
        accountNum.replace(/-/g, ''),
        bankName,
        amountNum,
        accountNumTo.replace(/-/g, ''),  // 상대방 계좌
        bankTo                         // 상대방 은행
      );

      await deposit(
        toDb,
        accountNumTo.replace(/-/g, ''),
        bankTo,
        amountNum,
        accountNum.replace(/-/g, ''),  // 상대방(송금자) 계좌
        bankName                       // 상대방(송금자) 은행
      );
      
      await addNotification(fromDb, {
        icon: 'navigate-outline',
        iconColor: 'rgb(0, 100, 248)',
        borderColor: '#FFCDD2',
        content: `${bankName}에서${formattedAmount}을 송금했어요`,
      });
      sendHiNotification(bankName, formattedAmount);
      showModal('송금 완료', `${bankTo}${formattedAmount} 송금이 완료되었습니다.`);
    } catch (err) {
      showModal('송금 실패', '송금 처리 중 오류가 발생했습니다.');
    }
  };

  const onAuthAndWithdraw = async () => {
    // ① 버튼 누르는 순간 PIN 패드부터 띄우기
    setShowNumPad(true);

    const rnBiometrics = new ReactNativeBiometrics();
    const { available, biometryType } = await rnBiometrics.isSensorAvailable();
    let success = false;

    // ② 3회 미만 실패 시에만 생체인증 띄우기
    if (available && biometryType && authTries < 2) {
      const promptMessage = biometryType === 'Face ID' ? 'Face ID 인증' : '지문 인증';
      ({ success } = await rnBiometrics.simplePrompt({ promptMessage, cancelButtonText: '취소' }));
    }

    if (success) {
      // ③ 인증 성공하면 PIN 패드 숨기고 바로 송금
      setShowNumPad(false);
      return handleWithdraw();
    }

    // ④ 실패 카운트 업
    setAuthTries(prev => prev + 1);

    if (authTries + 1 < 2) {
      showModal('인증 실패', '생체 인증이 실패했습니다. 다시 시도해주세요.');
    }
    // ⑤ else { 3회 실패 } 이후엔 showNumPad=true 상태로 PIN만 인터랙티브
  };

  return (
    <LinearGradient colors={['#D8ECFF', '#E9F4FF']} style={styles.container}>
      <Text style={styles.accountName}>{counterpartyName} 에게</Text>

      <Text style={styles.label}>송금할 계좌 번호</Text>
      <Text style={styles.textBox}>{accountNumTo}</Text>

      <Text style={styles.label}>송금할 은행</Text>
      <Text style={[styles.textBox, { color: '#2D63E7' }]}>{bankTo}</Text>

      <Text style={styles.label}>입력된 송금액</Text>
      <Text style={[styles.textBox, { color: '#2D63E7' }]}>{formattedAmount}</Text>

      <Text style={styles.description}>계좌 번호와 금액이 맞는지{'\n'}다시 한번 확인해주세요!{'\n'}인증을 완료하시면 송금이 진행됩니다.</Text>

      <TouchableOpacity onPress={onAuthAndWithdraw} style={styles.sendButton}>
        <Text style={styles.sendButtonText}>인증하고 송금할게요</Text>
      </TouchableOpacity>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.navButton} onPress={() => nav.goBack()}>
          <Text style={styles.navButtonText}>이전으로 돌아갈게요</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => nav.navigate('MainTabs')}>
          <Text style={styles.navButtonText}>처음 화면으로 갈게요</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showNumPad} transparent animationType="none">
        <TouchableWithoutFeedback>
          <View style={styles.modalBackground}>
            <TouchableWithoutFeedback>
              <Animated.View style={[styles.numpadWrapper, { transform: [{ translateY: slideAnim }] }]}>
                {/* ★ 입력 중인 PIN 자리 표시 */}
                <View style={styles.pinPreview}>
                  {Array(6).fill().map((_, idx) => (
                    <Text key={idx} style={styles.pinDot}>
                      {idx < pinInput.length ? '✔️' : '❔'}
                    </Text>
                  ))}
                </View>
                <CustomNumPad
                  onPress={(key) => {
                    // 3회 실패 전까지는 입력 무시
                    if (authTries < 2) return;
                    // 숫자 키만 들어오므로 바로 처리
                    const next = (pinInput + key).slice(0, 6);
                    // 6자리 채워질 때까지 입력만 받고 로직 실행 금지
                    if (next.length < 6) {
                      setPinInput(next);
                      return;
                    }
                    // 6자리 완성 시
                    if (next === '828282') {
                      setAuthTries(3);        // 성공 시 3회로 초기화
                      setPinInput('');        // 입력 초기화
                      setShowNumPad(false);
                      handleWithdraw();
                    } else {
                      setPinInput('');        // 입력 초기화
                      showModal('PIN 오류', 'PIN이 일치하지 않습니다.');
                      setAuthTries(prev => prev - 1);
                    }
                  }}
                />
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <CustomModal
        visible={modalVisible}
        title={modalTitle}
        message={modalMessage}
        buttons={modalButtons}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#DAEFFF',
  },
  accountName: {
    fontSize: 25,
    color: '#1B1B1B',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  label: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1B1B1B',
    marginTop: 12,
  },
  textBox: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#F6FAFF',
    borderWidth: 1.5,
    borderColor: '#A9C7F6',
    borderRadius: 16,
    paddingVertical: 20,
    marginVertical: 10,
  },
  description: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '500',
    color: '#1B1B1B',
    marginTop: 15,
    marginBottom: 20,
  },
  sendButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#2D63E7',
    borderRadius: 30,
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5,
  },
  sendButtonText: {
    color: '#1A4CC0', // 기존보다 조금 더 진하고 차분한 블루톤
    fontSize: 22,
    fontWeight: '900',
    textShadowColor: 'rgba(45, 99, 231, 0.25)', // 💡 더 자연스러운 그림자
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1.5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
    marginTop: 10,
  },
  navButton: {
    flex: 1,
    backgroundColor: '#4C6EF5',
    paddingVertical: 20,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  numpadWrapper: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    position: 'absolute', bottom: 0, left: 0, right: 0
  },
  pinPreview: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,    // NumPad 와 간격
    padding: 10,
    borderRadius: 10,
    // backgroundColor: 'rgba(0, 28, 185, 0.39)'
  },
  pinDot: {
    fontSize: +24,        // 별표 크기
    fontWeight: '500',
    marginHorizontal: 5, // 별표 간 간격
    color: 'rgba(17, 0, 255, 0.83)'
  },
});
