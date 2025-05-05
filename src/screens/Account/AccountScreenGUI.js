import React, {useRef, useState} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ActivityIndicator,
  Animated,
  StyleSheet,
  Easing,
  Image,
} from 'react-native';
import {WebView} from 'react-native-webview';
import CustomText from '../../components/CustomText';
import {NumPad} from '@umit-turk/react-native-num-pad';
import {TextInputMask} from 'react-native-masked-text';
import CustomNumPad from '../../components/CustomNumPad';

// 내부에서 사용할 상수 변수 선언
const DEFAULT_TITLE = '금융결제원 테스트베드';
const LOADING_MESSAGE = '로딩 중...';

const AccountScreenGUI = ({
  step,
  setStep,
  AUTH_URL,
  handleNavigationStateChange,
  loading,
  accountList,
  accountBalances,
  handleReceiveMoney,
  confirmClearToken,
}) => {
  const [showWithdrawOverlay, setShowWithdrawOverlay] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [amount, setAmount] = useState('');
  const [raw, setRaw] = useState(''); // 숫자만 담깁니다

  // 한국식 단위 포맷 (예: 1234567890 → "12억3456만7890")
  const formatKorean = s => {
    let n = BigInt(s.replace(/\D/g, '') || '0');
    if (n === 0n) return '';
    const units = [
      [1000000000000n, '조 '],
      [100000000n, '억 '],
      [10000n, '만 '],
      // [1n, ' 원'],
    ];
    let res = '';
    for (const [u, label] of units) {
      const q = n / u;
      if (q) {
        res += q + label;
        n %= u;
      }
    }
    if (n) res += n; // 4자리 미만 남은 수
    return res;
  };

  const handlePress = digit => {
    if (digit === '지우기' || digit === '지우') {
      // 한 글자씩 삭제
      setAmount(prev => prev.slice(0, -1));
    } else if (digit === '모두 지우기') {
      // 전체 초기화
      setAmount('');
    } else {
      // 숫자 또는 '000' 등 입력
      setAmount(prev => prev + digit);
    }
  };

  const openOverlay = () => setShowWithdrawOverlay(true);
  const closeOverlay = () => {
    setAmount('');
    setShowWithdrawOverlay(false);
  };

  const onPressWithdraw = item => {
    setSelectedItem(item);
    setAmount('');
    setShowWithdrawOverlay(true);
  };

  const handleWithdraw = async () => {
    const num = parseFloat(amount);
    if (!selectedItem || isNaN(num) || num <= 0) {
      alert('유효한 금액을 입력하세요.');
      return;
    }
    try {
      // fintech_use_num 또는 accountId 필드 사용
      await writeWithdraw(selectedItem.fintech_use_num, num);
      alert(
        `${
          selectedItem.bank_name || '계좌'
        }에서 ${num.toLocaleString()}원 출금 요청 완료`,
      );
      setShowWithdrawOverlay(false);
      setSelectedItem(null);
    } catch (err) {
      console.error(err);
      alert('출금 중 오류가 발생했습니다.');
    }
  };

  // 애니메이션 초기값 (0)
  const animationValue = useRef(new Animated.Value(0)).current;

  // 애니메이션 실행 함수
  const handleAnimateReceive = () => {
    // 애니메이션 값을 0으로 리셋
    animationValue.setValue(0);

    // 두 단계의 애니메이션 순차 실행:
    // 1단계: 빠밤하면서 확대 및 배경 원 등장
    // 2단계: 아래로 슬라이드하며 사라짐
    Animated.sequence([
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(animationValue, {
        toValue: 2,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // 애니메이션 종료 후 필요한 추가 동작
    });
  };

  // 이미지의 translateY: 초기 위치에서 약간 위로 올렸다가, 2단계에서는 아래로 슬라이드
  const translateY = animationValue.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, -100, 300], // 초기엔 약간 위로 올라갔다가 최종적으로 아래로 이동
  });

  // 이미지의 확대 효과 (scale)
  const scale = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2],
    extrapolate: 'clamp',
  });

  // 이미지의 투명도: 나타났다 사라지는 효과
  const imageOpacity = animationValue.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, 1, 0],
  });

  // 이미지에 적용할 Animated 스타일
  const animatedImageStyle = {
    transform: [{translateY}, {scale}],
    opacity: imageOpacity,
  };

  // 배경 원의 확대 효과 (동일한 scale을 사용하거나 개별 인터폴레이션 가능)
  const circleScale = animationValue.interpolate({
    inputRange: [0, 2],
    outputRange: [1, 4],
    extrapolate: 'clamp',
  });

  // 배경 원의 투명도: 이미지와 동시에 등장 후 서서히 사라짐
  const circleOpacity = animationValue.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, 0.5, 0],
  });

  // 홈 화면 렌더링
  if (step === 'home') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{DEFAULT_TITLE}</Text>
        <Button title="인증하기" onPress={() => setStep('auth')} />
      </View>
    );
  }

  // 인증 화면 렌더링
  if (step === 'auth') {
    return (
      <WebView
        source={{uri: AUTH_URL}}
        onNavigationStateChange={handleNavigationStateChange}
      />
    );
  }

  // 로딩 상태 렌더링
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>{LOADING_MESSAGE}</Text>
      </View>
    );
  }

  // 계좌 목록 화면 렌더링 (잔액 및 출금 버튼 포함)
  if (step === 'accountList') {
    return (
      <View style={styles.container}>
        <CustomText style={styles.mainTitle}>
          ! 금융결제원 테스트베드 환경에 등록된 모의 계좌입니다
        </CustomText>
        <CustomText style={styles.subTitle}>계좌 목록 </CustomText>
        <FlatList
          data={accountList}
          keyExtractor={item => item.fintech_use_num}
          renderItem={({item}) => {
            // 배열에서 해당 계좌의 잔고 정보를 찾아 반환
            const balanceObj = accountBalances.find(
              b => b.fintech_use_num === item.fintech_use_num,
            );
            return (
              <View style={styles.accountItem}>
                <View style={styles.accountInfo}>
                  <CustomText style={styles.bankName}>
                    은행명 :{' '}
                    {balanceObj ? balanceObj.bank_name : '은행 조회 중...'}
                  </CustomText>
                  <CustomText style={styles.accountNumber}>
                    계좌번호 : {item.account_num_masked || '정보없음'}
                  </CustomText>
                  <CustomText style={styles.balance}>
                    잔액 :{' '}
                    {balanceObj
                      ? Number(balanceObj.balance_amt).toLocaleString()
                      : '잔액 조회 중...'}
                  </CustomText>
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.receiveButton}
                    // onPress={() => handleReceiveMoney(item)}
                    onPress={() => handleAnimateReceive(item)}>
                    <CustomText style={styles.receiveButtonText}>
                      지원금 받기
                    </CustomText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.withdrawButton}
                    // onPress={() => handleWithdraw(item)}
                    onPress={() => onPressWithdraw(item)}>
                    <CustomText style={styles.withdrawButtonText}>
                      출금
                    </CustomText>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
        <Button title="token 캐시 초기화" onPress={confirmClearToken} />
        {/* 배경 원 1 */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.circle,
            {
              opacity: circleOpacity,
              transform: [{scale: circleScale}],
            },
          ]}
        />
        {/* 배경 원 2 */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.circle,
            styles.circle2,
            {
              opacity: circleOpacity,
              transform: [{scale: circleScale}],
            },
          ]}
        />
        {/* 애니메이션을 적용한 이미지 */}
        <Animated.View
          pointerEvents="none"
          style={[styles.imageContainer, animatedImageStyle]}>
          <Image
            // source={require('../../assets/icon1.png')}
            style={styles.image}
          />
        </Animated.View>
        {/* ===== 반투명 원형 오버레이 ===== */}
        <Modal
          visible={showWithdrawOverlay}
          transparent
          animationType="fade"
          onRequestClose={closeOverlay}
          presentationStyle="overFullScreen" // 전체 화면 오버레이
        >
          {/* 키보드 올라올 때 레이아웃 자동 조정 */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1}}>
            {/* 바깥 터치로 닫기 */}
            <TouchableWithoutFeedback onPress={closeOverlay}>
              <View style={styles.overlay}>
                {/* 내부 콘텐츠 터치만 막기 */}
                <TouchableWithoutFeedback>
                  <View style={styles.modalContent}>
                    <Text style={styles.withdrawTitle}>출금 금액 입력</Text>

                    <TextInputMask
                      type={'money'}
                      options={{
                        precision: 0, // 소수점 없음
                        separator: '', // 소수점 구분자
                        delimiter: ',', // 천 단위 구분자
                        unit: '', // 앞에 붙는 단위
                        // suffixUnit: '원', // 뒤에 붙는 단위
                      }}
                      value={amount}
                      onChangeText={text => setAmount(text)}
                      style={styles.input}
                      placeholder="금액 입력"
                      keyboardType="numeric"
                      returnKeyType="done"
                    />

                    <TextInput
                      style={styles.input}
                      keyboardType="numeric"
                      returnKeyType="done"
                      value={formatKorean(amount)}
                      onChangeText={text => {
                        const onlyNums = text.replace(/\D/g, '');
                        setRaw(onlyNums); // 순수 숫자 저장
                        setAmount(formatKorean(onlyNums)); // 포맷된 문자열 저장
                      }}
                      placeholder="금액 입력"
                    />
                    {/* <Text style={styles.unit}>원</Text> */}

                    <View style={styles.keypadContainer}>
                      <CustomNumPad
                        onPress={handlePress}
                        decimalSeparator=","
                        buttonTextStyle={styles.keypadText}
                        containerStyle={styles.numpadInner}
                      />
                    </View>

                    <View style={styles.buttonRow}>
                      <Button title="취소" onPress={closeOverlay} />
                      <Button title="확인" onPress={handleWithdraw} />
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    );
  }

  // 그 외의 상태: 진행 중 메시지
  return (
    <View style={styles.container}>
      <Text>프로세스 진행 중...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    backgroundColor: 'yellow',
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    backgroundColor: 'yellow',
  },
  subTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    // backgroundColor: 'yellow',
  },
  withdrawTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    backgroundColor: 'green',
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  accountInfo: {
    flex: 1,
  },
  accountNumber: {
    // fontSize: 14,
    marginBottom: 2,
  },
  balance: {
    // fontSize: 12,
    color: '#333',
    marginTop: 2,
  },
  bankName: {
    // fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  receiveButton: {
    backgroundColor: '#28a745',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginRight: 8,
  },
  receiveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  withdrawButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  withdrawButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain', // 또는 'cover' 선택
  },
  imageContainer: {
    position: 'absolute',
    width: 100,
    height: 100,
    top: '50%',
    left: '50%',
    marginTop: -25, // height의 절반
    marginLeft: -25, // width의 절반
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'lightblue',
  },
  circle2: {
    // 두번째 원은 첫번째 원과 약간 겹치되 다른 위치나 색상을 줄 수 있음
    backgroundColor: 'lightgreen',
    top: '20%',
    left: '20%',
    width: 120,
    height: 120,
    // top: 15,
    // left: 10,
  },
  // 오버레이
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', // 반투명 검정
    justifyContent: 'center',
    alignItems: 'center',
  },
  // overlayCircle: {
  //   width: "80%",
  //   height: "80%",
  //   borderRadius: 10,
  //   backgroundColor: 'rgba(255,255,255,0.8)', // 반투명 흰색 원
  // },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 5, // Android 그림자
    shadowColor: '#000', // iOS 그림자
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
  },
  input: {
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 28,
    textAlign: 'center', // ← 이 줄을 추가합니다
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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

export default AccountScreenGUI;
