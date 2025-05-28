import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
  Text,
  Image
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '../../components/CustomText';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function DepositStep2({ navigation, route }) {
  const [selectedBank, setSelectedBank] = useState('');
  const [visible, setVisible] = useState(false);

  const BANKS = [
    { label: '산업은행', value: '산업은행', icon: require('../../assets/banks/KDB.png') },
    { label: '저축은행', value: '저축은행', icon: require('../../assets/banks/SBI.png') },
    { label: 'SC제일은행', value: 'SC제일은행', icon: require('../../assets/banks/SC제일.png') },
    { label: 'Sh수협은행', value: '수협은행', icon: require('../../assets/banks/Sh수협.png') },
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
    { label: '국민은행', value: '국민은행', icon: require('../../assets/banks/KB.png') },
    { label: '기업은행', value: '기업은행', icon: require('../../assets/banks/IBK.png') },
    { label: '새마을금고', value: '새마을금고', icon: require('../../assets/banks/MG새마을금고.png') },
    { label: '부산은행', value: '부산은행', icon: require('../../assets/banks/부산은행.png') },
  ];

  return (
    <LinearGradient colors={['#D8ECFF', '#E9F4FF']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <View style={styles.contentWrapper}>
          <View style={styles.card}>
            <CustomText style={styles.title}>
              송금 연습을 해볼게요{'\n'}실제로 송금이 되지는 않아요!
            </CustomText>

            <CustomText style={styles.subtitle}>어떤 은행인지 알려주세요</CustomText>

            <TouchableOpacity
              style={styles.pickerContainer}
              onPress={() => setVisible(true)}
            >
              {selectedBank ? (
                <View style={styles.selectedButtonContent}>
                  <Image
                    source={BANKS.find(b => b.value === selectedBank).icon}
                    style={styles.icon}
                  />
                  <Text style={styles.label}>
                    {BANKS.find(b => b.value === selectedBank).label}
                  </Text>
                </View>
              ) : (
                <Text style={styles.label}>은행을 선택하세요</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.nextButton,
                { backgroundColor: selectedBank ? '#4B7BE5' : '#B0C7E7' },
              ]}
              onPress={() =>
                navigation.navigate('DepositStep3', {
                  accountNumber: route.params.accountNumber,
                  selectedBank,
                })
              }
              disabled={!selectedBank}
            >
              <CustomText style={styles.nextButtonText}>다음 화면</CustomText>
            </TouchableOpacity>
          </View>

          <CustomText style={styles.quitGuide}>연습을 그만두고 싶다면</CustomText>

          <TouchableOpacity style={styles.quitButton} onPress={() => navigation.navigate('MainTabs')}>
            <View style={styles.quitContent}>
              <Ionicons name="exit-outline" size={26} color="#4B7BE5" style={styles.quitIcon} />
              <CustomText style={styles.quitText}>그만둘래요</CustomText>
            </View>
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
                      setSelectedBank(item.value); // ✅ 이게 맞는 함수입니다!
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
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  contentWrapper: {
    width: '100%',
    alignItems: 'center',
    marginTop: 80,
  },
  card: {
    backgroundColor: '#FFFFFF',
    width: '90%',
    paddingVertical: 40,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(75, 123, 229, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 50,
  },
  title: {
    fontWeight: 'bold',
    color: '#4B7BE5',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 32,
  },
  subtitle: {
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 26,
  },
  pickerContainer: {
    width: '100%',
    height: 100,
    borderWidth: 1,
    borderColor: '#AABDDC',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 36,
    backgroundColor: '#F0F6FF',
    justifyContent: 'center',
    paddingHorizontal: 16,
    flexDirection: 'row',          // 추가
    justifyContent: 'center',      // 추가
    alignItems: 'center',          // 추가
  },
  selectedButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 10,
    resizeMode: 'contain',
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  nextButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    fontWeight: 'bold',
    color: 'white',
  },
  quitGuide: {
    color: '#999',
    marginBottom: 10,
    textAlign: 'center',
  },
  quitButton: {
    backgroundColor: '#FFFFFF',
    width: '90%',
    paddingVertical: 25,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
    borderColor: 'rgba(75, 123, 229, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  quitContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quitIcon: {
    marginRight: 6,
    marginTop: 1,
  },
  quitText: {
    fontWeight: 'bold',
    color: '#4B7BE5',
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
});