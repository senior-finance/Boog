// screens/WithdrawAccountScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
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
import LottieView from 'lottie-react-native';
import { accountGetAll, withdrawVerify } from '../../database/mongoDB';
import CustomModal from '../../components/CustomModal';

export default function WithdrawAccountScreen() {
  // 커스텀 모달
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalButtons, setModalButtons] = useState([]);

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
  const [loading, setLoading] = useState(false);

  const { amount, bankName, accountNum, testBedAccount } = useRoute().params;
  // console.log(testBedAccount)

  const [account, setAccount] = useState('');
  const [accountNumTo, setaccountNumTo] = useState(''); // 계좌번호 입력

  // 화면 전용 키 레이아웃
  const myKeyRows = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['모두 지우기', '0', '한칸 지우기'],
  ];

  // 1) 포맷 함수: 하이픈 제거 → 3글자씩 묶어서 다시 하이픈 삽입
  function formatAccount(raw) {
    const digits = raw.replace(/-/g, '');
    const groups = digits.match(/.{1,3}/g) || [];
    return groups.join('-');
  }

  const handlePress = (digit) => {
    if (digit === '모두 지우기') {
      setaccountNumTo('');
    }
    else if (digit === '한칸 지우기') {
      setaccountNumTo(prev => {
        // 하이픈 제거 후 마지막 숫자 하나 제거 → 다시 포맷
        const trimmed = prev.replace(/-/g, '').slice(0, -1);
        return formatAccount(trimmed);
      });
    }
    else {
      setaccountNumTo(prev => {
        // 하이픈 제거 후 숫자 길이 제한(10자리)
        const digits = prev.replace(/-/g, '');
        if (digits.length >= 10) return prev;
        // 새 숫자 추가 → 다시 포맷
        return formatAccount(digits + digit);
      });
    }
  };

  const handleNext = async () => {
    const digitsOnly = accountNumTo.replace(/-/g, '');
    if (digitsOnly.length < 10 || digitsOnly.length > 10) {
      // 계좌번호가 10자리가 아닐 때
      showModal('알림', '계좌번호는 10자리여야 해요');
      return;
    }
    try {
      setLoading(true);
      const accounts = await withdrawVerify({ accountNum: digitsOnly });
      // 동기화 시간 랜덤 지연
      const delayMs = Math.floor(Math.random() * 500) + 500;
      await new Promise(res => setTimeout(res, delayMs));

      if (!accounts || accounts.length === 0) {
        setTimeout(() => {
          setLoading(false);
        }, 500);
        showModal('알림', '등록된 계좌가 아니에요');
        return;
      }

      // 성공 시 로딩 끄고 네비게이트
      setTimeout(() => {
        setLoading(false);
        nav.navigate('WithdrawBank', {
          accountNumTo,
          bankName,
          amount,
          accountNum,
          testBedAccount,
        });
      }, 700);

    } catch (err) {
      console.log(err);
      // 에러 났을 때도 로딩 끄기
      setTimeout(() => {
        setLoading(false);
      }, 700);
      showModal('오류', '계좌 확인 중 에러가 발생했어요');
    }
  };

  return (
    <LinearGradient
      colors={['rgb(216,236,255)', 'rgb(233,244,255)']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.title}>계좌 번호 10자리를 입력하세요</Text>
      <View style={styles.inputWrapper}>
        <TextInputMask
          type={'money'}
          options={{
            precision: 0, // 소수점 없음
            separator: '', // 소수점 구분자
            delimiter: '-', // 천 단위 구분자
            unit: '', // 앞에 붙는 단위
            // suffixUnit: '원', // 뒤에 붙는 단위
          }}
          value={accountNumTo}
          onChangeText={text => setaccountNumTo(text)}
          // placeholder="모의 계좌 번호 10자리"
          keyboardType="numeric"
          maxLength={13} // '-' 포함 14자리       
          style={styles.textInput}
          showSoftInputOnFo
          cus={false}
        />
      </View>
      <View style={styles.keypadContainer}>
        {/* <CustomNumPad
          onPress={handlePress}
          keyRows={myKeyRows}
          decimalSeparator=","
          textStyle={styles.keypadText}
          containerStyle={styles.numpadInner}
        /> */}
      </View>
      <TouchableOpacity style={styles.clearButton} onPress={() => setAccountNumTo('')}>
        <Text style={styles.clearButtonText}>모두 지우기</Text>
      </TouchableOpacity>

      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={() => nav.goBack()} style={styles.button}>
          <Text style={styles.buttonText}>이전</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleNext}
          disabled={!accountNumTo}
          style={[styles.button, !accountNumTo && { opacity: 0.5 }]}
        >
          <Text style={styles.buttonText}>다음</Text>
        </TouchableOpacity>
      </View>
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
        </LinearGradient>
      </View>
      {loading && (
        <View style={styles.loadingOverlay}>
          <LottieView
            source={require('../../assets/loadingg.json')}
            autoPlay
            loop
            style={styles.lottie}
          />
        </View>
      )}
      <CustomModal
        visible={modalVisible}
        title={modalTitle}
        message={modalMessage}
        buttons={modalButtons}
      />
    </LinearGradient >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  title: {
    fontSize: 23,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    color: '#333',
  },
  inputWrapper: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  textInput: {
    fontSize: 24,
    textAlign: 'center',
    color: '#333',
  },
  clearButton: {
    alignSelf: 'center',
    backgroundColor: '#DDE6F8',
    paddingHorizontal: 100,
    paddingVertical: 20,
    borderRadius: 30,
    marginTop: 15,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4, // Android용 그림자
    borderWidth: 1.5,
    borderColor: '#B0C8F5', // 연한 테두리 추가
  },
  clearButtonText: {
    color: '#4C6EF5',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 40,
  },
  button: {
    flex: 1,
    paddingVertical: 18,
    backgroundColor: '#4C6EF5',
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  lottie: {
    width: 220,
    height: 220,
  },
  title: {
    fontSize: 23,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    color: '#333',
  },
  inputWrapper: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  textInput: {
    fontSize: 24,
    textAlign: 'center',
    color: '#333',
  },
  clearButton: {
    alignSelf: 'center',
    backgroundColor: '#DDE6F8',
    paddingHorizontal: 100,
    paddingVertical: 20,
    borderRadius: 30,
    marginTop: 15,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4, // Android용 그림자
    borderWidth: 1.5,
    borderColor: '#B0C8F5', // 연한 테두리 추가
  },
  clearButtonText: {
    color: '#4C6EF5',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 40,
  },
  button: {
    flex: 1,
    paddingVertical: 18,
    backgroundColor: '#4C6EF5',
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  lottie: {
    width: 220,
    height: 220,
  },
});