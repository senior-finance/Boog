import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '../../components/CustomText';
import CustomTextInput from '../../components/CustomTextInput';

export default function DepositStep3({ navigation, route }) {
  const [amount, setAmount] = useState('');

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
            입금할 금액을 입력하세요
          </CustomText>

          <CustomTextInput
            style={styles.input}
            placeholder="금액 입력"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          <TouchableOpacity
            style={[
              styles.nextButton,
              { backgroundColor: amount ? '#4B7BE5' : '#ccc' },
            ]}
            onPress={() => navigation.navigate('DepositStep4', { ...route.params, amount })}
            disabled={!amount}
          >
            <CustomText style={styles.nextButtonText}>다음 화면</CustomText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* 하단 도움 요청 / 긴급 연락 */}
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.footerButton, styles.help]}>
          <CustomText style={styles.footerText}>도움 요청</CustomText>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.footerButton, styles.emergency]}>
          <CustomText style={styles.footerText}>긴급 연락 🚨</CustomText>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#F8F8F8',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  keyboardView: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    width: '90%',
    paddingVertical: 40,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 50,
    shadowColor: '#000',
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
    marginBottom: 30,
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
  footer: {
    position: 'absolute',
    bottom: 20,
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  footerButton: {
    flex: 1,
    paddingVertical: 14,
    marginHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  help: { backgroundColor: '#D9E7F9' },
  emergency: { backgroundColor: '#FFC1B1' },
  footerText: {
    fontWeight: 'bold',
    color: '#333',
  },
});
