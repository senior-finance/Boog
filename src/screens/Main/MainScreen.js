import React, { useLayoutEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomText from '../../components/CustomText';
import CustomTextInput from '../../components/CustomTextInput';

const FunctionButton = ({ title, onPress, icon, size = 'large' }) => (
  <TouchableOpacity
    style={[styles.functionButton, size === 'pinned' && styles.pinnedButton]}
    onPress={onPress}
  >
    <Ionicons name={icon} size={32} color="#4B7BE5" />
    <CustomText style={styles.functionText}>{title}</CustomText>
  </TouchableOpacity>
);

const MainScreen = ({ navigation }) => {
  const [recentDepositsVisible, setRecentDepositsVisible] = useState(true);
  const [recentTransfersVisible, setRecentTransfersVisible] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [memoText, setMemoText] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const transferData = [
    { name: '김민수', date: '2024-03-27', amount: '-₩50,000', type: '송금', memo: '' },
    { name: '이영희', date: '2024-03-26', amount: '-₩120,000', type: '송금', memo: '' },
    { name: '박철수', date: '2024-03-25', amount: '-₩75,000', type: '송금', memo: '' },
  ];

  const depositData = [
    { name: '신한은행', date: '2024-03-27', amount: '+₩200,000', type: '입금', memo: '' },
    { name: '엄마', date: '2024-03-26', amount: '+₩100,000', type: '입금', memo: '' },
    { name: '국민은행', date: '2024-03-25', amount: '+₩150,000', type: '입금', memo: '' },
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Account')} style={{ marginLeft: 16 }}>
          <Ionicons name="log-in-outline" size={24} color="#4B7BE5" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('NotificationScreen')}
          style={{ marginRight: 16 }}
        >
          <Ionicons name="notifications-outline" size={24} color="#4B7BE5" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const openModal = (transaction) => {
    setSelectedTransaction(transaction);
    setMemoText(transaction.memo || '');
    setIsModalVisible(true);
    setIsEditing(false);
  };

  return (
    <LinearGradient colors={['#F8F8F8', '#ECECEC']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <LinearGradient colors={['#4B7BE5', '#6FA8DC']} style={styles.balanceCard}>
          <CustomText style={styles.balanceLabel}>잔액 레이블</CustomText>
          <CustomText style={styles.accountNumber}>계좌 번호는 개별 항목이므로 생략</CustomText>
          <CustomText style={styles.balanceAmount}>총 금액은 account list 에서 sum</CustomText>
        </LinearGradient>

        <View style={styles.actionRow}>
          <FunctionButton title="입금" icon="wallet" onPress={() => { }} size="pinned" />
          <FunctionButton title="출금" icon="send" onPress={() => { }} size="pinned" />
        </View>

        <TouchableOpacity
          onPress={() => setRecentTransfersVisible(!recentTransfersVisible)}
          style={styles.expandToggle}
        >
          <CustomText style={styles.sectionTitle}>최근 송금 내역</CustomText>
          <Ionicons
            name={recentTransfersVisible ? 'chevron-up-outline' : 'chevron-down-outline'}
            size={20}
            color="#4B7BE5"
          />
        </TouchableOpacity>

        {recentTransfersVisible && (
          <View style={styles.historyContainer}>
            {transferData.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.historyCard}
                onPress={() => openModal(item)}
              >
                <Ionicons name="person-circle-outline" size={32} color="#4B7BE5" />
                <View style={styles.historyText}>
                  <CustomText style={styles.name}>{item.name}</CustomText>
                  <CustomText style={styles.date}>{item.date}</CustomText>
                </View>
                <CustomText style={[styles.amount, { color: '#DC3545' }]}>{item.amount}</CustomText>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity
          onPress={() => setRecentDepositsVisible(!recentDepositsVisible)}
          style={styles.expandToggle}
        >
          <CustomText style={styles.sectionTitle}>최근 입금 내역</CustomText>
          <Ionicons
            name={recentDepositsVisible ? 'chevron-up-outline' : 'chevron-down-outline'}
            size={20}
            color="#4B7BE5"
          />
        </TouchableOpacity>

        {recentDepositsVisible && (
          <View style={styles.historyContainer}>
            {depositData.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.historyCard}
                onPress={() => openModal(item)}
              >
                <Ionicons name="person-circle-outline" size={32} color="#4B7BE5" />
                <View style={styles.historyText}>
                  <CustomText style={styles.name}>{item.name}</CustomText>
                  <CustomText style={styles.date}>{item.date}</CustomText>
                </View>
                <CustomText style={styles.depositAmount}>{item.amount}</CustomText>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <CustomText style={styles.modalTitle}>
              {selectedTransaction?.type} 상세 내역
            </CustomText>
            <CustomText>이름: {selectedTransaction?.name}</CustomText>
            <CustomText>날짜: {selectedTransaction?.date}</CustomText>
            <CustomText>금액: {selectedTransaction?.amount}</CustomText>

            <View style={styles.memoRow}>
              <CustomText style={{ fontWeight: 'bold' }}>메모:</CustomText>

              {!isEditing ? (
                <View style={styles.memoDisplayRow}>
                  <CustomText style={styles.memoText}>
                    {selectedTransaction?.memo ? ` ${selectedTransaction.memo}` : ' '}
                  </CustomText>
                  <TouchableOpacity onPress={() => setIsEditing(true)}>
                    <Ionicons name="create-outline" size={20} color="#4B7BE5" style={{ marginLeft: 8 }} />
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <CustomTextInput
                    value={memoText}
                    onChangeText={setMemoText}
                    placeholder="메모를 입력하세요"
                    style={styles.memoInput}
                    multiline
                  />
                  <TouchableOpacity
                    onPress={() => {
                      selectedTransaction.memo = memoText;
                      setIsEditing(false);
                      alert('메모가 저장되었습니다!');
                    }}
                    style={styles.saveButton}
                  >
                    <CustomText style={styles.saveButtonText}>저장</CustomText>
                  </TouchableOpacity>
                </>
              )}
            </View>

            <TouchableOpacity
              onPress={() => setIsModalVisible(false)}
              style={styles.modalCloseButton}
            >
              <CustomText style={styles.modalCloseText}>닫기</CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { padding: 20, alignItems: 'center' },
  balanceCard: {
    width: '90%',
    paddingVertical: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    elevation: 8,
  },
  balanceLabel: { color: 'white', marginBottom: 6 },
  balanceAmount: { color: 'white', fontWeight: 'bold' },
  accountNumber: {
    color: 'white',
    marginBottom: 6,
    textDecorationLine: 'underline',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '90%',
    marginBottom: 24,
  },
  sectionTitle: { fontWeight: 'bold', color: '#333' },
  expandToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 10,
    marginBottom: 8,
  },
  historyContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '90%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  historyText: { flex: 1, marginLeft: 12 },
  name: { fontWeight: '600', color: '#333' },
  date: { color: '#999' },
  amount: { fontWeight: 'bold' },
  depositAmount: {
    fontWeight: 'bold',
    color: '#4B7BE5',
  },
  functionButton: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  pinnedButton: { width: '36%', marginHorizontal: 8 },
  functionText: { color: '#333', marginTop: 8, fontWeight: '600' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    width: '85%',
  },
  modalTitle: {
    fontWeight: 'bold',
    color: '#4B7BE5',
    marginBottom: 12,
  },
  memoRow: {
    marginTop: 12,
  },
  memoDisplayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  memoText: {
    color: '#333',
  },
  memoInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    minHeight: 60,
    marginTop: 8,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginTop: 12,
    backgroundColor: '#4B7BE5',
    paddingVertical: 10,
    borderRadius: 8,
  },
  saveButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalCloseButton: {
    marginTop: 12,
    paddingVertical: 10,
    backgroundColor: '#ccc',
    borderRadius: 8,
  },
  modalCloseText: {
    color: '#333',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default MainScreen;
