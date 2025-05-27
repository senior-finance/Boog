import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { addNotification, getNotifications } from '../../database/mongoDB';
import { useUser } from '../Login/UserContext';
import CustomText from '../../components/CustomText';
import { SectionList } from 'react-native';
import dayjs from 'dayjs';

export default function NotificationScreen() {
  const { userInfo } = useUser();
  const userId = userInfo?.username || 'Guest';

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getNotifications(userId);
        const formattedResult = result.map(item => ({
          id: item._id.toString(),
          ...item,
        }));
        setNotifications(formattedResult);
      } catch (err) {
        console.log('알림 처리 중 오류:', err);
        setNotifications([]); // 오류 발생 시 빈 상태 처리
      }
    };
    fetchData();
  }, [userId]);

  // “오늘/어제/최근 일주일/오래 전” 구분 함수
  const getCategory = dateStr => {
    const today = dayjs().startOf('day');
    const target = dayjs(dateStr).startOf('day');
    const diff = today.diff(target, 'day');
    if (diff === 0) return '오늘';
    if (diff === 1) return '어제';
    if (diff < 7) return '최근 일주일';
    return '오래 전';
  };

  // notifications 상태 변경 후 useMemo로 섹션 데이터 생성
  const sections = useMemo(() => {
    const grouped = notifications.reduce((acc, n) => {
      const cat = getCategory(n.createdAt);
      (acc[cat] = acc[cat] || []).push(n);
      return acc;
    }, {});
    const order = ['오늘', '어제', '최근 일주일', '오래 전'];
    return order
      .filter(title => grouped[title]?.length)
      .map(title => ({ title, data: grouped[title] }));
  }, [notifications]);
  const dismiss = id => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <LinearGradient colors={['rgb(208, 224, 241)', 'rgb(213, 225, 236)']} style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.scrollContainer}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <CustomText style={styles.title}>알림이 존재하지 않습니다.</CustomText>
          </View>
        )}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionTitle}>{section.title}</Text>
        )}
        renderItem={({ item }) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.left}>
                <Ionicons name={item.icon} size={24} color={item.iconColor} style={styles.icon} />
                <CustomText style={styles.cardContent}>{item.content}</CustomText>
              </View>
              <TouchableOpacity onPress={() => dismiss(item.id)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#999" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { padding: 24, paddingBottom: 40 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 2,
    paddingVertical: 20,
    paddingHorizontal: 18,
    marginBottom: 20,
    borderColor: 'rgba(33, 113, 245, 0.5)',
    shadowColor: '#4B7BE5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    // borderLeftWidth: 4,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  icon: { marginRight: 10, marginTop: 3 },
  cardContent: { flex: 1, color: '#1A4DCC', fontWeight: '500', fontSize: +20, lineHeight: 24 },
  closeButton: { padding: 4 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: +36,
    color: '#666',
  },
});
