// screens/WithdrawAmountScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import CustomModal from '../../components/CustomModal';

export default function WithdrawAmountScreen() {
  const nav = useNavigation();
  const route = useRoute();
  const { accountNumTo, bankTo, amount, accountNum, bankName, testBedAccount } = route.params;

  const [modalButtons, setModalButtons] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [formattedComma, setFormattedComma] = useState('');
  const [formattedKor, setFormattedKor] = useState('0원');
  const [raw, setRaw] = useState('');

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

  const formatWithCommas = numStr =>
    numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const formatKorean = s => {
    let n = BigInt(s.replace(/\D/g, '') || '0');
    if (n === 0n) return '0원';

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
  };

  const handleChange = (text) => {
    const digits = text.replace(/\D/g, '').slice(0, 10);
    setRaw(digits);
    if (!digits || /^0+$/.test(digits)) {
      setFormattedComma('');
      setFormattedKor('0원');
    } else {
      setFormattedComma(formatWithCommas(digits));
      setFormattedKor(formatKorean(digits));
    }
  };

  const handleClear = () => {
    setRaw('');
    setFormattedComma('');
    setFormattedKor('0원');
  };

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

  return (
    <LinearGradient colors={['#D8ECFF', '#E9F4FF']} style={styles.container}>
      <Text style={styles.title}>송금할 금액을 입력해주세요</Text>
      <Text style={styles.remainText}>출금 가능 금액 : {formatKorean(String(amount))}</Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoLabel}>송금할 계좌 번호</Text>
        <Text style={styles.infoValue}>{accountNumTo}</Text>
        <Text style={styles.infoBank}>{bankTo}</Text>
      </View>

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

      <Text style={styles.korText}>{formattedKor}</Text>

      <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
        <Text style={styles.clearButtonText}>모두 지우기</Text>
      </TouchableOpacity>

      <View style={styles.buttonRow}>
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
  remainText: {
    textAlign: 'center',
    color: '#3498DB',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 30,
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
    elevation: 4,
    borderWidth: 1.5,
    borderColor: '#B0C8F5',
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