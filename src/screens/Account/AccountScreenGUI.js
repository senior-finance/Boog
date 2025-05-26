import React, { useRef, useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
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
import { WebView } from 'react-native-webview';
import CustomText from '../../components/CustomText';
import { NumPad } from '@umit-turk/react-native-num-pad';
import { TextInputMask } from 'react-native-masked-text';
import CustomNumPad from '../../components/CustomNumPad';
import LottieView from 'lottie-react-native';
import { deposit, withdraw, accountUpsert, accountGet, mongoDB } from '../../database/mongoDB'
import CustomModal from '../../components/CustomModal.js'
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

// 내부에서 사용할 상수 변수 선언
const DEFAULT_TITLE = '금융결제원 테스트베드';
const LOADING_MESSAGE = '로딩 중...';

// const BANK_OPTIONS = ['전체', '신한', '국민', '하나', /* 필요한 만큼 추가 */];
const GRADIENT_COLOR_SETS = [
  ['rgba(190, 183, 255, 0.8)', 'transparent', 'rgba(255, 255, 255, 1)'], // set 0
  ['rgba(196, 215, 255, 0.8)', 'transparent', 'rgba(255, 255, 255, 1)'], // set 1
  ['rgba(255, 215, 196, 0.8)', 'transparent', 'rgba(255, 255, 255, 1)'], // set 2
  ['rgba(255, 244, 181, 0.8)', 'transparent', 'rgba(255, 255, 255, 1)'], // set 3
  ['rgba(224, 255, 181, 0.8)', 'transparent', 'rgba(255, 255, 255, 1)'], // set 4
  // …원하는 만큼 추가
];
const BORDER_WIDTH = 3;

const AccountScreenGUI = ({
  CONFIG,
  step,
  setStep,
  AUTH_URL,
  handleNavigationStateChange,
  loading,
  accountList,
  accountBalances,
  handleReceiveMoney,
  confirmClearToken,
  testBedAccount,
  setTestBedAccount
}) => {
  const [showWithdrawOverlay, setShowWithdrawOverlay] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [amount, setAmount] = useState(''); // 금액 입력
  const [raw, setRaw] = useState(''); // 숫자만 담깁니다

  const [dbAccounts, setDbAccounts] = useState([]);  // { accountId, accountNum, amount } 형태
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedBank, setSelectedBank] = useState('전체');
  const [isAnimating, setIsAnimating] = useState(false);
  const [ownName, setOwnName] = useState('');

  // 커스텀 모달
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [buttons, setButtons] = useState([]);

  const showSimpleModal = (message) => {
    setModalTitle('알림');
    setModalMessage(message);
    setButtons([
      {
        text: '확인',
        onPress: () => setModalVisible(false),
        color: '#ccc',
        textColor: 'black',
      },
    ]);
    setModalVisible(true);
  };

  // 내 한글 이름 조회
  useEffect(() => {
    (async () => {
      const doc = await mongoDB(
        'findOne',
        'common',
        'name',
        { query: { dbName: testBedAccount } }
      );
      setOwnName(doc?.koreaName || testBedAccount);
    })();
  }, [testBedAccount]);

  // accountBalances: [{ fintech_use_num, bank_name, balance_amt, … }, …]
  const BANK_OPTIONS = useMemo(() => {
    if (!accountBalances || accountBalances.length === 0) {
      // 아직 불러오는 중일 때
      return ['은행 불러오는 중...'];
    }
    const uniqueBanks = Array.from(
      new Set(accountBalances.map(b => b.bank_name))
    );
    return ['전체', ...uniqueBanks];
  }, [accountBalances]);
  const navigation = useNavigation();

  // DB에서 계좌 정보 가져오기
  const fetchDbAccounts = async () => {
    if (!testBedAccount || accountList.length === 0) return;
    const { dbName } = CONFIG[testBedAccount];
    try {
      const results = await Promise.all(
        accountList.map(item =>
          accountGet(dbName, item.fintech_use_num)
            .then(doc => doc && { accountId: item.fintech_use_num, ...doc })
        )
      );
      setDbAccounts(results.filter(r => r));
    } catch (err) {
      console.log('DB 조회 실패', err);
    }
  };

  // 마운트 시와 testBedAccount, accountList 변경 시만 실행
  useEffect(() => {
    fetchDbAccounts();
  }, [testBedAccount, accountList]);

  const openOverlay = () => setShowWithdrawOverlay(true);
  const closeOverlay = () => {
    setAmount('');
    setShowWithdrawOverlay(false);
  };

  const onPressDeposit = item => {
    const depositValue = 1000000;            // ① 로컬 상수로 금액 관리
    setSelectedItem(item);
    handleAnimateReceive();
    setAmount(String(depositValue));          // ② 화면에 보여주고 싶으면 이건 그대로
    handleDeposit(item, depositValue);        // ③ 금액은 파라미터로 넘기기
  };

  const handleDeposit = async (selectedItem, num) => {
    // const num = parseFloat(amount);
    if (!selectedItem || isNaN(num) || num <= 0) {
      showSimpleModal('유효한 금액을 입력하세요.');
      return;
    }
    try {
      // fintech_use_num 또는 accountId 필드 사용
      await deposit(
        CONFIG[testBedAccount].dbName,
        selectedItem.fintech_use_num,
        selectedItem.bank_name,
        num
      );
      // console.log(CONFIG[testBedAccount].dbName);
      console.log('입금 요청 완료:', selectedItem.fintech_use_num, num);
      // showSimpleModal(
      //   `${selectedItem.bank_name || '계좌'}에서 ${num.toLocaleString()}원 입금 요청 완료`,
      // );
      // setShowWithdrawOverlay(false);
      setSelectedItem(null);
      await fetchDbAccounts();
      // DB에서 계좌 정보 다시 가져오기
    } catch (err) {
      console.log(err);
      console.log(amount)
      showSimpleModal('입금 중 오류가 발생했습니다.');
    }
  };

  const onPressWithdraw = item => {
    setSelectedItem(item);
    setAmount('');
    setShowWithdrawOverlay(true);
  };

  const handleWithdraw = async () => {
    const num = parseFloat(amount);
    if (!selectedItem || isNaN(num) || num <= 0) {
      showSimpleModal('유효한 금액을 입력하세요.');
      return;
    }
    try {
      // fintech_use_num 또는 accountId 필드 사용
      await withdraw(
        CONFIG[testBedAccount].dbName,
        selectedItem.fintech_use_num,
        selectedItem.bank_name,
        num
      );
      // console.log(CONFIG[testBedAccount].dbName);
      console.log('출금 요청 완료:', selectedItem.fintech_use_num, num);
      showSimpleModal(
        `${selectedItem.bank_name || '계좌'}에서 ${num.toLocaleString()}원 출금 요청 완료`,
      );

      setShowWithdrawOverlay(false);
      setSelectedItem(null);
      await fetchDbAccounts();
      // DB에서 계좌 정보 다시 가져오기
    } catch (err) {
      console.log(err);
      console.log(amount)
      showSimpleModal('출금 중 오류가 발생했습니다.');
    }
  };

  const onPressUpsert = item => {
    setSelectedItem(item);
    handleUpsert(item);
  };

  const handleUpsert = async item => {
    // 1) 금액 파싱
    setAmount('100000000'); // 금액 초기화
    const num = parseFloat(amount);
    // if (isNaN(num) || num <= 0) {
    //   console.log('금액이 충전됐습니다');
    // }

    // 2) CONFIG에서 dbName만 꺼내기
    const { dbName } = CONFIG[testBedAccount] || {};
    if (!dbName) {
      showSimpleModal('테스트 계정을 먼저 선택하세요');
      return;
    }

    // 3) item 검증 → 디스트럭처링
    if (!item) {
      console.log('item is null!');
      showSimpleModal('계좌를 먼저 선택하세요');
      return;
    }
    const { fintech_use_num: accountId, bank_name: accountBank } = item;
    // console.log('대상 계좌:', accountId, accountBank);

    // 4) userName은 testBedAccount 그대로
    const userName = testBedAccount;

    try {
      // 5) upsert 호출 (dbName 포함)
      const upsertedId = await accountUpsert(
        userName,
        accountId,
        accountBank,
        num,
      );
      await fetchDbAccounts();
      // DB에서 계좌 정보 다시 가져오기
      console.log('Upserted ID:', upsertedId || '기존 문서 갱신됨');
      showSimpleModal('저장 완료');

    } catch (err) {
      console.log(err);
      showSimpleModal('저장에 실패했습니다');
    }
  };

  // 애니메이션 초기값 (0)
  const animationValue = useRef(new Animated.Value(0)).current;

  // 애니메이션 실행 함수
  const handleAnimateReceive = () => {
    // 터치 막기 시작
    setIsAnimating(true);
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
      setModalTitle('지원금');
      setModalMessage('테스트 지원금 100만원을 입금 드렸어요');
      setButtons([
        {
          text: '닫기',
          onPress: () => setModalVisible(false),
          color: '#4B7BE5',
        },
      ]);
      setModalVisible(true);
      setIsAnimating(false);
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
    transform: [{ translateY }, { scale }],
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
        <TouchableOpacity
          style={[styles.button, styles.button1]}
          onPress={() => setTestBedAccount('kmj')}
        >
          <Text style={styles.buttonText}>테스트 계정 김민준</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.button2]}
          onPress={() => setTestBedAccount('hwc')}
        >
          <Text style={styles.buttonText}>테스트 계정 홍우창</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 인증 화면 렌더링
  if (step === 'auth') {
    return (
      <WebView
        source={{ uri: AUTH_URL }}
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
      <LinearGradient
        colors={['rgb(216,236,255)', 'rgb(233,244,255)']}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* ★ 애니 중일 때만 뜨는 풀스크린 투명 오버레이 */}
        {isAnimating && (
          <View
            style={[StyleSheet.absoluteFill, { zIndex: 1 }]}
            pointerEvents="auto"
          />
        )}
        <CustomText style={styles.mainTitle}>
          ℹ️ 금융결제원 테스트베드 환경에 등록된 모의 계좌입니다
        </CustomText>
        <View style={styles.rowContainer}>
          {/* <LottieView
            source={require('../../assets/animeAI2.json')}
            autoPlay
            loop
            style={styles.animation}
          // renderMode="HARDWARE" // GPU 가속 렌더링
          // resizeMode="cover" // 화면에 꽉 차게, 비율 유지
          /> */}
          {/* <LottieView
          source={require('../../assets/animeAI.json')}
          autoPlay
          loop
          style={styles.animation}
          // renderMode="HARDWARE" // GPU 가속 렌더링
          // resizeMode="cover" // 화면에 꽉 차게, 비율 유지
          /> */}
        </View>
        <CustomText style={styles.subTitle}> {ownName} 님의 계좌 목록이에요</CustomText>
        {/* // 여기에 은행별로 고를수 잇게 옵션 버튼 넣어줘, 전체, 신한, 국민, 하나 등등등 */}

        {/* 은행 옵션 버튼 */}
        <View style={styles.filterContainer}>
          {BANK_OPTIONS.map(bank => {
            // “은행” 접미사만 제거
            const label = bank.replace(/은행$/, '');
            return (
              <TouchableOpacity
                key={bank}
                style={[
                  styles.filterButton,
                  selectedBank === bank && styles.filterButtonActive
                ]}
                onPress={() => setSelectedBank(bank)}
              >
                <Text
                  style={[
                    styles.filterText,
                    selectedBank === bank && styles.filterTextActive
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <FlatList
          data={
            // '전체' 혹은 로딩 상태(옵션 문구)에 선택되어 있으면 전체 목록을,
            // 그 외에는 필터링된 목록을 보여주기
            (selectedBank === '전체' || selectedBank === '은행 불러오는 중...')
              ? accountList
              : accountList.filter(item => {
                const b = accountBalances.find(b => b.fintech_use_num === item.fintech_use_num);
                return b?.bank_name === selectedBank;
              })
          }
          keyExtractor={item => item.fintech_use_num}
          renderItem={({ item, index }) => {
            // 배열에서 해당 계좌의 잔고 정보를 찾아 반환
            const balanceObj = accountBalances.find(
              b => b.fintech_use_num === item.fintech_use_num,
            );
            // 2) DB에서 받은 upsert 정보
            const dbObj = dbAccounts.find(
              d => d.accountId === item.fintech_use_num,
            );
            const colors = GRADIENT_COLOR_SETS[index % GRADIENT_COLOR_SETS.length];
            return (
              <View>
                {/* 배경 알록달록 */}
                <LinearGradient
                  colors={colors}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 1, y: 0 }}
                  locations={[2, 0.5, 4]}
                  style={styles.gradientBorder} // 외곽 그라데이션
                >
                  <Pressable
                    style={[styles.accountItem]}
                    onPress={() =>
                      navigation.navigate('AccountDetail', {
                        userName: testBedAccount,
                        fintechUseNum: item.fintech_use_num,
                        bankName: item.bank_name,
                        balance: dbObj?.amount ?? 0,
                        accountNum: dbObj?.accountNum ?? '정보없음',
                      })
                    }
                  >
                    <View style={styles.accountInfo}>
                      <CustomText style={styles.bankName}>
                        {''}
                        {balanceObj ? balanceObj.bank_name : '은행 조회 중...'}
                      </CustomText>
                      <CustomText style={styles.accountNumber}>
                        {/* 계좌번호 : {item.account_num_masked || '정보없음'} */}
                        계좌번호 : {dbObj?.accountNum || '정보없음'}
                        {/* const { dbName } = CONFIG[testBedAccount] || {}; 컬렉션에서 item.fintech_use_num == accountId 고유값 따라서 accountNum 가져오기 */}
                      </CustomText>
                      <CustomText style={styles.balance}>
                        잔액: {' '}
                        {(() => {
                          const raw = dbObj?.amount;
                          // 1) MongoDB Decimal128 JSON 직렬화 형태 처리
                          const maybeStr =
                            raw && typeof raw === 'object' && '$numberDecimal' in raw
                              ? raw.$numberDecimal
                              : raw;
                          // 2) 숫자 변환
                          const num = Number(maybeStr);
                          // 3) NaN 체크 후 출력
                          return !isNaN(num) ? num.toLocaleString() : '정보없음';
                        })()}
                      </CustomText>
                    </View>
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        style={styles.receiveButton}
                        onPress={() => {
                          onPressDeposit(item);
                        }}
                        disabled={isAnimating}
                        activeOpacity={isAnimating ? 1 : 0.7}
                      >
                        <CustomText style={styles.receiveButtonText}>
                          테스트 지원금
                        </CustomText>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.withdrawButton}
                        // onPress={() => handleWithdraw(item)}
                        // onPress={() => onPressWithdraw(item)}
                        onPress={() => navigation.navigate('WithdrawAccount', {
                          amount: dbObj?.amount || 0,
                          bankName: item.bank_name,
                          accountNum: dbObj?.accountNum || '정보없음',
                          testBedAccount: testBedAccount,
                        })}
                      >
                        <CustomText style={styles.withdrawButtonText}>
                          송금
                        </CustomText>
                      </TouchableOpacity>
                      {/* <TouchableOpacity
                      style={styles.withdrawButton}
                      onPress={() => onPressUpsert(item)}>
                      <CustomText style={styles.resetButtonText}>
                        리셋
                      </CustomText>
                    </TouchableOpacity> */}
                    </View>
                  </Pressable>
                </LinearGradient>
              </View>
            );
          }
          }
        />
        {/* <Button title="token 캐시 초기화" onPress={confirmClearToken} /> */}
        {/* 배경 원 1 */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.circle,
            {
              opacity: circleOpacity,
              transform: [{ scale: circleScale }],
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
              transform: [{ scale: circleScale }],
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
            style={{ flex: 1 }}>
            {/* 바깥 터치로 닫기 */}
            <TouchableWithoutFeedback onPress={closeOverlay}>
              <View style={styles.overlay}>
                {/* 내부 콘텐츠 터치만 막기 */}
                <TouchableWithoutFeedback>
                  <View style={styles.modalContent}>
                    <Text style={styles.withdrawTitle}>임시 modal ... 출금 금액 입력</Text>
                    <View style={styles.buttonRow}>
                      <TouchableOpacity style={styles.button2} onPress={closeOverlay}>
                        <Text style={styles.buttonText2}>취소</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.button2} onPress={handleWithdraw}>
                        <Text style={styles.buttonText2}>확인</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </Modal>
        <CustomModal
          visible={isModalVisible}
          title={modalTitle}
          message={modalMessage}
          buttons={buttons}
        />
      </LinearGradient>
    );
  }

  // 그 외의 상태: 진행 중 메시지
  return (
    <View style={styles.container}>
      <Text>프로세스 진행 중...</Text>
      <Text>이 화면 메시지도 바꾸고 로딩바로 만들고 등등</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  rowContainer: {
    flexDirection: 'row',            // ← 여기서 가로 방향 지정
    justifyContent: 'space-around',  // ← 아이템 간 간격 조절
    alignItems: 'center',            // ← 세로 정렬
    // flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    backgroundColor: 'yellow',
  },
  mainTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    backgroundColor: 'yellow',
  },
  subTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'right',
    // backgroundColor: 'yellow',
  },
  withdrawTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    backgroundColor: 'pink',
  },
  // 외곽선만 담당 (그라데이션 + 테두리 두께)
  gradientBorder: {
    borderRadius: 20,
    padding: -20,      // 테두리 두께
    marginBottom: 5,
    // 외곽 그림자 필요 시 여기 추가
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 5,
    elevation: 1,
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderRadius: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 2,
    borderWidth: 4,
    borderColor: 'rgba(75, 124, 229, 0.5)',
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
    backgroundColor: '#66BB6A',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },   // 입체감 강조
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },

  withdrawButton: {
    backgroundColor: '#5C88E0',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },   // 동일한 그림자 효과
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },

  receiveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },

  withdrawButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
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
    shadowOffset: { width: 0, height: 2 },
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
  animation: {
    width: 200,
    height: 200,
  },
  button: {
    width: '80%',
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  button2: {
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center',
  },
  kmjButton: {
    backgroundColor: '#4A90E2'
  },
  hwcButton: {
    backgroundColor: '#50E3C2'
  },
  buttonText: {
    fontSize: 30,
    color: '#000',
    fontWeight: '600'
  },
  buttonText2: {
    fontSize: 30,
    color: '#000',
    // fontWeight: '100'
  },
  filterContainer: {
    width: '100%',
    flexDirection: 'row',   // 가로 정렬
    flexWrap: 'wrap',       // 줄 바꿈 허용
    paddingVertical: 8,
    justifyContent: 'flex-start',  // 왼쪽 정렬
    alignItems: 'flex-start',      // 위쪽 정렬
  },
  filterButton: {
    // stretch 방지
    alignSelf: 'flex-start',  // 부모의 alignItems와 상관없이 이 아이템만 제 크기로
    flexGrow: 0,              // 늘어나지 않음
    flexShrink: 0,            // 줄어들지 않음
    width: 'auto',            // 가로 크기는 자동

    minHeight: 20,
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'rgba(74, 144, 226, 0.5)',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginRight: 8,
    marginBottom: 10,
    // justifyContent: 'center',   // ← 수직 중앙 정렬
    // alignItems: 'center',       // ← 수평 중앙 정렬
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: 'rgb(74, 144, 226)',
  },
  filterText: {
    fontSize: 20,
    color: '#444',
  },
  filterTextActive: {
    color: '#fff',
  },
});

export default AccountScreenGUI;