import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function DepositStep2({ navigation, route }) {
  const [selectedBank, setSelectedBank] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>송금 연습을 해볼게요{'\n'}실제로 송금이 되지는 않아요!</Text>
      
            <Text style={styles.subtitle}>
              어떤 은행인지 알려주세요
            </Text>

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
        style={styles.button} 
        onPress={() => navigation.navigate('DepositStep3', { accountNumber: route.params.accountNumber, selectedBank })}
        disabled={!selectedBank}
      >
        <Text style={styles.buttonText}>다음 화면 ➡️</Text>
      </TouchableOpacity>

      {/* 도움 요청 및 긴급 연락 버튼 */}
            <View style={styles.footer}>
              <TouchableOpacity style={[styles.footerButton, styles.help]}>
                <Text style={styles.footerText}>도움 요청</Text>
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
    backgroundColor: '#F7F5F0', 
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
  pickerContainer: { 
    width: '80%',
    height: 60, // 높이 조절
    borderWidth: 2, 
    borderColor: 'gray', 
    borderRadius: 10, 
    overflow: 'hidden', // borderRadius 적용
    marginBottom: 60 
  },
  picker: { 
    width: '100%', 
    height: '100%' 
  },
  button: { 
    backgroundColor: '#D9D9D9', 
    paddingVertical: 15, 
    paddingHorizontal: 30, 
    borderRadius: 30,
    borderWidth: 2, // 검은색 테두리 추가
    borderColor: 'black',
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
    alignItems: 'center',
    borderWidth: 2, // 검은색 테두리 추가
    borderColor: 'black',
  },
  help: { backgroundColor: '#F9CB97' },
  emergency: { backgroundColor: '#F99797' },
  footerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
});