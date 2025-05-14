import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '../../components/CustomText';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function DepositStep2({ navigation, route }) {
  const [selectedBank, setSelectedBank] = useState('');

  return (
    <LinearGradient colors={['#D8ECFF', '#E9F4FF']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <View style={styles.contentWrapper}>
          <View style={styles.card}>
            <CustomText style={styles.title}>
              입금 연습을 해볼게요{'\n'}실제로 입금이 되지는 않아요!
            </CustomText>

            <CustomText style={styles.subtitle}>어떤 은행인지 알려주세요</CustomText>

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
                { backgroundColor: selectedBank ? '#4B7BE5' : '#B0C7E7' },
              ]}
              onPress={() =>
                navigation.navigate('DepositStep3', {
                  accountNumber: route.params.accountNumber,
                  selectedBank,
                })
              }
              disabled={!selectedBank}
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
    paddingVertical: 40,
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
    marginBottom: 30,
    lineHeight: 26,
  },
  pickerContainer: {
    width: '100%',
    height: 60,
    borderWidth: 1,
    borderColor: '#AABDDC',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 36,
    backgroundColor: '#F0F6FF',
    justifyContent: 'center',
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