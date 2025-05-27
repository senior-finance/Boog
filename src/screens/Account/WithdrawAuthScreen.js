// screens/WithdrawAuthScreen.tsx
import { React, useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  Button,
  FlatList,
  TextInput,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
  Image,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import CustomText from '../../components/CustomText';
import { NumPad } from '@umit-turk/react-native-num-pad';
import { TextInputMask } from 'react-native-masked-text';
import CustomNumPad from '../../components/CustomNumPad';
import LinearGradient from 'react-native-linear-gradient';
import ReactNativeBiometrics from 'react-native-biometrics';
import { deposit, withdraw, accountUpsert, accountGet, withdrawVerify, mongoDB } from '../../database/mongoDB';
import { CONFIG } from './AccountScreen';
import CustomModal from '../../components/CustomModal';

export default function WithdrawAuthScreen() {
  // 커스텀 모달
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalButtons, setModalButtons] = useState([]);

  // 컴포넌트 최상단
  const [authTries, setAuthTries] = useState(0);
  const [showNumPad, setShowNumPad] = useState(false);
  const [pinInput, setPinInput] = useState('');

  const showModal = (
    title,
    message,
    buttons = [
      {
        text: '확인',
        onPress: () => setModalVisible(false),
        color: '#4B7BE5',
      },
    ]
  ) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalButtons(buttons);
    setModalVisible(true);
  };

  const nav = useNavigation();
  const { accountNumTo, bankTo, formattedAmount, rawAmount } = useRoute().params;
  const { amount, bankName, accountNum, testBedAccount } = useRoute().params;

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [biometryType, setBiometryType] = useState(null);
  const [transactionType, setTransactionType] = useState(''); // '나에게' 또는 '상대방에게'
  const [counterpartyName, setCounterpartyName] = useState(''); // 상대방 한글 이름

  // 하이픈 제거한 계좌번호
  const normalizedAcctNum = accountNumTo.replace(/-/g, '');

  useEffect(() => {
    (async () => {
      // 1) 내 DB의 account 컬렉션에서 계좌 조회
      const accounts = await mongoDB(
        'find',
        testBedAccount,    // 'kmj' or 'hwc'
        'account',
        { query: {} }
      );

      const normalized = accountNumTo.replace(/-/g, '');
      const isOwn = accounts.some(acc =>
        acc.accountNum.replace(/-/g, '') === normalized
      );

      if (isOwn) {
        // 2-A) 내 계좌면 “나” 처리
        setTransactionType('나');
        setCounterpartyName('나');
      } else {
        // 2-B) 상대방 계좌면 “상대방” 처리 + 이름 조회
        setTransactionType('상대방');
        // dbName이 내 것이 아닌(≠ testBedAccount) common.name 문서를 가져옴
        const other = await mongoDB(
          'findOne',
          'common',
          'name',
          { query: { dbName: { $ne: testBedAccount } } }
        );
        setCounterpartyName(other?.koreaName || '');
      }
    })();
  }, [accountNumTo, testBedAccount]);

  const handleWithdraw = async () => {
    const numericAmount = Number(rawAmount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      showModal('오류', '유효한 금액을 입력하세요');
      return;
    }

    // 내 계좌번호 (하이픈 제거)
    const fromDb = testBedAccount;      // 'kmj' or 'hwc'
    const rawFromAccountNum = accountNum;          // ex) "1-124-573-368"
    const fromAccountNum = rawFromAccountNum.replace(/-/g, ''); // "1124573368"
    const fromBank = bankName;

    // 상대 계좌번호 (하이픈 제거)
    const toDb = fromDb === 'kmj' ? 'hwc' : 'kmj';
    const rawToAccountNum = accountNumTo;        // ex) "2-345-678-901"
    const toAccountNum = rawToAccountNum.replace(/-/g, '');   // "2345678901"
    const toBank = bankTo;

    try {
      // 1) 내 계좌에서 출금 (withdraw 함수의 accountId 매개변수에 accountNum을 넘김)
      await withdraw(fromDb, fromAccountNum, fromBank, numericAmount);
      console.log('내 계좌 출금:', fromDb, fromAccountNum, fromBank, numericAmount);

      // 2) 상대 계좌에 입금
      await deposit(toDb, toAccountNum, toBank, numericAmount);
      console.log('상대 계좌 입금:', toDb, toAccountNum, toBank, numericAmount);

      showModal(
        '송금 완료',
        `${toBank} ${formattedAmount} 송금이 완료되었습니다.`
      );
      // nav.goBack();
    } catch (err) {
      console.log('송금 중 오류:', err);
      showModal('송금 실패', '송금 처리 중 오류가 발생했습니다.');
    }
  };

  // 생체 인증 실행 함수
  const onAuthAndWithdraw = async () => {
    const rnBiometrics = new ReactNativeBiometrics();
    const { available, biometryType } = await rnBiometrics.isSensorAvailable();
    let success = false;

    if (available && biometryType) {
      const promptMessage = biometryType === 'Face ID' ? 'Face ID 인증' : '지문 인증';
      ({ success } = await rnBiometrics.simplePrompt({ promptMessage, cancelButtonText: '취소' }));
    }

    if (success) {
      // 인증 성공 시 원래 출금 로직 호출
      return handleWithdraw();
    }

    // 인증 실패
    setAuthTries(t => t + 1);
    if (authTries + 1 >= 3) {
      setShowNumPad(true);
    } else {
      showModal('인증 실패', '생체 인증이 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <LinearGradient
      colors={['rgb(216,236,255)', 'rgb(233,244,255)']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.accountName}>
        {counterpartyName} 에게 송금할게요
      </Text>
      <Text style={styles.accountText}>송금할 상대방의 계좌 번호</Text>
      <Text style={styles.textValue}>{accountNumTo}</Text>
      <Text style={styles.bankText}>송금할 은행</Text>
      <Text style={styles.textValue}>{bankTo}</Text>
      <Text style={styles.amountText}>입력된 송금액</Text>
      <Text style={styles.textValue}>{formattedAmount}</Text>
      <Text style={styles.title}>계좌 번호, 금액이 정말 맞으신가요?{'\n'}한번 더 확인해보세요!{'\n'}인증을 진행하면 송금금이 완료돼요</Text>
      <LinearGradient
        colors={['#4C6EF5', '#3B5BDB']}      // 원하는 그라데이션 컬러
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          borderRadius: 25,                 // 둥글게
          marginVertical: 20,
        }}
      >
        <TouchableOpacity
          onPress={onAuthAndWithdraw}
          style={{
            width: 400,
            paddingVertical: 20,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '600' }}>
            인증하고 송금할게요
          </Text>
        </TouchableOpacity>
      </LinearGradient>
      <View style={styles.buttonRow}>
        <LinearGradient
          colors={['#4C6EF5', '#3B5BDB']}      // 원하는 그라데이션 컬러
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            borderRadius: 25,                 // 둥글게
            marginVertical: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => nav.goBack()}
            style={{
              width: 160,
              paddingVertical: 20,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '600' }}>
              이전으로 돌아갈게요
            </Text>
          </TouchableOpacity>
        </LinearGradient>
        <LinearGradient
          colors={['#4C6EF5', '#3B5BDB']}      // 원하는 그라데이션 컬러
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            borderRadius: 25,                 // 둥글게
            marginVertical: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => nav.navigate('MainTabs')}
            style={{
              width: 160,
              paddingVertical: 20,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '600' }}>
              처음 화면으로 갈게요
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
      {/* 화면 최하단에 */}
      <Modal
        visible={showNumPad}
        transparent
        animationType="slide"
        onRequestClose={() => { }}
      >
        {/* 바깥영역 터치 차단 */}
        <TouchableWithoutFeedback>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <TouchableWithoutFeedback>
              <Animated.View
                style={{
                  backgroundColor: '#fff',
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  padding: 20,
                  justifyContent: 'flex-end',
                }}
              >
                <CustomNumPad
                  onPress={(key) => {
                    if (key === '모두 지우기') {
                      setPinInput('');
                      return;
                    }
                    if (key === '한칸 지우기') {
                      setPinInput((p) => p.slice(0, -1));
                      return;
                    }
                    const next = (pinInput + key).slice(0, 6);
                    setPinInput(next);
                    if (next.length === 6) {
                      if (next === '111111') {
                        setShowNumPad(false);
                        handleWithdraw();
                      } else {
                        setPinInput('');
                        showModal('PIN 오류', 'PIN이 일치하지 않습니다.');
                      }
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
    // justifyContent: 'center',   // 세로 가운데
    alignItems: 'center',       // 가로 가운데
  },
  title: {
    textAlign: 'center',        // 텍스트 가운데 정렬
    fontSize: 24,               // 글자 크게 (원하는 크기로 조정)
    color: 'black',            // 노란색
    fontWeight: 'bold',         // 조금 더 강조하고 싶으면
    marginTop: 20,           // 아래 여백
    marginBottom: 20,           // 아래 여백
  },
  numpadInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  keypadContainer: {
    // NumPad 전체 래퍼 스타일
    marginVertical: 'auto',
  },
  keypadText: {
    // 버튼 텍스트 스타일
    fontSize: 30,
    fontWeight: '800',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // 좌우 끝에 배치
    alignItems: 'center',
    width: '100%',                    // 부모 너비 100%
    paddingHorizontal: 16,            // 양쪽 여백(필요에 따라 조정)
  },
  accountText: {
    textAlign: 'center', // 텍스트 가운데 정렬
    color: '#3498DB',
    fontSize: 28,
    marginTop: 20,
    // marginBottom: 20,
  },
  bankText: {
    textAlign: 'center',
    color: '#3498DB',   // 파란색
    fontSize: 28,
    // marginBottom: 20,
  },
  amountText: {
    textAlign: 'center',
    color: '#3498DB',
    fontSize: 28,
  },
  accountName: {
    textAlign: 'center',
    color: '#3498DB',
    fontSize: +32,
    fontWeight: "800",
  },
  textValue: {
    textAlign: 'center', // 텍스트 가운데 정렬
    color: '#000',
    fontSize: 40,
    backgroundColor: '#FAFAFA',
    fontWeight: 'bold',   // 진하게
    borderWidth: 2,
    margin: 10,
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
});