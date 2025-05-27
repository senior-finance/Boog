import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Text,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '../../components/CustomText';
import CustomTextInput from '../../components/CustomTextInput';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomModal from '../../components/CustomModal';

export default function DepositStep1({ navigation }) {
  const [accountNumber, setAccountNumber] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const showModal = (title, message) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
  };

  const handleNext = () => {
    const rawNumber = accountNumber.replace(/-/g, '');
    if (rawNumber.length !== 10) {
      showModal('입력 오류', '계좌 번호는 정확히 10자리여야 해요.');
      return;
    }
    navigation.navigate('DepositStep2', { accountNumber });
  };

  const formatAccountNumber = (text) => {
    const digitsOnly = text.replace(/\D/g, '').slice(0, 10);
    const formatted = digitsOnly.replace(/(\d{1,3})(\d{0,3})?(\d{0,4})?/, (_, a, b, c) => {
      return [a, b, c].filter(Boolean).join('-');
    });
    setAccountNumber(formatted);
  };

  return (
    <LinearGradient colors={['#D8ECFF', '#E9F4FF']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <View style={styles.contentWrapper}>
          <View style={styles.card}>
            <CustomText style={styles.title}>
              송금 연습을 해볼게요{'\n'}실제로 송금이 되지는 않아요!
            </CustomText>

            <CustomText style={styles.subtitle}>
              아래 빈칸에 송금할 계좌 번호를 입력하면{'\n'}올바른 계좌인지 확인해드릴게요
            </CustomText>

            <CustomTextInput
              style={styles.input}
              placeholder="계좌 번호 입력"
              keyboardType="numeric"
              value={accountNumber}
              onChangeText={formatAccountNumber}
            />

            <TouchableOpacity
              style={[styles.nextButton, {
                backgroundColor: accountNumber.replace(/-/g, '').length === 10 ? '#4B7BE5' : '#B0C7E7',
              }]}
              onPress={handleNext}
              disabled={accountNumber.replace(/-/g, '').length !== 10}
            >
              <CustomText style={styles.nextButtonText}>다음 화면</CustomText>
            </TouchableOpacity>
          </View>

          <CustomText style={styles.quitGuide}>연습을 그만두고 싶다면</CustomText>

          <TouchableOpacity style={styles.quitButton} onPress={() => navigation.navigate('MainTabs')}>
            <View style={styles.quitContent}>
              <Ionicons name="exit-outline" size={26} color="#4B7BE5" style={styles.quitIcon} />
              <CustomText style={styles.quitText}>그만둘래요</CustomText>
            </View>
          </TouchableOpacity>
        </View>

        <CustomModal
          visible={modalVisible}
          title={modalTitle}
          message={modalMessage}
          buttons={[{
            text: '확인',
            onPress: () => setModalVisible(false),
            color: '#4B7BE5',
          }]}
        />
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  contentWrapper: {
    width: '100%',
    alignItems: 'center',
    marginTop: 80,
  },
  card: {
    backgroundColor: '#FFFFFF',
    width: '90%',
    paddingVertical: 50,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(75, 123, 229, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 50,
  },
  title: {
    fontWeight: 'bold',
    color: '#4B7BE5',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 32,
  },
  subtitle: {
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 36,
    lineHeight: 26,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#AABDDC',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    textAlign: 'center',
    backgroundColor: '#F0F6FF',
    marginBottom: 36,
    color: '#444',
  },
  nextButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    fontWeight: 'bold',
    color: 'white',
  },
  quitGuide: {
    color: '#999',
    marginBottom: 10,
    textAlign: 'center',
  },
  quitButton: {
    backgroundColor: '#FFFFFF',
    width: '90%',
    paddingVertical: 25,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
    borderColor: 'rgba(75, 123, 229, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  quitContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quitIcon: {
    marginRight: 6,
    marginTop: 1,
  },
  quitText: {
    fontWeight: 'bold',
    color: '#4B7BE5',
  },
});