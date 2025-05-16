// screens/WithdrawAccountScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomText from '../../components/CustomText';
import { NumPad } from '@umit-turk/react-native-num-pad';
import { TextInputMask } from 'react-native-masked-text';
import CustomNumPad from '../../components/CustomNumPad';

export default function WithdrawAccountScreen() {
  const nav = useNavigation();
  const [account, setAccount] = useState('');
  const [accountNumber, setAccountNumber] = useState(''); // 계좌번호 입력

  const handlePress = digit => {
    if (digit === '지우기' || digit === '지우') {
      // 한 글자씩 삭제
      setAccountNumber(prev => prev.slice(0, -1));
    } else if (digit === '모두 지우기') {
      // 전체 초기화
      setAccountNumber('');
    } else {
      // 숫자 또는 '000' 등 입력
      setAccountNumber(prev => prev + digit);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInputMask
        type={'money'}
        options={{
          precision: 0, // 소수점 없음
          separator: '', // 소수점 구분자
          delimiter: '-', // 천 단위 구분자
          unit: '', // 앞에 붙는 단위
          // suffixUnit: '원', // 뒤에 붙는 단위
        }}
        value={accountNumber}
        onChangeText={text => setAccountNumber(text)}
        // placeholder="모의 계좌 번호 10자리"
        keyboardType="numeric"
        style={{
          fontSize: 24,
          textAlign: 'center',
          borderWidth: 5,
          borderColor: '#ccc',
          padding: 10,
          borderRadius: 4
        }}
        showSoftInputOnFocus={false}
      />
      <View style={styles.keypadContainer}>
        <CustomNumPad
          onPress={handlePress}
          decimalSeparator=","
          buttonTextStyle={styles.keypadText}
          containerStyle={styles.numpadInner}
        />
      </View>
      <Button
        title="다음"
        disabled={!accountNumber}
        onPress={() => nav.navigate('WithdrawBank', { accountNumber })}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  numpadInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  keypadContainer: {
    // NumPad 전체 래퍼 스타일
    marginVertical: 'auto',
  },
  keypadText: {
    // 버튼 텍스트 스타일
    fontSize: 30,
    fontWeight: '800',
  },
});