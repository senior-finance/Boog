// screens/WithdrawAccountScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Alert,
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
import LottieView from 'lottie-react-native';
import { accountGetAll, withdrawVerify } from '../../database/mongoDB';

export default function WithdrawAccountScreen() {
  const nav = useNavigation();
  const [loading, setLoading] = useState(false);

  const { amount, bankName, accountNum, testBedAccount } = useRoute().params;

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
      Alert.alert(
        '알림',
        '계좌번호는 10자리여야 해요',
      );
      return;
    }
    try {
      setLoading(true);
      const accounts = await withdrawVerify({accountNum : digitsOnly});
      // 동기화 시간 랜덤 지연
      const delayMs = Math.floor(Math.random() * 500) + 500;
      await new Promise(res => setTimeout(res, delayMs));

      if (!accounts || accounts.length === 0) {
        setTimeout(() => {
          setLoading(false);
        }, 500);
        Alert.alert('알림', '등록된 계좌가 아니에요');
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
      console.error(err);
      // 에러 났을 때도 로딩 끄기
      setTimeout(() => {
        setLoading(false);
      }, 700);
      Alert.alert('오류', '계좌 확인 중 에러가 발생했어요');
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
        style={{
          fontSize: 24,
          textAlign: 'center',
          backgroundColor: '#fff',
          borderWidth: 5,
          borderColor: '#ccc',
          padding: 10,
          margin: 10,
          borderRadius: 20
        }}
        showSoftInputOnFocus={false}
      />
      <View style={styles.keypadContainer}>
        <CustomNumPad
          onPress={handlePress}
          keyRows={myKeyRows}
          decimalSeparator=","
          textStyle={styles.keypadText}
          containerStyle={styles.numpadInner}
        />
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
          <TouchableOpacity
            onPress={() => nav.goBack()}
            style={{
              width: 160,
              paddingVertical: 20,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '600' }}>
              이전
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
            disabled={!accountNumTo}         // accountNumTo 없으면 비활성화
            onPress={handleNext}
            style={{
              width: 160,
              paddingVertical: 20,
              alignItems: 'center',
              opacity: accountNumTo ? 1 : 0.6,  // 비활성 시 반투명
            }}
          >
            <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '600' }}>
              다음
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
      {loading && (
        <View style={styles.loadingOverlay}>
          <LottieView
            source={require('../../assets/animeLoading2.json')}
            autoPlay
            loop={false}
            style={styles.lottie}
          />
        </View>
      )}
    </LinearGradient >
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',   // 세로 가운데
    // alignItems: 'center',       // 가로 가운데
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
    fontSize: 22,
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
    color: '#3498DB',   // 빨간색
    fontSize: 16,
  },
  bankText: {
    color: '#3498DB',   // 파란색
    fontSize: 16,
  },
  amountText: {
    color: '#3498DB',   // 초록색
    fontSize: 16,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,    // 부모 전체 덮기
    backgroundColor: 'rgba(255, 255, 255, 0.2)',   // 반투명 배경
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,                            // 최상위
  },
  lottie: {
    width: 320,
    height: 320,
  },
});