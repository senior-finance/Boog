// screens/WithdrawAuthScreen.tsx
import React from 'react';
import {
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
} from 'react-native'; import { useRoute, useNavigation } from '@react-navigation/native';
import CustomText from '../../components/CustomText';
import { NumPad } from '@umit-turk/react-native-num-pad';
import { TextInputMask } from 'react-native-masked-text';
import CustomNumPad from '../../components/CustomNumPad';
import LinearGradient from 'react-native-linear-gradient';
// 실제 지문/Pin 인증 모듈을 연동하세요

export default function WithdrawAuthScreen() {
  const { accountNumber, bank, formattedAmount } = useRoute().params;
  const nav = useNavigation();

  const handleAuthSuccess = async () => {
    // TODO: 실제 출금 API 호출
    // await withdrawAPI({ account, bank, amount: Number(amount) });
    alert('출금 완료!');
    // nav.navigate("MainTabs");
  };

  return (
    <LinearGradient
      colors={['rgb(216,236,255)', 'rgb(233,244,255)']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.accountText}>출금할 계좌 번호 : {accountNumber}</Text>
      <Text style={styles.bankText}>출금할 은행 : {bank}</Text>
      <Text style={styles.amountText}>입력된 금액 : {formattedAmount}</Text>
      <Text style={styles.title}>계좌 번호, 금액이 정말 맞으신가요?{'\n'}한번 더 확인해보세요!{'\n'}인증을 진행하면 출금이 완료돼요</Text>
      <Button title="인증하고 출금 완료하기" onPress={handleAuthSuccess} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',   // 세로 가운데
    alignItems: 'center',       // 가로 가운데
  },
  title: {
    textAlign: 'center',        // 텍스트 가운데 정렬
    fontSize: 24,               // 글자 크게 (원하는 크기로 조정)
    color: 'black',            // 노란색
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
  accountText: {
    textAlign: 'center', // 텍스트 가운데 정렬
    color: '#3498DB',
    fontSize: 36,
    marginTop: 20,
    marginBottom: 20,
  },
  bankText: {
    textAlign: 'center',
    color: '#3498DB',   // 파란색
    fontSize: 36,
    marginBottom: 20,
  },
  amountText: {
    textAlign: 'center',
    color: '#3498DB',
    fontSize: 36,
  },
});