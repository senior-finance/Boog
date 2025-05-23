// screens/WithdrawAuthScreen.tsx
import { React, useState } from 'react';
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
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import CustomText from '../../components/CustomText';
import { NumPad } from '@umit-turk/react-native-num-pad';
import { TextInputMask } from 'react-native-masked-text';
import CustomNumPad from '../../components/CustomNumPad';
import LinearGradient from 'react-native-linear-gradient';
import ReactNativeBiometrics from 'react-native-biometrics';
// 실제 지문/Pin 인증 모듈을 연동하세요

export default function WithdrawAuthScreen() {
  const nav = useNavigation();
  const { accountNumTo, bankTo, formattedAmount } = useRoute().params;
  const { ammount, bankName, accountNum } = useRoute().params;

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [biometryType, setBiometryType] = useState(null);

  // ✅ 생체 인증 실행 함수
  const handleAuthentication = async () => {
    const rnBiometrics = new ReactNativeBiometrics();

    // ✅ 생체 인증 가능 여부 확인
    const { available, biometryType } = await rnBiometrics.isSensorAvailable();

    if (!available) {
      Alert.alert('에러', '이 기기는 생체 인증을 지원하지 않습니다.');
      return;
    }

    if (!biometryType) {
      Alert.alert('알림', '사용 가능한 생체 인증이 없습니다.');
      return;
    }

    setBiometryType(biometryType);

    const promptMessage =
      biometryType === 'Face ID' ? 'Face ID 인증' : '지문 인증';

    const { success } = await rnBiometrics.simplePrompt({
      promptMessage,
      cancelButtonText: '취소',
    });

    if (success) {
      setIsAuthenticated(true);
      Alert.alert('인증 성공', `${biometryType} 인증이 완료되었습니다.`);
    } else {
      Alert.alert(
        '인증 실패',
        '생체 인증이 실패했습니다. 비밀번호 인증을 사용하시겠습니까?',
        [
          { text: '아니요', style: 'cancel' },
          { text: '비밀번호 입력', onPress: () => console.log('비밀번호 입력 실행') },
        ]
      );
    }
  };

  return (
    <LinearGradient
      colors={['rgb(216,236,255)', 'rgb(233,244,255)']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.accountText}>출금할 계좌 번호</Text>
      <Text style={styles.textValue}>{accountNumTo}</Text>
      <Text style={styles.bankText}>출금할 은행</Text>
      <Text style={styles.textValue}>{bankTo}</Text>
      <Text style={styles.amountText}>입력된 금액</Text>
      <Text style={styles.textValue}>{formattedAmount}</Text>
      <Text style={styles.title}>계좌 번호, 금액이 정말 맞으신가요?{'\n'}한번 더 확인해보세요!{'\n'}인증을 진행하면 출금이 완료돼요</Text>
      <LinearGradient
        colors={['#4C6EF5', '#3B5BDB']}      // 원하는 그라데이션 컬러
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          borderRadius: 25,                 // 둥글게
          marginVertical: 20,
        }}
      >
        <TouchableOpacity
          onPress={handleAuthentication}
          style={{
            width: 400,
            paddingVertical: 20,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '600' }}>
            인증하고 출금할게요
          </Text>
        </TouchableOpacity>
      </LinearGradient>
      <View style={styles.buttonRow}>
        <LinearGradient
          colors={['#4C6EF5', '#3B5BDB']}      // 원하는 그라데이션 컬러
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            borderRadius: 25,                 // 둥글게
            marginVertical: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => nav.goBack()}
            style={{
              width: 160,
              paddingVertical: 20,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '600' }}>
              이전으로 돌아갈게요
            </Text>
          </TouchableOpacity>
        </LinearGradient>
        <LinearGradient
          colors={['#4C6EF5', '#3B5BDB']}      // 원하는 그라데이션 컬러
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            borderRadius: 25,                 // 둥글게
            marginVertical: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => nav.navigate('MainTabs')}
            style={{
              width: 160,
              paddingVertical: 20,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '600' }}>
              처음 화면으로 갈게요
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // 좌우 끝에 배치
    alignItems: 'center',
    width: '100%',                    // 부모 너비 100%
    paddingHorizontal: 16,            // 양쪽 여백(필요에 따라 조정)
  },
  accountText: {
    textAlign: 'center', // 텍스트 가운데 정렬
    color: '#3498DB',
    fontSize: 28,
    marginTop: 20,
    // marginBottom: 20,
  },
  bankText: {
    textAlign: 'center',
    color: '#3498DB',   // 파란색
    fontSize: 28,
    // marginBottom: 20,
  },
  amountText: {
    textAlign: 'center',
    color: '#3498DB',
    fontSize: 28,
  },
  textValue: {
    textAlign: 'center', // 텍스트 가운데 정렬
    color: '#000',
    fontSize: 40,
    backgroundColor: '#FAFAFA',
    fontWeight: 'bold',   // 진하게
    borderWidth: 2,
    margin : 10,
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
});