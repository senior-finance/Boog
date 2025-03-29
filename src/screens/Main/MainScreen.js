import React, { useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

const FunctionButton = ({ title, onPress, icon, size = 'large' }) => (
  <TouchableOpacity
    style={[styles.functionButton, size === 'pinned' && styles.pinnedButton]}
    onPress={onPress}
  >
    <Ionicons name={icon} size={32} color="#4B7BE5" />
    <Text style={styles.functionText}>{title}</Text>
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
    setIsEditing(false); // 모달 열 때는 편집모드 꺼진 상태
  };

  return (
    <LinearGradient colors={['#F8F8F8', '#ECECEC']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* 잔액 카드 */}
        <LinearGradient colors={['#4B7BE5', '#6FA8DC']} style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>잔액</Text>
          <Text style={styles.balanceAmount}>123,456,789원</Text>
        </LinearGradient>

        {/* 입금/출금 버튼 */}
        <View style={styles.actionRow}>
          <FunctionButton title="입금" icon="wallet" onPress={() => { }} size="pinned" />
          <FunctionButton title="출금" icon="send" onPress={() => { }} size="pinned" />
        </View>

        {/* 송금 내역 */}
        <TouchableOpacity
          onPress={() => setRecentTransfersVisible(!recentTransfersVisible)}
          style={styles.expandToggle}
        >
          <Text style={styles.sectionTitle}>최근 송금 내역</Text>
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
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.date}>{item.date}</Text>
                </View>
                <Text style={[styles.amount, { color: '#DC3545' }]}>{item.amount}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* 입금 내역 */}
        <TouchableOpacity
          onPress={() => setRecentDepositsVisible(!recentDepositsVisible)}
          style={styles.expandToggle}
        >
          <Text style={styles.sectionTitle}>최근 입금 내역</Text>
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
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.date}>{item.date}</Text>
                </View>
                <Text style={styles.depositAmount}>{item.amount}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* 상세 모달 */}
      <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedTransaction?.type} 상세 내역</Text>
            <Text>이름: {selectedTransaction?.name}</Text>
            <Text>날짜: {selectedTransaction?.date}</Text>
            <Text>금액: {selectedTransaction?.amount}</Text>

            {/* 메모 영역 */}
            <View style={styles.memoRow}>
              <Text style={{ fontWeight: 'bold' }}>메모:</Text>

              {!isEditing ? (
                <View style={styles.memoDisplayRow}>
                  <Text style={styles.memoText}>
                    {selectedTransaction?.memo ? ` ${selectedTransaction.memo}` : ' '}
                  </Text>
                  <TouchableOpacity onPress={() => setIsEditing(true)}>
                    <Ionicons name="create-outline" size={20} color="#4B7BE5" style={{ marginLeft: 8 }} />
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <TextInput
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
                    <Text style={styles.saveButtonText}>저장</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>

            <TouchableOpacity
              onPress={() => setIsModalVisible(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseText}>닫기</Text>
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
  balanceLabel: { color: 'white', fontSize: 18, marginBottom: 6 },
  balanceAmount: { color: 'white', fontSize: 28, fontWeight: 'bold' },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '90%',
    marginBottom: 24,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
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
  name: { fontSize: 16, fontWeight: '600', color: '#333' },
  date: { fontSize: 13, color: '#999' },
  amount: { fontSize: 16, fontWeight: 'bold' },
  depositAmount: {
    fontSize: 16,
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
  functionText: { fontSize: 16, color: '#333', marginTop: 8, fontWeight: '600' },

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
    fontSize: 20,
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
    fontSize: 15,
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
