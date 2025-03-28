import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

// 공통 기능 버튼
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
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginRight: 16 }}>
          <Ionicons name="log-in-outline" size={24} color="#4B7BE5" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <LinearGradient colors={['#F8F8F8', '#ECECEC']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* 잔액 카드 */}
        <LinearGradient colors={['#4B7BE5', '#6FA8DC']} style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>잔액</Text>
          <Text style={styles.balanceAmount}>123,456,789원</Text>
        </LinearGradient>

        {/* 송금/입금/출금 버튼 */}
        <View style={styles.actionRow}>
        
          <FunctionButton
            title="입금"
            icon="wallet"
            onPress={() => navigation.navigate('DepositScreen')}
            size="pinned"
          />
          <FunctionButton
            title="출금"
            icon="send"
            onPress={() => navigation.navigate('WithdrawScreen')}
            size="pinned"
          />
        </View>

        {/* 최근 송금 내역 섹션 */}
        <Text style={styles.sectionTitle}>최근 송금 내역</Text>
        <View style={styles.historyContainer}>
          <View style={styles.historyCard}>
            <Ionicons name="person-circle-outline" size={32} color="#4B7BE5" />
            <View style={styles.historyText}>
              <Text style={styles.name}>김민수</Text>
              <Text style={styles.date}>2024-03-27</Text>
            </View>
            <Text style={styles.amount}>₩50,000</Text>
          </View>
          <View style={styles.historyCard}>
            <Ionicons name="person-circle-outline" size={32} color="#4B7BE5" />
            <View style={styles.historyText}>
              <Text style={styles.name}>이영희</Text>
              <Text style={styles.date}>2024-03-26</Text>
            </View>
            <Text style={styles.amount}>₩120,000</Text>
          </View>
          <View style={styles.historyCard}>
            <Ionicons name="person-circle-outline" size={32} color="#4B7BE5" />
            <View style={styles.historyText}>
              <Text style={styles.name}>박철수</Text>
              <Text style={styles.date}>2024-03-25</Text>
            </View>
            <Text style={styles.amount}>₩75,000</Text>
          </View>
          <View style={styles.historyCard}>
            <Ionicons name="person-circle-outline" size={32} color="#4B7BE5" />
            <View style={styles.historyText}>
              <Text style={styles.name}>정하늘</Text>
              <Text style={styles.date}>2024-03-24</Text>
            </View>
            <Text style={styles.amount}>₩33,000</Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    alignItems: 'center',
  },
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
  balanceLabel: {
    color: 'white',
    fontSize: 18,
    marginBottom: 6,
  },
  balanceAmount: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    marginBottom: 24,
  },
  sectionTitle: {
    alignSelf: 'flex-start',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    marginTop: 10,
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
  historyText: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  date: {
    fontSize: 13,
    color: '#999',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4B7BE5',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '90%',
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
  pinnedButton: {
    width: '36%',
    marginHorizontal: 8,
  },
  functionText: {
    fontSize: 16,
    color: '#333',
    marginTop: 8,
    fontWeight: '600',
  },
});

export default MainScreen;
