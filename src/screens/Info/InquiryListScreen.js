import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

const InquiryListScreen = () => {
  const dummyData = [
    { id: '1', title: '송금이 안 돼요', status: '✅ 답변 완료' },
    { id: '2', title: '비밀번호 변경 방법', status: '⏳ 처리 중' },
    { id: '3', title: '앱이 자꾸 꺼져요', status: '⏳ 처리 중' },
    { id: '4', title: '계좌 등록은 어디서 하나요?', status: '✅ 답변 완료' },
    { id: '5', title: '글씨 너무 작아요', status: '✅ 답변 완료' },
    { id: '6', title: '로그인이 안 돼요', status: '⏳ 처리 중' },
    { id: '7', title: '앱 속도가 느려요', status: '⏳ 처리 중' },
    { id: '8', title: '오타가 있어요', status: '✅ 답변 완료' },
    { id: '9', title: '아이콘이 헷갈려요', status: '⏳ 처리 중' },
    { id: '10', title: '문의는 어디서 하나요?', status: '✅ 답변 완료' },
  ];

  return (
    <LinearGradient colors={['#F8F8F8', '#ECECEC']} style={styles.container}>
      <Text style={styles.title}>📋 내 문의 내역</Text>

      <FlatList
        data={dummyData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.itemBox}>
            <View style={styles.row}>
              <Ionicons name="chatbubble-ellipses-outline" size={24} color="#4B7BE5" style={styles.icon} />
              <Text style={styles.itemTitle}>{item.title}</Text>
            </View>
            <Text style={styles.status}>{item.status}</Text>
          </View>
        )}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  listContainer: {
    paddingTop: 10,
    paddingBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  itemBox: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  icon: {
    marginRight: 8,
  },
  itemTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
  },
  status: {
    fontSize: 15,
    color: '#4B7BE5',
    fontWeight: '500',
    marginLeft: 32,
  },
});

export default InquiryListScreen;
