import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import CustomText from '../../components/CustomText';
import CustomTextInput from '../../components/CustomTextInput';
export default function DepositStep3({ navigation, route }) {
  const [amount, setAmount] = useState('');

  return (
    <View style={styles.container}>
      <CustomText style={styles.title}>입금 연습을 해볼게요{'\n'}실제로 입금이 되지는 않아요!</CustomText>
      
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
        style={styles.button} 
        onPress={() => navigation.navigate('DepositStep4', { ...route.params, amount })}
        disabled={!amount}
      >
        <CustomText style={styles.buttonText}>다음 화면</CustomText>
      </TouchableOpacity>

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.footerButton, styles.help]}>
          <CustomText style={styles.footerText}>도움 요청</CustomText>
        </TouchableOpacity>
      
        <TouchableOpacity style={[styles.footerButton, styles.emergency]}>
          <CustomText style={styles.footerText}>긴급 연락 🚨</CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: 'center', 
    backgroundColor: '#F5F5F5', 
    paddingHorizontal: 20, 
    paddingTop: 80 // 제목을 위로 올리기 위해 추가
  },
  title: { 
  //  fontSize: 28, 
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 60 // 기존보다 간격을 더 늘림
  },
  subtitle: { 
   //     fontWeight: 'bold',
    color: 'black',
    textAlign: 'center', 
    marginTop: 20, // 제목과의 간격 추가
    marginBottom: 40 // 입력 필드와 간격 조정
  },
  input: { 
    width: '90%', 
    borderWidth: 2, 
    borderColor: 'gray', 
    borderRadius: 10, 
    padding: 10, 
    fontSize: 25, 
    textAlign: 'center', 
    marginBottom: 40 
  },
  button: { 
    backgroundColor: '#D9D9D9', 
    paddingVertical: 15, 
    paddingHorizontal: 30, 
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: { 
  //  fontSize: 25, 
    fontWeight: 'bold',
    color: 'black',
  },
  // 하단 도움 요청 & 긴급 연락 버튼 스타일
  footer: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 100,
  },
  footerButton: {
    flex: 1,
    paddingVertical: 15,
    marginHorizontal: 5,
    borderRadius: 20,
    alignItems: 'center'
  },
  help: { backgroundColor: '#DFEBF8' },
  emergency: { backgroundColor: '#FFC1B1' },
  footerText: {
   //     fontWeight: 'bold',
    color: 'black',
  },
});