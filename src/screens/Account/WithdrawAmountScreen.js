// screens/WithdrawAmountScreen.tsx
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
import CustomModal from '../../components/CustomModal';


export default function WithdrawAmountScreen() {
  // 커스텀 모달
  const [modalButtons, setModalButtons] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [formattedComma, setFormattedComma] = useState('');

  const showModal = (title, message, buttons = [
    {
      text: '확인',
      onPress: () => setModalVisible(false),
      color: '#4B7BE5',
    }
  ]) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalButtons(buttons);
    setModalVisible(true);
  };

  const { accountNumTo, bankTo } = useRoute().params;
  const { amount, bankName, accountNum, testBedAccount } = useRoute().params;

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
  // const handlePress = digit => {
  //   if (digit === '모두 지우기') {
  //     setRaw('');
  //     setAmountTo('');
  //     setAmountToComma('');
  //   } else if (digit === '한칸 지우기') {
  //     const newRaw = raw.slice(0, -1);
  //     setRaw(newRaw);
  //     const kor = formatKorean(newRaw);
  //     const comma = formatWithCommas(newRaw);
  //     setAmountTo(kor);
  //     setAmountToComma(comma);
  //   } else {
  //     const available = 10 - raw.length;
  //     if (available <= 0) return;

  //     // 붙일 문자열 자르기
  //     const toAppend = digit.length > available
  //       ? digit.slice(0, available)
  //       : digit;

  //     // raw가 비어있고, toAppend가 모두 0이면 무시
  //     if (raw === '' && /^0+$/.test(toAppend)) return;

  //     const newRaw = raw + toAppend;
  //     setRaw(newRaw);
  //     const kor = formatKorean(newRaw);
  //     const comma = formatWithCommas(newRaw);
  //     setAmountTo(kor);
  //     setAmountToComma(comma);
  //   }
  // };

  const handleChange = (text) => {
    const digits = text.replace(/\D/g, '');
    setRaw(digits);
    if (!digits || /^0+$/.test(digits)) {
      setFormattedComma('');
      setFormattedKor('0원');
    } else {
      setFormattedComma(formatWithCommas(digits));
      setFormattedKor(formatKorean(digits));
    }
  };

  <Text style={styles.korText}>{formattedKor}</Text>


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

    res = res.trim();
    return n > 0n ? `${res} ${n}원` : `${res} 원`;
  }

  const [formattedKor, setFormattedKor] = useState(formatKorean('0'));

  const handleSubmit = () => {
    if (!raw) return;
    if (BigInt(raw) > BigInt(amount)) {
      showModal('잔액 부족', '출금 가능한 금액을 초과했어요');
      return;
    }
    nav.navigate('WithdrawAuth', {
      accountNumTo,
      bankTo,
      rawAmount: raw,
      formattedAmount: formattedKor,
      accountNum,
      bankName,
      amount,
      testBedAccount,
    });
  };

  const handleClear = () => {
    setRaw('');
    setFormattedComma('');
    setFormattedKor('0원');
  };

  return (
    <LinearGradient
      colors={['rgb(216,236,255)', 'rgb(233,244,255)']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.title}>송금할 금액을 입력해주세요</Text>

      <Text style={styles.remainText}>
        출금 가능 금액 : {formatKorean(String(amount))}
      </Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoLabel}>송금할 계좌 번호</Text>
        <Text style={styles.infoValue}>{accountNumTo}</Text>
        <Text style={styles.infoBank}>{bankTo}</Text>
      </View>

      <View style={styles.inputWrapper}>
        {/* <TextInput
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
          style={styles.inputBox2}
        /> */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="금액을 쉼표 단위로 입력"
            value={formattedComma}
            onChangeText={handleChange}
            keyboardType="numeric"
            placeholderTextColor="#aaa"
          />
        </View>
        <Text style={styles.remain}>출금 가능한 잔액 : {formatKorean(String(amount))}</Text>
        <View style={styles.keypadContainer}>
          {/* <CustomNumPad
            onPress={handlePress}
            keyRows={myKeyRows}
            textStyle={styles.keypadText}
            decimalSeparator=","
            buttonTextStyle={styles.keypadText}
            containerStyle={styles.numpadInner}
          /> */}
        </View>
      </View>

      {/* <Text style={styles.korText}>{formattedKor}</Text> */}

      <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
        <Text style={styles.clearButtonText}>모두 지우기</Text>
      </TouchableOpacity>

      {/* <Text style={styles.unit}>원</Text> */}

      <View style={styles.buttonRow}>
        <LinearGradient colors={["#DAEFFF", "#F0F6FF"]} style={styles.container}>
          <TouchableOpacity style={styles.button} onPress={() => nav.goBack()}>
            <Text style={styles.buttonText}>이전</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, !raw && { opacity: 0.6 }]}
            disabled={!raw}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>다음</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
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
  container: { flex: 1, padding: 24 },
  title: {
    fontSize: 23,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1B1B1B',
    marginTop: 5,
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  infoLabel: {
    fontSize: 20,
    color: '#888',
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#1B1B1B',
  },
  infoBank: {
    fontSize: 18,
    color: '#1E70C1',
    marginTop: 4,
  },
  inputWrapper: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#A9C7F6',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  input: {
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
    color: '#333',
  },
  korText: {
    textAlign: 'center',
    fontSize: 22,
    color: '#1E70C1',
    fontWeight: '600',
    marginBottom: 12,
  },
  remainText: {
    textAlign: 'center',
    color: '#3498DB',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 30,
  },
  clearButton: {
    alignSelf: 'center',
    backgroundColor: '#DDE6F8',
    paddingHorizontal: 100,
    paddingVertical: 20,
    borderRadius: 30,
    marginTop: 15,
    marginBottom: 25,
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
  title: {
    fontSize: 23,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1B1B1B',
    marginTop: 5,
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  infoLabel: {
    fontSize: 20,
    color: '#888',
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#1B1B1B',
  },
  infoBank: {
    fontSize: 18,
    color: '#1E70C1',
    marginTop: 4,
  },
  inputWrapper: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#A9C7F6',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  input: {
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
    color: '#333',
  },
  korText: {
    textAlign: 'center',
    fontSize: 22,
    color: '#1E70C1',
    fontWeight: '600',
    marginBottom: 12,
  },
  remainText: {
    textAlign: 'center',
    color: '#3498DB',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 30,
  },
  clearButton: {
    alignSelf: 'center',
    backgroundColor: '#DDE6F8',
    paddingHorizontal: 100,
    paddingVertical: 20,
    borderRadius: 30,
    marginTop: 15,
    marginBottom: 25,
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
  container: { flex: 1, padding: 24 },
  title: {
    fontSize: 23,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1B1B1B',
    marginTop: 5,
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  infoLabel: {
    fontSize: 20,
    color: '#888',
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#1B1B1B',
  },
  infoBank: {
    fontSize: 18,
    color: '#1E70C1',
    marginTop: 4,
  },
  inputWrapper: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#A9C7F6',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  input: {
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
    color: '#333',
  },
  korText: {
    textAlign: 'center',
    fontSize: 22,
    color: '#1E70C1',
    fontWeight: '600',
    marginBottom: 12,
  },
  remainText: {
    textAlign: 'center',
    color: '#3498DB',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 30,
  },
  clearButton: {
    alignSelf: 'center',
    backgroundColor: '#DDE6F8',
    paddingHorizontal: 100,
    paddingVertical: 20,
    borderRadius: 30,
    marginTop: 15,
    marginBottom: 25,
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
});