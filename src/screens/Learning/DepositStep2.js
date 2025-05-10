import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '../../components/CustomText';
import HelpTooltipButton from '../../components/HelpTooltipButton';

export default function DepositStep2({ navigation, route }) {
  const [selectedBank, setSelectedBank] = useState('');

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
            어떤 은행인지 알려주세요
          </CustomText>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedBank}
              onValueChange={(itemValue) => setSelectedBank(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="은행을 선택하세요" value="" />
              <Picker.Item label="국민은행" value="국민은행" />
              <Picker.Item label="신한은행" value="신한은행" />
              <Picker.Item label="우리은행" value="우리은행" />
              <Picker.Item label="하나은행" value="하나은행" />
            </Picker>
          </View>

          <TouchableOpacity
            style={[
              styles.nextButton,
              { backgroundColor: selectedBank ? '#4B7BE5' : '#ccc' },
            ]}
            onPress={() => navigation.navigate('DepositStep3', { accountNumber: route.params.accountNumber, selectedBank })}
            disabled={!selectedBank}
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
  pickerContainer: {
    width: '100%',
    height: 60,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 36,
    backgroundColor: '#ECECEC',
  },
  picker: {
    width: '100%',
    height: '100%',
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
