// screens/WithdrawAmountScreen.tsx
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
} from 'react-native'; import { useRoute, useNavigation } from '@react-navigation/native';
import CustomText from '../../components/CustomText';
import { NumPad } from '@umit-turk/react-native-num-pad';
import { TextInputMask } from 'react-native-masked-text';
import CustomNumPad from '../../components/CustomNumPad';
import LinearGradient from 'react-native-linear-gradient';

export default function WithdrawAmountScreen() {
  const { accountNumber, bank } = useRoute().params;
  const nav = useNavigation();
  const [amount, setAmount] = useState('');
  const [raw, setRaw] = useState('');
  const [error, setError] = useState('');
  
  const MAX_RAW = 10000000000; // 100억

  const handlePress = digit => {
    if (digit === '모두 지우기') {
      // 모두 지우기
      setAmount('');
    } else if (digit === '한칸 지우기') {
      // 한 글자씩 삭제
      setAmount(prev => prev.slice(0, -1));
    } else {
      // 숫자 또는 '000' 등 입력
      setAmount(prev => prev + digit);
    }
  };

  // 한국식 단위 포맷 (예: 1234567890 → "12억3456만7890")
  const formatKorean = s => {
    let n = BigInt(s.replace(/\D/g, '') || '0');
    if (n === 0n) return '';
    const units = [
      [10n ** 12n, ' 조 '],
      [10n ** 8n, ' 억 '],
      [10n ** 4n, ' 만 '],
      [1n, ' 원'],
    ];
    let res = '';
    for (const [u, label] of units) {
      const q = n / u;
      if (q) {
        res += q + label;
        n %= u;
      }
    }
    if (n) res += n; // 4자리 미만 남은 수
    return res;
  };

  return (
    <LinearGradient
      colors={['rgb(216,236,255)', 'rgb(233,244,255)']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.title}>출금할 금액을 입력 해주세요</Text>
      <Text style={styles.accountText}>출금할 계좌 번호 : {accountNumber}</Text>
      <Text style={styles.bankText}>출금할 은행 : {bank}</Text>
      {/* <TextInputMask
        type={'money'}
        options={{
          precision: 0, // 소수점 없음
          separator: '', // 소수점 구분자
          delimiter: ',', // 천 단위 구분자
          unit: '', // 앞에 붙는 단위
          // suffixUnit: '원', // 뒤에 붙는 단위
        }}
        value={amount}
        onChangeText={text => setAmount(text)}
        // style={styles.input}
        placeholder="금액 입력"
        keyboardType="numeric"
        returnKeyType="done"
        showSoftInputOnFocus={false}
        style={styles.inputBox}
      /> */}
      <TextInput
        // style={styles.input}
        keyboardType="numeric"
        returnKeyType="done"
        value={formatKorean(amount)}
        onChangeText={text => {
          let onlyNums = text.replace(/\D/g, '');
          // 최대값 체크
          if (Number(onlyNums) > MAX_RAW) {
            setError('최대 입력 가능 금액은 100억입니다.');
            onlyNums = MAX_RAW.toString();
          } else {
            setError('');
          }
          setRaw(onlyNums);
          setAmount(formatKorean(onlyNums));
        }}
        placeholder="금액 입력"
        showSoftInputOnFocus={false}
        style={[styles.inputBox]}
      />
      <View style={styles.keypadContainer}>
        <CustomNumPad
          onPress={handlePress}
          decimalSeparator=","
          buttonTextStyle={styles.keypadText}
          containerStyle={styles.numpadInner}
        />
      </View>
      {/* <Text style={styles.unit}>원</Text> */}
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
          disabled={!amount}         // accountNumber 없으면 비활성화
          onPress={() => nav.navigate('WithdrawAuth', { accountNumber, bank, formattedAmount: formatKorean(amount) })}
          style={{
            paddingVertical: 14,
            alignItems: 'center',
            opacity: amount ? 1 : 0.6,  // 비활성 시 반투명
          }}
        >
          <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '600' }}>
            다음
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </LinearGradient>
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
    fontSize: 30,
    fontWeight: '800',
  },
  inputBox: {
    fontSize: 30,
    fontWeight: '500',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 8,
    backgroundColor: '#fff',
    // Android 그림자
    elevation: 2,
    // iOS 그림자
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  accountText: {
    textAlign: 'center', // 텍스트 가운데 정렬
    color: '#3498DB',
    fontSize: 16,
    marginBottom: 2,
  },
  bankText: {
    textAlign: 'center',
    color: '#3498DB',   // 파란색
    fontSize: 16,
  },
  amountText: {
    textAlign: 'center',
    color: '#3498DB',
    fontSize: 16,
  },
});