import React, { useLayoutEffect, useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Switch,
  BackHandler,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomText from '../../components/CustomText';
import CustomTextInput from '../../components/CustomTextInput';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSeniorMode } from '../../components/SeniorModeContext';
import CustomModal from '../../components/CustomModal';
import { CommonActions } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';

const FunctionButton = ({ title, onPress, icon }) => {
  const { seniorMode } = useSeniorMode();
  const size = seniorMode ? 40 : 28;
  const paddingVertical = seniorMode ? 24 : 12;
  const buttonWidth = seniorMode ? '45%' : '22%';

  return (
    <TouchableOpacity style={[styles.functionButton, { width: buttonWidth }]} onPress={onPress}>
      <LinearGradient
        colors={['#FFFFFF', '#b3d6fe']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[styles.functionButtonInner, { paddingVertical }]}
      >
        <Ionicons name={icon} size={size} color='rgb(58, 135, 235)' />
        <CustomText style={[styles.functionText, { marginTop: 6 }]}>{title}</CustomText>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const CircleButton = ({ title, icon, onPress }) => {
  const { seniorMode } = useSeniorMode();
  const size = seniorMode ? 90 : 70;
  const iconSize = seniorMode ? 36 : 28;

  return (
    <View style={{ alignItems: 'center', marginHorizontal: 12 }}>
      <TouchableOpacity
        style={[styles.circleButton, { width: size, height: size, borderRadius: size / 2 }]}
        onPress={onPress}
      >
        <Ionicons name={icon} size={iconSize} color='rgb(232, 245, 255)' />
      </TouchableOpacity>
      <CustomText
        style={{
          color: '#004AAD',
          marginTop: 1,
          textAlign: 'center',
          fontWeight: '600',
        }}
      >
        {title}
      </CustomText>
    </View>
  );
};

const MainScreen = ({ navigation }) => {
  const [showHistory, setShowHistory] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  const [memo, setMemo] = useState('');
  const [editing, setEditing] = useState(false);
  const { seniorMode, setSeniorMode } = useSeniorMode();

  const [exitModalVisible, setExitModalVisible] = useState(false);

  const scrollViewRef = useRef(null);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        setExitModalVisible(true); // 종료 모달 오직 홈화면에서만
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  const actionButtons = [
    { title: '송금', icon: 'swap-horizontal', onPress: () => navigation.navigate() },
    { title: '퀴즈', icon: 'help-circle', onPress: () => navigation.navigate('Learning') },
    { title: '지도', icon: 'map', onPress: () => navigation.navigate('MapView') },
    { title: '복지혜택', icon: 'gift', onPress: () => navigation.navigate('Welfare') },
  ];

  const featureButtons = [
    { title: 'AI 챗봇', icon: 'chatbubble-ellipses-outline', onPress: () => navigation.navigate('VoiceInput') },
    { title: '통화.문자', icon: 'analytics-outline', onPress: () => navigation.navigate('AutoPhoneAnalysis') },
    { title: '보이스 피싱', icon: 'alert-circle-outline', onPress: () => navigation.navigate('VoicePhishingScreen') },
  ];


  const outgo = [
    { name: '김민수', date: '2024-05-13', amount: '-₩50,000', isDeposit: false },
    { name: '영희', date: '2024-05-12', amount: '-₩30,000', isDeposit: false },
  ];
  const income = [
    { name: '신한은행', date: '2024-05-14', amount: '+₩200,000', isDeposit: true },
    { name: '엄마', date: '2024-05-11', amount: '+₩100,000', isDeposit: true },
  ];

  const history = useMemo(() => [...outgo, ...income].sort((a, b) => new Date(b.date) - new Date(a.date)), []);

  const openModal = tx => {
    setSelectedTx(tx);
    setMemo(memoMap[tx.date + tx.name] || '');
    setEditing(false);
    setModalVisible(true);
  };

  const [memoMap, setMemoMap] = useState({});
  const [saveMsg, setSaveMsg] = useState('');
  const [showActions, setShowActions] = useState(true);
  const [showFeatures, setShowFeatures] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Account')} style={{ marginLeft: 16 }}>
          <Ionicons name="log-in-outline" size={24} color='#0052CC' />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('NotificationScreen')} style={{ marginRight: 16 }}>
          <Ionicons name="notifications-outline" size={24} color="#0052CC" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <LinearGradient colors={['rgba(159, 193, 219, 0.66)', '#e0f0ff']} style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom:
              (seniorMode ? 48 : 32) +
              (showHistory ? 0 : (seniorMode ? 48 : 16)) +
              20    // 네비게이션 바·안전 영역 고려
          }
        ]}
      >
        <View style={styles.seniorModeToggleContainer}>
          <CustomText style={styles.seniorModeText}>시니어 모드</CustomText>
          <Switch
            value={seniorMode}
            onValueChange={setSeniorMode}
            thumbColor={seniorMode ? '#4B7BE5' : '#ccc'}
            trackColor={{ false: '#aaa', true: '#A9C7EE' }}
          />
        </View>

        <View style={styles.balanceCard}>
          <View style={styles.circleDecor} />
          <View style={[styles.circleDecor, styles.circleOffset]} />
          <View style={styles.arrowPattern} />
          <View style={styles.dottedLine} />

          <TouchableOpacity style={styles.settingsButton}>
            <Icon name="gear" size={24} color="#fff" />
          </TouchableOpacity>

          <CustomText style={styles.accountNum}>대표 계좌: 114-6566-180</CustomText>
          <CustomText style={styles.balanceAmt}>₩ 104,000,000</CustomText>
        </View>

        <TouchableOpacity style={styles.toggleRow} onPress={() => setShowActions(v => !v)}>
          <CustomText style={styles.sectionSubTitle}>주요 기능</CustomText>
          <Ionicons name={showActions ? 'chevron-up-outline' : 'chevron-down-outline'} size={20} color="#4A90E2" />
        </TouchableOpacity>

        {showActions && (
          <View style={[
            styles.actionRow,
            seniorMode && { flexWrap: 'wrap', justifyContent: 'space-around', rowGap: 20 },
          ]}>
            {actionButtons.map((btn, i) => <FunctionButton key={i} {...btn} />)}
          </View>
        )}

        <TouchableOpacity style={styles.toggleRow} onPress={() => setShowFeatures(v => !v)}>
          <CustomText style={styles.sectionSubTitle}>스마트 기능</CustomText>
          <Ionicons name={showFeatures ? 'chevron-up-outline' : 'chevron-down-outline'} size={20} color="#4A90E2" />
        </TouchableOpacity>

        {showFeatures && (
          <View style={styles.featureRow}>
            {featureButtons.map((btn, i) => <CircleButton key={i} {...btn} />)}
          </View>
        )}

        <TouchableOpacity
          style={styles.toggleRow}
          onPress={() => {
            setShowHistory(prev => {
              const next = !prev;
              if (next) {
                // 펼쳤을 때만 소량의 딜레이 후 스크롤
                setTimeout(() => {
                  scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 0);
              }
              return next;
            });
          }}
        >
          <CustomText style={styles.sectionTitle}>거래 내역</CustomText>
          <Ionicons
            name={showHistory ? 'chevron-up-outline' : 'chevron-down-outline'}
            size={20}
            color="#4A90E2"
          />
        </TouchableOpacity>

        {showHistory && (
          <View
            style={[
              styles.historyList,
              { paddingBottom: seniorMode ? 48 : 16 }
            ]}
          >
            {history.map((tx, idx) => (
              <TouchableOpacity key={idx} style={styles.txCard} onPress={() => openModal(tx)}>
                <View style={styles.txInfo}>
                  <CustomText style={styles.txName}>{tx.name}</CustomText>
                  <CustomText style={styles.txDate}>{tx.date}</CustomText>
                </View>
                <CustomText
                  style={[
                    styles.txAmt,
                    { color: tx.isDeposit ? 'rgb(32, 111, 214)' : '#FF6B81' },
                  ]}
                >
                  {tx.amount}
                </CustomText>
              </TouchableOpacity>
            ))}
          </View>)}


      </ScrollView>
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBg}>
          <View style={styles.modalBox}>
            <CustomText style={styles.modalTitle}>거래 상세 정보</CustomText>

            {selectedTx && (
              <>
                <CustomText style={styles.memoLabel}>이름: {selectedTx.name}</CustomText>
                <CustomText style={styles.memoLabel}>날짜: {selectedTx.date}</CustomText>
                <CustomText style={styles.memoLabel}>
                  금액:{' '}
                  <CustomText
                    style={{
                      color: selectedTx.isDeposit ? 'rgb(32, 111, 214)' : '#FF6B81',
                    }}
                  >
                    {selectedTx.amount}
                  </CustomText>
                </CustomText>

                <View style={styles.memoRow}>
                  <CustomText style={styles.memoLabel}>메모</CustomText>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <CustomTextInput
                      value={memo}
                      onChangeText={setMemo}
                      multiline
                      placeholder="메모를 입력하세요"
                      style={[styles.memoInput, { flex: 1, color: '#000' }]} // 글자 검정색으로
                      editable={true}
                      autoFocus={editing}
                    />
                    <TouchableOpacity
                      onPress={() => setEditing(true)} // 메모 내용 유지하며 편집 모드 진입
                      style={{
                        padding: 6,
                        marginLeft: 8,
                        backgroundColor: '#E3EFFF',
                        borderRadius: 8,
                      }}
                    >
                      <Ionicons name="pencil" size={20} color="#0052CC" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* 저장 버튼 */}
                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={() => {
                    const key = selectedTx.date + selectedTx.name;
                    setMemoMap(prev => ({ ...prev, [key]: memo }));
                    setSaveMsg('저장되었습니다 ✅');
                    setEditing(false); // 편집 종료
                    setTimeout(() => setSaveMsg(''), 1000);
                  }}
                >
                  <CustomText style={styles.saveText}>💾 저장</CustomText>
                </TouchableOpacity>

                {/* 저장되었습니다 메시지 */}
                {saveMsg !== '' && (
                  <CustomText style={{ color: '#4B7BE5', fontWeight: '600', textAlign: 'center', marginTop: 6 }}>
                    {saveMsg}
                  </CustomText>
                )}

                {/* 닫기 버튼 */}
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => {
                    setModalVisible(false);
                    setEditing(false); // 편집 모드만 종료
                    // setMemo('') 제거 ✅ 메모 내용 유지됨
                  }}
                >
                  <CustomText style={styles.closeText}>닫기</CustomText>
                </TouchableOpacity>

              </>
            )}
          </View>
        </View>
      </Modal>



      <CustomModal
        visible={exitModalVisible}
        title="종료 확인"
        message="앱을 종료하시겠습니까?"
        buttons={[
          {
            text: '취소',
            onPress: () => setExitModalVisible(false),
            color: '#999',
            textColor: 'white',
          },
          {
            text: '확인',
            onPress: () => {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'MainTabs' }],
                })
              );
              setTimeout(() => BackHandler.exitApp(), 100);
            },
            color: '#4B7BE5',
            textColor: 'white',
          }
        ]}
      />

    </LinearGradient>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  seniorModeToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  seniorModeText: {
    color: '#0052CC',
    fontWeight: 'bold',
    marginRight: 10,
  },
  balanceCard: {
    backgroundColor: 'rgba(49, 116, 199, 0.97)',
    borderRadius: 20,
    padding: 60,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#004AAD',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    elevation: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(30, 105, 202, 0.98)' // 또는 원하는 색상

  },
  circleDecor: {
    position: 'absolute',
    width: 120,
    height: 120,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 60,
    top: 10,
    left: 20,
  },
  circleOffset: {
    top: 60,
    left: 150,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  arrowPattern: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 100,
    height: 3,
    backgroundColor: '#66B2FF',
    transform: [{ rotate: '0deg' }],
    opacity: 0.4,
  },
  dottedLine: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
    height: 1,
    borderStyle: 'dotted',
    borderWidth: 1,
    borderColor: '#fff',
    opacity: 0.3,
  },
  accountNum: { color: '#E3F2FD', fontWeight: '700', marginBottom: 20 },
  balanceAmt: { color: '#fff', fontWeight: '900', letterSpacing: 2 },

  sectionSubTitle: { fontWeight: '600', color: '#0052CC', marginBottom: 10 },
  sectionTitle: { fontWeight: 'bold', color: '#0052CC' },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },

  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
  featureRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 32 },

  functionButton: { borderRadius: 20, overflow: 'hidden', width: '22%' },
  functionButtonInner: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',

    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,

    borderWidth: 2,
    borderColor: 'rgba(14, 94, 233, 0.24)',
  },

  functionText: {
    color: '#333',
    marginTop: 6,
    fontWeight: '600'
  },

  circleButton: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginHorizontal: 20,
    backgroundColor: 'rgba(61, 136, 228, 0.97)',
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 5,

    borderWidth: 1,
    borderColor: '#004AAD',
  },

  circleButtonText: {
    position: 'absolute',
    bottom: -24,
    color: '#004AAD',
    textAlign: 'center',
    minWidth: 90,
    includeFontPadding: false,
  },

  historyList: { width: '100%' },
  txCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#66B2FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(49, 84, 223, 0.85)',
  },
  txInfo: { flex: 1 },
  txName: { fontWeight: '600', color: '#333' },
  txDate: { color: '#888', marginTop: 4 },
  txAmt: { fontWeight: 'bold' },

  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalBox: { width: '80%', backgroundColor: '#fff', padding: 24, borderRadius: 16 },
  modalTitle: { fontWeight: 'bold', color: '#0052CC', marginBottom: 12 },
  memoRow: { marginTop: 16 },
  memoLabel: { fontWeight: '600', marginBottom: 8 },
  memoInput: { backgroundColor: '#F0F0F0', borderRadius: 8, padding: 10, minHeight: 60 },
  saveBtn: { marginTop: 12, backgroundColor: '#0052CC', paddingVertical: 10, borderRadius: 8 },
  saveText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
  closeBtn: { marginTop: 16, backgroundColor: '#CCC', paddingVertical: 10, borderRadius: 8 },
  closeText: { textAlign: 'center', fontWeight: '600', color: '#333' },
  settingsButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});

export default MainScreen;