import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { addNotification, getNotifications } from '../../database/mongoDB';
import { useUser } from '../Login/UserContext';
import CustomText from '../../components/CustomText';

export default function NotificationScreen() {
  const { userInfo } = useUser();
  const userId = userInfo?.username || 'Guest';

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const defaultNotifications = [
        { icon: 'information-circle', iconColor: '#2196F3', borderColor: '#BBDEFB', content: '새로운 보이스피싱 사례 소식을 확인해보세요.' },
        { icon: 'chatbubble-ellipses-outline', iconColor: '#AB47BC', borderColor: '#E1BEE7', content: 'AI 챗봇과 대화해보세요! 궁금한 금융 정보를 알려드려요.' },
        { icon: 'calendar-outline', iconColor: '#607D8B', borderColor: '#CFD8DC', content: '오늘 통화/문자 분석도 꼭 확인해보세요.' },
      ];

      try {
        const result = await getNotifications(userId);
        if (result.length > 0) {
          setNotifications(result);
        } else {
          setNotifications(defaultNotifications);
          for (const noti of defaultNotifications) {
            await addNotification(userId, { ...noti });
          }
        }
      } catch (err) {
        console.error('❌ 알림 처리 중 오류:', err);
        setNotifications(defaultNotifications);
      }
    };
    fetchData();
  }, [userId]);

  const dismiss = id => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <LinearGradient colors={['rgb(208, 224, 241)', 'rgb(213, 225, 236)']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {notifications.map(item => (
          <View key={item.id} style={styles.card}>
            {/* <View style={[styles.cardHeader, { borderColor: item.borderColor }]}> */}
            <View style={[styles.cardHeader]}>
              <View style={styles.left}>
                <Ionicons name={item.icon} size={24} color={item.iconColor} style={styles.icon} />
                <CustomText style={styles.cardContent}>{item.content}</CustomText>
              </View>
              <TouchableOpacity onPress={() => dismiss(item.id)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#999" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
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
});
