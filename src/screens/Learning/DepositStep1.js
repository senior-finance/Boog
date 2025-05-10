import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '../../components/CustomText';
import CustomTextInput from '../../components/CustomTextInput';
import HelpTooltipButton from '../../components/HelpTooltipButton';

export default function DepositStep1({ navigation }) {
  const [accountNumber, setAccountNumber] = useState('');

  return (
    <LinearGradient colors={['#F8F8F8', '#ECECEC']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
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
      </KeyboardAvoidingView>

      <HelpTooltipButton navigation={navigation} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'flex-start', 
    paddingTop: 0,
  },
  keyboardView: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',   
    alignItems: 'center',
    paddingTop: 0,       
  },
  card: {
    backgroundColor: '#fff',
    width: '90%',
    paddingVertical: 50, // 상하 여백 크게
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    marginTop: 50, 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
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
  }
});
