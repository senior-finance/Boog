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
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import CustomText from '../../components/CustomText';
import { NumPad } from '@umit-turk/react-native-num-pad';
import { TextInputMask } from 'react-native-masked-text';
import CustomNumPad from '../../components/CustomNumPad';
import LinearGradient from 'react-native-linear-gradient';

export default function WithdrawAmountScreen() {
  const { accountNumTo, bankTo } = useRoute().params;
  const { amount, bankName, accountNum } = useRoute().params;

  const nav = useNavigation();
  const [amountTo, setAmountTo] = useState('');
  const [raw, setRaw] = useState('');
  const [error, setError] = useState('');

  // 포맷 함수 추가
  const formatWithCommas = numStr =>
    numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // 상태 분리 (콤마용)
  const [amountToComma, setAmountToComma] = useState('');

  // 화면 전용 키 레이아웃
  const myKeyRows = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['000', '00', '0'],
    ['모두 지우기', '한칸 지우기'],
  ];

  // digit 기반으로 raw.length만 체크
  const handlePress = digit => {
    if (digit === '모두 지우기') {
      setRaw('');
      setAmountTo('');
      setAmountToComma('');
    } else if (digit === '한칸 지우기') {
      const newRaw = raw.slice(0, -1);
      setRaw(newRaw);
      const kor = formatKorean(newRaw);
      const comma = formatWithCommas(newRaw);
      setAmountTo(kor);
      setAmountToComma(comma);
    } else {
      const available = 10 - raw.length;
      if (available <= 0) return;

      // 붙일 문자열 자르기
      const toAppend = digit.length > available
        ? digit.slice(0, available)
        : digit;

      // raw가 비어있고, toAppend가 모두 0이면 무시
      if (raw === '' && /^0+$/.test(toAppend)) return;

      const newRaw = raw + toAppend;
      setRaw(newRaw);
      const kor = formatKorean(newRaw);
      const comma = formatWithCommas(newRaw);
      setAmountTo(kor);
      setAmountToComma(comma);
    }
  };

  // 한국식 단위 포맷 (예: 1234567890 → "12억 3456만 7890원", 100만 → "100만 원")
  const formatKorean = s => {
    let n = BigInt(s.replace(/\D/g, '') || '0');
    if (n === 0n) return '';

    // 조·억·만 단위만 처리
    const units = [
      [10n ** 12n, '조'],
      [10n ** 8n, '억'],
      [10n ** 4n, '만'],
    ];
    let res = '';

    for (const [u, label] of units) {
      const q = n / u;
      if (q) {
        res += `${q}${label} `;
        n %= u;
      }
    }

    res = res.trim();          // 마지막 공백 제거
    if (!res) {
      // 1만 미만인 경우: 그냥 숫자 + 원
      return `${n}원`;
    }
    if (n > 0n) {
      // 단위 뒤에 남은 숫자가 있으면 “단위 숫자원”
      return `${res} ${n}원`;
    }
    // 남은 숫자가 없으면 “단위 원”
    return `${res} 원`;
  };

  return (
    <LinearGradient
      colors={['rgb(216,236,255)', 'rgb(233,244,255)']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.title}>출금할 금액을 입력 해주세요</Text>
      <Text style={styles.accountText}>출금할 계좌 번호 : {accountNumTo}</Text>
      <Text style={styles.bankText}>출금할 은행 : {bankTo}</Text>
      <TextInput
        keyboardType="numeric"
        returnKeyType="done"
        value={amountTo}
        onChangeText={text => {
          const onlyNums = text.replace(/\D/g, '').slice(0, 10);
          // 순수 0만 있으면 빈 문자열로
          if (/^0+$/.test(onlyNums)) {
            setRaw('');
            setAmountTo('');
            setAmountToComma('');
            return;
          }
          setRaw(onlyNums);
          const kor = formatKorean(onlyNums);
          const comma = formatWithCommas(onlyNums);
          setAmountTo(kor);
          setAmountToComma(comma);
        }}
        placeholder="금액을 원화 단위로"
        showSoftInputOnFocus={false}
        style={[styles.inputBox]}
      />
      <TextInput
        keyboardType="numeric"
        returnKeyType="done"
        value={amountToComma}
        onChangeText={text => {
          const onlyNums = text.replace(/\D/g, '').slice(0, 10);
          if (/^0+$/.test(onlyNums)) {
            setRaw('');
            setAmountTo('');
            setAmountToComma('');
            return;
          }
          setRaw(onlyNums);
          const kor = formatKorean(onlyNums);
          const comma = formatWithCommas(onlyNums);
          setAmountTo(kor);
          setAmountToComma(comma);
        }}
        placeholder="금액을 쉼표 단위로"
        showSoftInputOnFocus={false}
        style={styles.inputBox}
      />
      <Text style={styles.remain}>출금 가능한 잔액 : {formatKorean(String(amount))}</Text>
      <View style={styles.keypadContainer}>
        <CustomNumPad
          onPress={handlePress}
          keyRows={myKeyRows}
          textStyle={styles.keypadText}
          decimalSeparator=","
          buttonTextStyle={styles.keypadText}
          containerStyle={styles.numpadInner}
        />
      </View>
      {/* <Text style={styles.unit}>원</Text> */}
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
            disabled={!amountTo}         // accountNumber 없으면 비활성화
            onPress={() => {
              if (amount < raw) {
                Alert.alert('잔액이 부족합니다', '출금 가능한 금액을 초과했습니다.');
                return;
              }
              // 금액 검사 통과 시에만 화면 이동
              nav.navigate('WithdrawAuth', {
                accountNumTo,
                bankTo,
                formattedAmount: amountTo,
                accountNum,
                bankName,
                amount,
              });
            }}
            style={{
              width: 160,
              paddingVertical: 20,
              alignItems: 'center',
              opacity: amountTo ? 1 : 0.6,  // 비활성 시 반투명
            }}
          >
            <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '600' }}>
              다음
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
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
    fontSize: 24,
    fontWeight: '800',
  },
  inputBox: {
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
    borderWidth: 5,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 2,
    backgroundColor: '#fff',
    // Android 그림자
    elevation: 2,
    // iOS 그림자
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // 좌우 끝에 배치
    alignItems: 'center',
    width: '100%',                    // 부모 너비 100%
    paddingHorizontal: 16,            // 양쪽 여백(필요에 따라 조정)
  },
  remain: {
    textAlign: 'center', // 텍스트 가운데 정렬
    color: '#3498DB',
    fontSize: 24,
    marginBottom: 10,
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