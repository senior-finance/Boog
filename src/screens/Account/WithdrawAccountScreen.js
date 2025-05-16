// screens/WithdrawAccountScreen.tsx
import React, { useState } from 'react';
import {
  Tab,
  View,
  Text,
  Alert,
  Modal,
  Button,
  FlatList,
  TextInput,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
  Image,
} from 'react-native'; import { useNavigation } from '@react-navigation/native';
import CustomText from '../../components/CustomText';
import { NumPad } from '@umit-turk/react-native-num-pad';
import { TextInputMask } from 'react-native-masked-text';
import CustomNumPad from '../../components/CustomNumPad';
import LinearGradient from 'react-native-linear-gradient';

export default function WithdrawAccountScreen() {
  const nav = useNavigation();
  const [account, setAccount] = useState('');
  const [accountNumber, setAccountNumber] = useState(''); // 계좌번호 입력

  const handlePress = digit => {
    if (digit === '모두 지우기') {
      // 모두 지우기
      setAccountNumber('');
    } else if (digit === '한칸 지우기') {
      // 한 글자씩 삭제
      setAccountNumber(prev => prev.slice(0, -1));
    } else {
      // 숫자 또는 '000' 등 입력
      setAccountNumber(prev => prev + digit);
    }
  };

  return (
    <LinearGradient
      colors={['rgb(216,236,255)', 'rgb(233,244,255)']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.title}>계좌 번호 10자리를 입력하세요</Text>
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
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',   // 세로 가운데
    // alignItems: 'center',       // 가로 가운데
  },
  title: {
    textAlign: 'center',        // 텍스트 가운데 정렬
    fontSize: 24,               // 글자 크게 (원하는 크기로 조정)
    color: 'yellow',            // 노란색
    fontWeight: 'bold',         // 조금 더 강조하고 싶으면
    marginTop: 20,           // 아래 여백
    marginBottom: 20,           // 아래 여백
  },
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