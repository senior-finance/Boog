// screens/WithdrawAmountScreen.tsx
import React, { useState } from 'react';
import {
  Tab,
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
  // const [accountAmount, setAccountAmount] = useState(''); // 금액 입력
  const [raw, setRaw] = useState('');

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
      [1000000000000n, '조 '],
      [100000000n, '억 '],
      [10000n, '만 '],
      // [1n, ' 원'],
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
      <Text style={styles.title}>금액을 입력해</Text>
      <Text>계좌: {accountNumber}</Text>
      <Text>은행: {bank}</Text>
      {/* <TextInput
        placeholder="출금 금액 입력"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={{ borderBottomWidth: 1, fontSize: 18, marginVertical: 20 }}
      /> */}
      <TextInputMask
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
      />
      <TextInput
        // style={styles.input}
        keyboardType="numeric"
        returnKeyType="done"
        value={formatKorean(amount)}
        onChangeText={text => {
          const onlyNums = text.replace(/\D/g, '');
          setRaw(onlyNums); // 순수 숫자 저장
          setAmount(formatKorean(onlyNums)); // 포맷된 문자열 저장
        }}
        placeholder="금액 입력"
        showSoftInputOnFocus={false}
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
      <Button
        title="다음"
        disabled={!amount}
        onPress={() => nav.navigate('WithdrawAuth', { accountNumber, bank, amount })}
      />
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
    color: 'yellow',            // 노란색
    fontWeight: 'bold',         // 조금 더 강조하고 싶으면
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
});