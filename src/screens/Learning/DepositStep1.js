import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '../../components/CustomText';
import CustomTextInput from '../../components/CustomTextInput';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function DepositStep1({ navigation }) {
  const [accountNumber, setAccountNumber] = useState('');

  return (
    <LinearGradient colors={['#F8F8F8', '#ECECEC']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <View style={styles.contentWrapper}>
          <View style={styles.card}>
            <CustomText style={styles.title}>
              입금 연습을 해볼게요{'\n'}실제로 입금이 되지는 않아요!
            </CustomText>

            <CustomText style={styles.subtitle}>
              아래 빈칸에 입금할 계좌 번호를 입력하면{'\n'}올바른 계좌인지 확인해드릴게요
            </CustomText>

            <CustomTextInput
              style={styles.input}
              placeholder="계좌 번호 입력"
              keyboardType="numeric"
              value={accountNumber}
              onChangeText={setAccountNumber}
            />

            <TouchableOpacity
              style={[
                styles.nextButton,
                { backgroundColor: accountNumber ? '#4B7BE5' : '#ccc' },
              ]}
              onPress={() => navigation.navigate('DepositStep2', { accountNumber })}
              disabled={!accountNumber}
            >
              <CustomText style={styles.nextButtonText}>다음 화면</CustomText>
            </TouchableOpacity>
          </View>

          <CustomText style={styles.quitGuide}>연습을 그만두고 싶다면</CustomText>

          <TouchableOpacity style={styles.quitButton} onPress={() => navigation.navigate('MainTabs')}>
            <View style={styles.quitContent}>
              <Ionicons name="exit-outline" size={26} color="#4B7BE5" style={styles.quitIcon} />
              <CustomText style={styles.buttonText}>그만둘래요</CustomText>
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
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
    marginTop: 80, // 세로 가운데보다 살짝 위쪽 배치
  },
  card: {
    backgroundColor: '#fff',
    width: '90%',
    paddingVertical: 50,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 50,
    borderWidth: 1.5,
    borderColor: 'rgba(75, 123, 229, 0.5)'
  },
  title: {
    fontWeight: 'bold',
    color: '#4B7BE5',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 34,
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
    borderColor: '#bbb',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    textAlign: 'center',
    backgroundColor: '#ECECEC',
    marginBottom: 36,
    color: "#444"
  },
  nextButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    fontWeight: 'bold',
    color: 'white'
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
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.2,
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
  buttonText: {
    fontWeight: 'bold',
    color: 'black',
  }
});