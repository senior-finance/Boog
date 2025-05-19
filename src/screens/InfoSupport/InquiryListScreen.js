import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomText from '../../components/CustomText';

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
    <LinearGradient colors={['rgb(208, 224, 241)', 'rgb(213, 225, 236)']} style={styles.container}>
      <CustomText style={styles.title}>📋 내 문의 내역</CustomText>

      <FlatList
        data={dummyData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.itemBox}>
            <View style={styles.row}>
              <Ionicons name="chatbubble-ellipses-outline" size={24} color="#1A4DCC" style={styles.icon} />
              <CustomText style={styles.itemTitle}>{item.title}</CustomText>
            </View>
            <CustomText style={[styles.status, item.status.includes('✅') ? styles.complete : styles.pending]}>
              {item.status}
            </CustomText>
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
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    color: '#1A4DCC',
  },
  itemBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 18,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(33, 113, 245, 0.5)',
    shadowColor: '#4B7BE5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  itemTitle: {
    fontWeight: '600',
    color: '#1A4DCC',
    flexShrink: 1,
    fontSize: 16,
    lineHeight: 22,
  },
  status: {
    fontWeight: '500',
    fontSize: 14,
    marginLeft: 32,
  },
  complete: {
    color: '#2E8B57', // 진한 초록
  },
  pending: {
    color: '#E67300', // 진한 주황
  },
});

export default InquiryListScreen;
