import React, { useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

// 기능 버튼 공통 컴포넌트
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
  // 상단 로그인 아이콘 설정
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
          <Text style={styles.balanceAmount}>₩123,456,789</Text>
        </LinearGradient>

        {/* 송금/입금/출금 버튼 */}
        <View style={styles.actionRow}>
          {/* <FunctionButton
            title="송금"
            icon="send"
            onPress={() => console.log('송금')}
            size="pinned"
          /> */}
          <FunctionButton
            title="입금"
            icon="wallet"
            onPress={() => console.log('입금')}
            size="pinned"
          />
          <FunctionButton
            title="출금"
            icon="cash-outline"
            onPress={() => console.log('출금')}
            size="pinned"
          />
        </View>

        {/* 기능 버튼 6개 */}
        <View style={styles.gridContainer}>
          <FunctionButton
            title="퀴즈"
            icon="school"
            onPress={() => navigation.navigate('Learning')}
          />
          <FunctionButton
            title="지도"
            icon="map"
            onPress={() => navigation.navigate('MapView')}
          />
          <FunctionButton
            title="검색"
            icon="search"
            onPress={() => navigation.navigate('MapSearch')}
          />
          <FunctionButton
            title="프로필"
            icon="person"
            onPress={() => navigation.navigate('MyInfo')}
          />
          <FunctionButton
            title="AI 대화"
            icon="mic"
            onPress={() => navigation.navigate('VoiceInput')}
          />
          <FunctionButton
            title="지문 인증"
            icon="finger-print"
            onPress={() => navigation.navigate('Biometric')}
          />
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
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  balanceCard: {
    width: '90%',
    paddingVertical: 24,
    borderRadius: 16,
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
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 24,
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
    width: '48%',
  },
  functionText: {
    fontSize: 16,
    color: '#333',
    marginTop: 8,
    fontWeight: '600',
  },
});

export default MainScreen;
