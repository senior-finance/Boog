// screens/WithdrawBankScreen.tsx
import React, { useState } from 'react';
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
} from 'react-native'; import { Picker } from '@react-native-picker/picker';
import { useRoute, useNavigation } from '@react-navigation/native';
import CustomText from '../../components/CustomText';
import { NumPad } from '@umit-turk/react-native-num-pad';
import { TextInputMask } from 'react-native-masked-text';
import CustomNumPad from '../../components/CustomNumPad';
import LinearGradient from 'react-native-linear-gradient';

export default function WithdrawBankScreen() {
  const { accountNumber } = useRoute().params;
  const nav = useNavigation();
  const [bank, setBank] = useState('');
  const [selected, setSelected] = useState('');
  const [visible, setVisible] = useState(false);

  const BANKS = [
    { label: 'KDB산업은행', value: 'KDB산업은행', icon: require('../../assets/banks/KDB.png') },
    { label: 'SBI저축은행', value: 'SBI저축은행', icon: require('../../assets/banks/SBI.png') },
    { label: 'SC제일은행', value: 'SC제일은행', icon: require('../../assets/banks/SC제일.png') },
    { label: 'Sh수협은행', value: 'Sh수협은행', icon: require('../../assets/banks/Sh수협.png') },
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
    { label: 'IBK기업은행', value: 'IBK기업은행', icon: require('../../assets/banks/IBK.png') },
    { label: 'MG새마을금고', value: 'MG새마을금고', icon: require('../../assets/banks/MG새마을금고.png') },
  ];

  return (
    <LinearGradient
      colors={['rgb(216,236,255)', 'rgb(233,244,255)']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.title}>은행명을 골라주세요</Text>
      <Text style={styles.accountText}>출금할 계좌 번호 : {accountNumber}</Text>
      {/* <Text style={styles.bankText}>출금할 은행: {bank}</Text>
      <Text style={styles.amountText}>입력된 금액: {amount}</Text> */}
      {/* <Picker
        selectedValue={bank}
        onValueChange={(v) => setBank(v)}
        style={{ marginVertical: 20 }}
      >
        <Picker.Item label="은행 선택" value="" />
        <Picker.Item label="우리은행" value="Woori" />
        <Picker.Item label="국민은행" value="KB" />
      </Picker> */}

      <TouchableOpacity
        style={styles.button}
        onPress={() => setVisible(true)}
      >
        {selected ? (
          <View style={styles.selectedButtonContent}>
            <Image
              source={BANKS.find(b => b.value === selected).icon}
              style={styles.icon}
            />
            <Text style={styles.label}>
              {'  '}선택한 은행 : {BANKS.find(b => b.value === selected).label}
            </Text>
          </View>
        ) : (
          <Text style={styles.label}>은행을 선택해 주세요</Text>
        )}
      </TouchableOpacity>
      <Modal transparent animationType="slide" visible={visible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FlatList
              data={[...BANKS].sort((a, b) => a.label.localeCompare(b.label))}
              keyExtractor={item => item.value}
              numColumns={3}                                // ★ 2열로 설정
              columnWrapperStyle={styles.row}               // 한 행당 justifyContent 조정
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
          <TouchableOpacity
            onPress={() => nav.goBack()}
            style={{
              width: 160,
              paddingVertical: 20,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '600' }}>
              이전
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
            disabled={!selected}         // accountNumber 없으면 비활성화
            onPress={() => nav.navigate('WithdrawAmount', {
              accountNumber, bank: selected                                       // ← selected를 넘기기
            })}
            style={{
              width: 160,
              paddingVertical: 20,
              alignItems: 'center',
              opacity: selected ? 1 : 0.6,  // 비활성 시 반투명
            }}
          >
            <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '600' }}>
              다음
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </LinearGradient >
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
  item: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  icon: { width: 80, height: 80, marginBottom: 10 },
  label: { textAlign: 'center', fontSize: 16 },
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
});