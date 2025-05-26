import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomText from '../../components/CustomText';
import { useUser } from '../Login/UserContext';
import { getInquiries } from './Inquiry';

const InquiryListScreen = () => {
  const { userInfo } = useUser();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  function formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${d} ${hh}:${mm}`;
  }

  useEffect(() => {
    const loadInquiries = async () => {
      try {
        // userName이 없거나 빈 문자열(공백)인 경우 'Guest'로 처리
        const rawUser = userInfo?.username;
        const queryUser = rawUser && rawUser.trim() !== '' ? rawUser.trim() : 'Guest';

        console.log('[InquiryList] Loading inquiries for:', queryUser);
        const data = await getInquiries(queryUser);
        setInquiries(data);
      } catch (error) {
        console.error('문의 내역 불러오기 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInquiries();
  }, [userInfo]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1A4DCC" />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['rgb(208, 224, 241)', 'rgb(213, 225, 236)']}
      style={styles.container}
    >
      {/* <CustomText style={styles.title}>📋 {item.userName} 님의 문의 내역</CustomText> */}
      <FlatList
        data={inquiries}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}

        // 헤더로 userName 표시
        ListHeaderComponent={() => (
          <CustomText style={styles.title}>
            📋 {inquiries[0]?.userName || ''} 님의 문의 내역
          </CustomText>
        )}
        renderItem={({ item }) => (
          <View style={styles.itemBox}>
            <CustomText style={styles.date}>
              {item.createdAt
                ? formatDate(item.createdAt)
                : ''}
            </CustomText>
            <View style={styles.row}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={24}
                color="#1A4DCC"
                style={styles.icon}
              />
              <CustomText style={styles.itemTitle}>제목 : {item.title}</CustomText>
            </View>
            <CustomText style={styles.content}>내용 : {item.content}</CustomText>
          </View>
        )}
        ListEmptyComponent={
          <CustomText style={styles.emptyText}>문의 내역이 없습니다.</CustomText>
        }
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#1A4DCC' },
  listContainer: { paddingBottom: 16 },
  itemBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  icon: { marginRight: 8 },
  itemTitle: { fontSize: +24, fontWeight: '600' },
  userName: { fontSize: 14, color: '#555', marginBottom: 4 },
  content: { fontSize: +20, color: '#333' },
  emptyText: { textAlign: 'center', fontSize: 16, color: '#888', marginTop: 32 },
  date: { fontSize: +20, color: '#888', textAlign: 'right', },
});

export default InquiryListScreen;
