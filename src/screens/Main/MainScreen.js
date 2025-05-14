import React, { useLayoutEffect, useState, useMemo } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomText from '../../components/CustomText';
import CustomTextInput from '../../components/CustomTextInput';
import Icon from 'react-native-vector-icons/FontAwesome';

const FunctionButton = ({ title, onPress, icon }) => (
  <TouchableOpacity style={styles.functionButton} onPress={onPress}>
    <LinearGradient
      colors={['rgb(255, 255, 255)', 'rgb(220, 240, 255)']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.functionButtonInner}
    >
      <Ionicons name={icon} size={28} color='rgb(62, 146, 224)' />
      <CustomText style={styles.functionText}>{title}</CustomText>
    </LinearGradient>
  </TouchableOpacity>
);

const CircleButton = ({ title, icon, onPress }) => (
  <TouchableOpacity style={styles.circleButton} onPress={onPress}>
    <Ionicons name={icon} size={28} color='rgb(211, 225, 237)' />
    <CustomText style={styles.circleButtonText}>{title}</CustomText>
  </TouchableOpacity>
);

const MainScreen = ({ navigation }) => {
  const [showHistory, setShowHistory] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  const [memo, setMemo] = useState('');
  const [editing, setEditing] = useState(false);

  const actionButtons = [
    { title: '송금', icon: 'swap-horizontal', onPress: () => navigation.navigate() },
    { title: '퀴즈', icon: 'help-circle', onPress: () => navigation.navigate('Learning') },
    { title: '지도', icon: 'map', onPress: () => navigation.navigate('MapView') },
    { title: '복지혜택', icon: 'gift', onPress: () => navigation.navigate('Welfare') },
  ];

  const featureButtons = [
    { title: 'AI 챗봇', icon: 'chatbubble-ellipses-outline', onPress: () => navigation.navigate('VoiceInput') },
    { title: '통화·문자', icon: 'analytics-outline', onPress: () => navigation.navigate('AutoPhoneAnalysis') },
    { title: '지문 인증', icon: 'finger-print', onPress: () => navigation.navigate('Biometric') },
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
    setMemo(tx.amount);
    setEditing(false);
    setModalVisible(true);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Account')} style={{ marginLeft: 16 }}>
          <Ionicons name="log-in-outline" size={24} color='rgb(85, 170, 250)' />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('NotificationScreen')} style={{ marginRight: 16 }}>
          <Ionicons name="notifications-outline" size={24} color="#4A90E2" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <LinearGradient colors={['rgb(216, 236, 255)', 'rgb(233, 244, 255)']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        <View style={styles.balanceCard}>
          <View style={styles.circleDecor} />
          <View style={[styles.circleDecor, styles.circleOffset]} />
          <View style={styles.arrowPattern} />
          <View style={styles.dottedLine} />
          <TouchableOpacity
            style={[styles.settingsButton, { flexDirection: 'row', alignItems: 'center' }]}
            onPress={() => {
              // 설정 화면으로 이동하거나 모달 열기 등
            }}
          >
            <Icon name="gear" size={24} color="#fff" />
            <Text style={{ color: '#fff', fontSize: 16, marginLeft: 5 }}>
              설정
            </Text>
          </TouchableOpacity>
          <CustomText style={[styles.accountNum, { fontSize: (styles.accountNum.fontSize || +20) }]}>
            대표 계좌: 114-6566-180
          </CustomText>
          <CustomText style={[styles.balanceAmt, { fontSize: (styles.balanceAmt.fontSize || +20) }]}>
            ₩ 104,000,000
          </CustomText>
        </View>

        <CustomText style={styles.sectionSubTitle}>주요 기능</CustomText>
        <View style={styles.actionRow}>
          {actionButtons.map((btn, i) => <FunctionButton key={i} {...btn} />)}
        </View>

        <CustomText style={styles.sectionSubTitle}>스마트 기능</CustomText>
        <View style={styles.featureRow}>
          {featureButtons.map((btn, i) => <CircleButton key={i} {...btn} />)}
        </View>

        <TouchableOpacity style={styles.toggleRow} onPress={() => setShowHistory(v => !v)}>
          <CustomText style={styles.sectionTitle}>거래 내역</CustomText>
          <Ionicons name={showHistory ? 'chevron-up-outline' : 'chevron-down-outline'} size={20} color="#4A90E2" />
        </TouchableOpacity>

        {showHistory && (
          <View style={styles.historyList}>
            {history.map((tx, idx) => (
              <TouchableOpacity key={idx} style={styles.txCard} onPress={() => openModal(tx)}>
                <View style={styles.txInfo}>
                  <CustomText style={styles.txName}>{tx.name}</CustomText>
                  <CustomText style={styles.txDate}>{tx.date}</CustomText>
                </View>
                <CustomText style={[styles.txAmt, { color: tx.isDeposit ? '#4A90E2' : '#FF6B81' }]}>{tx.amount}</CustomText>
              </TouchableOpacity>
            ))}
          </View>
        )}

      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalBox}>
            <CustomText style={styles.modalTitle}>상세 내역</CustomText>
            <CustomText>이름: {selectedTx?.name}</CustomText>
            <CustomText>날짜: {selectedTx?.date}</CustomText>
            <CustomText>금액: {selectedTx?.amount}</CustomText>

            <View style={styles.memoRow}>
              <CustomText style={styles.memoLabel}>메모:</CustomText>
              {!editing ? (
                <TouchableOpacity onPress={() => setEditing(true)}>
                  <Ionicons name="create-outline" size={20} color="#4A90E2" />
                </TouchableOpacity>
              ) : (
                <>
                  <CustomTextInput value={memo} onChangeText={setMemo} placeholder="메모 입력" style={styles.memoInput} multiline />
                  <TouchableOpacity onPress={() => { selectedTx.memo = memo; setEditing(false); }} style={styles.saveBtn}>
                    <CustomText style={styles.saveText}>저장</CustomText>
                  </TouchableOpacity>
                </>
              )}
            </View>

            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
              <CustomText style={styles.closeText}>닫기</CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },

  balanceCard: {
    backgroundColor: '#4A90E2',
    borderRadius: 20,
    padding: 50,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#AD4F5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    elevation: 8,
    overflow: 'hidden',
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
    backgroundColor: '#9ED0FF',
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

  sectionSubTitle: { fontWeight: '600', color: '#4A90E2', marginBottom: 10 },
  sectionTitle: { fontWeight: 'bold', color: '#4A90E2' },
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
    backgroundColor: '#FFFFFF', // 배경 밝게

    // 📏 그림자 강조 (아래 + 오른쪽)
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,

    // 🔲 테두리로 윤곽 강조
    borderWidth: 2,
    borderColor: '#C4DCFF',
  },

  functionText: {
    color: '#444444'
    , marginTop: 6, fontWeight: '600'
  },

  circleButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginHorizontal: 12,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',

    // ✅ 그림자 더 진하게
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 5,


    // ✅ 테두리 살짝 넣기 (흰 배경 대비)
    borderWidth: 1,
    borderColor: '#387FD8',
  },

  circleButtonText: { position: 'absolute', bottom: -24, color: 'rgb(59, 101, 173)', textAlign: 'center' },

  historyList: { width: '100%' },
  txCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#AAD4F5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgb(189, 222, 240)',
  },
  txInfo: { flex: 1 },
  txName: { fontWeight: '600', color: '#333' },
  txDate: { color: '#888', marginTop: 4 },
  txAmt: { fontWeight: 'bold' },

  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalBox: { width: '80%', backgroundColor: '#fff', padding: 24, borderRadius: 16 },
  modalTitle: { fontWeight: 'bold', color: '#4A90E2', marginBottom: 12 },
  memoRow: { marginTop: 16 },
  memoLabel: { fontWeight: '600', marginBottom: 8 },
  memoInput: { backgroundColor: '#F0F0F0', borderRadius: 8, padding: 10, minHeight: 60 },
  saveBtn: { marginTop: 12, backgroundColor: '#4A90E2', paddingVertical: 10, borderRadius: 8 },
  saveText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
  closeBtn: { marginTop: 16, backgroundColor: '#CCC', paddingVertical: 10, borderRadius: 8 },
  closeText: { textAlign: 'center', fontWeight: '600', color: '#333' },
    settingsButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',  // 필요에 따라 배경 조정
  },
});

export default MainScreen;
