import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '../../components/CustomText';
import CustomTextInput from '../../components/CustomTextInput';
import HelpTooltipButton from '../../components/HelpTooltipButton';

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

      <HelpTooltipButton navigation={navigation} />
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
    color: 'white',
  }
});
