// src/screens/Info/InquiryListScreen.js
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const InquiryListScreen = () => {
  const dummyData = [
    { id: '1', title: '송금이 안 돼요', status: '답변 완료' },
    { id: '2', title: '비밀번호 변경 방법', status: '처리 중' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>내 문의 내역</Text>

      <FlatList
        data={dummyData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.box}>
            <Text style={styles.text}>제목: {item.title}</Text>
            <Text style={styles.status}>상태: {item.status}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  box: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    marginBottom: 4,
  },
  status: {
    fontSize: 15,
    color: '#333',
  },
});

export default InquiryListScreen;
