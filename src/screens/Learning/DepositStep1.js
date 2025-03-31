import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function DepositStep1({ navigation }) {
  const [accountNumber, setAccountNumber] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>입금 연습을 해볼게요{'\n'}실제로 입금이 되지는 않아요!</Text>

      <Text style={styles.subtitle}>
        아래 빈칸에 입금할{'\n'}계좌 번호를 입력하면{'\n'}
        올바른 계좌인지 확인해드릴게요
      </Text>

      <TextInput
        style={styles.input}
        placeholder="계좌 번호 입력"
        keyboardType="numeric"
        value={accountNumber}
        onChangeText={setAccountNumber}
      />

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('DepositStep2', { accountNumber })}
        disabled={!accountNumber}
      >
        <Text style={styles.buttonText}>다음 화면</Text>
      </TouchableOpacity>

      {/* 도움 요청 및 긴급 연락 버튼 */}
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.footerButton, styles.help]}>
          <Text style={styles.footerText}>도움</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.footerButton, styles.emergency]}>
          <Text style={styles.footerText}>긴급 연락 🚨</Text>
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
    fontSize: 30, 
    fontWeight: 'bold', 
    color: 'black',
    textAlign: 'center',
    marginBottom: 60 // 기존보다 간격을 더 늘림
  },
  subtitle: { 
    fontSize: 25,
    fontWeight: 'bold',
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
    fontSize: 25, 
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
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
});