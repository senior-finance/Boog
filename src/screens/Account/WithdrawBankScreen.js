// screens/WithdrawBankScreen.tsx
import React, { useState } from 'react';
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
import { Picker } from '@react-native-picker/picker';
import { useRoute, useNavigation } from '@react-navigation/native';
import CustomText from '../../components/CustomText';
import { NumPad } from '@umit-turk/react-native-num-pad';
import { TextInputMask } from 'react-native-masked-text';
import CustomNumPad from '../../components/CustomNumPad';
import LinearGradient from 'react-native-linear-gradient';
import { accountGetAll, withdrawVerify } from '../../database/mongoDB';
import LottieView from 'lottie-react-native';
import CustomModal from '../../components/CustomModal';

export default function WithdrawBankScreen() {
  // 커스텀 모달
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalButtons, setModalButtons] = useState([]);
  const showModal = (title, message, buttons = [
    {
      text: '확인',
      onPress: () => setModalVisible(false),
      color: '#4B7BE5',
    },
  ]) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalButtons(buttons);
    setModalVisible(true);
  };

  const { accountNumTo } = useRoute().params;
  const { amount, bankName, accountNum, testBedAccount } = useRoute().params;

  const nav = useNavigation();
  const [bankTo, setBankTo] = useState('');
  const [selected, setSelected] = useState('');
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const BANKS = [
    { label: 'KDB산업은행', value: 'KDB산업은행', icon: require('../../assets/banks/KDB.png') },
    { label: '저축은행', value: '저축은행', icon: require('../../assets/banks/SBI.png') },
    { label: 'SC제일은행', value: 'SC제일은행', icon: require('../../assets/banks/SC제일.png') },
    { label: '수협은행', value: '수협은행', icon: require('../../assets/banks/Sh수협.png') },
    { label: '광주은행', value: '광주은행', icon: require('../../assets/banks/광주.png') },
    { label: '농협은행', value: '농협은행', icon: require('../../assets/banks/농협.png') },
    { label: '신한은행', value: '신한은행', icon: require('../../assets/banks/신한.png') },
    { label: '신협은행', value: '신협은행', icon: require('../../assets/banks/신협.png') },
    { label: '씨티은행', value: '씨티은행', icon: require('../../assets/banks/씨티.png') },
    { label: '우리은행', value: '우리은행', icon: require('../../assets/banks/우리.png') },
    { label: '우체국은행', value: '우체국은행', icon: require('../../assets/banks/우체국.png') },
    { label: '저축은행', value: '저축은행', icon: require('../../assets/banks/저축은행.png') },
    { label: '카카오뱅크', value: '카카오뱅크', icon: require('../../assets/banks/카카오뱅크.png') },
    { label: '케이뱅크', value: '케이뱅크', icon: require('../../assets/banks/케이뱅크.png') },
    { label: '토스뱅크', value: '토스뱅크', icon: require('../../assets/banks/토스.png') },
    { label: '하나은행', value: '하나은행', icon: require('../../assets/banks/하나.png') },
    { label: 'KB국민은행', value: 'KB국민은행', icon: require('../../assets/banks/KB.png') },
    { label: '기업은행', value: '기업은행', icon: require('../../assets/banks/IBK.png') },
    { label: '새마을금고', value: '새마을금고', icon: require('../../assets/banks/MG새마을금고.png') },
    { label: '부산은행', value: '부산은행', icon: require('../../assets/banks/부산은행.png') },
  ];

  const handleNext = async () => {
    if (!selected) return;
    setLoading(true);

    // 로딩 딜레이
    await new Promise(res => setTimeout(res, 100));

    try {
      // 하이픈 제거한 계좌번호와 선택된 은행명으로 검증
      const cleanNum = accountNumTo.replace(/\D/g, '');
      const accounts = await withdrawVerify({
        accountNum: cleanNum,
        accountBank: selected
      });
      // console.log(cleanNum);

      // 느슨하게 포함 여부로만 판별
      const prefix = selected.slice(0, -2); // e.g. "KDB산업"
      const matched = accounts.filter(acc =>
        acc.accountBank.includes(prefix)
      );

      if (matched.length > 0) {
        nav.navigate('WithdrawAmount', {
          accountNumTo,
          bankTo: selected,
          accountNum,
          bankName,
          amount,
          testBedAccount,
        });
      } else {
        // console.log(accountNumTo, accounts.map(a => a.accountBank), selected);
        showModal('오류', `은행명이 일치하지 않아요`);
      }
    } catch (e) {
      showModal('서버 에러', '다시 시도해주세요');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#DAEFFF", "#F0F6FF"]} style={styles.container}>

      <Text style={styles.title}>송금할 은행을 선택해주세요</Text>
      <View style={styles.accountBox}>
        <Text style={styles.accountLabel}>송금할 계좌 번호</Text>
        <Text style={styles.accountNum}>{accountNumTo}</Text>
      </View>
      <TouchableOpacity style={styles.selectButton} onPress={() => setVisible(true)}>
        <View style={styles.selectedButtonContent}>
          {selected ? (
            <>
              <Image source={BANKS.find(b => b.value === selected).icon} style={styles.icon} />
              <Text style={styles.label}>{BANKS.find(b => b.value === selected).label}</Text>
            </>
          ) : (
            <Text style={styles.label}>송금할 은행을 선택해주세요</Text>
          )}
        </View>
      </TouchableOpacity>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.navButton} onPress={() => nav.goBack()}>
          <Text style={styles.navButtonText}>이전</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navButton, !selected && { opacity: 0.6 }]}
          disabled={!selected}
          onPress={handleNext}
        >
          <Text style={styles.navButtonText}>다음</Text>
        </TouchableOpacity>
      </View>

      <Modal transparent animationType="slide" visible={visible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FlatList
              data={[...BANKS].sort((a, b) => a.label.localeCompare(b.label))}
              keyExtractor={item => item.value}
              numColumns={3}                                // ★ 2열로 설정
              columnWrapperStyle={styles.row}               // 한 행당 justifyContent 조정
              ItemSeparatorComponent={() => <View style={styles.separator} />}    // ← 여기에
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.gridItem}
                  onPress={() => {
                    setSelected(item.value);
                    setVisible(false);
                  }}
                >
                  <Image source={item.icon} style={styles.icon} />
                  <Text style={styles.label}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
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
        </LinearGradient>
      </View>
      {loading && (
        <View style={styles.overlay}>
          <LottieView
            source={require('../../assets/loadingg.json')}
            autoPlay
            loop={false}
            style={styles.lottie}
          />
        </View>)}
      <CustomModal
        visible={modalVisible}
        title={modalTitle}
        message={modalMessage}
        buttons={modalButtons}
      />
    </LinearGradient >
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,

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
  button: {
    /* 기존 스타일 유지 */
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 5,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  selectedButtonContent: {
    flexDirection: 'row',
    justifyContent: 'center', alignItems: 'center'
  },
  modalOverlay: {
    flex: 2, backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center', alignItems: 'center'
  },
  modalContent: {
    width: '80%', maxHeight: '60%',
    backgroundColor: '#fff', borderRadius: 8, padding: 16
  },
  row: {
    justifyContent: 'space-between',  // 좌우 간격 고르게
    marginBottom: 12,
  },
  gridItem: {
    flex: 2,                          // 한 행에 3개 중 1개가 flex:1
    alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#128ae0',
    marginBottom: 10,
  },
  item: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  icon: { width: 80, height: 80, marginBottom: 10 },
  label: { textAlign: 'center', fontSize: 16, fontWeight: 'bold' },
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
    fontSize: 16,
    marginBottom: 20,
  },
  bankText: {
    textAlign: 'center',
    color: '#3498DB',   // 파란색
    fontSize: 16,
  },
  amountText: {
    textAlign: 'center',
    color: '#3498DB',
    fontSize: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  lottie: {
    width: 320,
    height: 320,
  },
  title: {
    fontSize: 23,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#1B1B1B',
    marginBottom: 25,
  },
  accountBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 24,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  accountLabel: {
    fontSize: 20,
    color: '#888',
    marginBottom: 6,
  },
  accountNum: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#3498DB',
  },
  selectButton: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#A9C7F6',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    minHeight: 90,
  },
  selectedButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    maxHeight: '70%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  gridItem: {
    flex: 1,
    alignItems: 'center',
  },
  icon: {
    width: 70,
    height: 70,
    marginBottom: 6,
  },
  label: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginLeft: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 40,
  },
  navButton: {
    flex: 1,
    paddingVertical: 18,
    backgroundColor: '#4C6EF5',
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  lottie: {
    width: 320,
    height: 320,
  },
});