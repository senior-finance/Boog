import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addNotification, getNotifications } from '../../database/mongoDB'; // 🔥 정확한 경로

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const userId = await AsyncStorage.getItem('userId') || 'test-user';
      console.log('👤 userId:', userId);

      const defaultNotifications = [
        {
          icon: 'information-circle',
          iconColor: '#2196F3',
          borderColor: '#BBDEFB',
          content: '새로운 보이스피싱 사례 소식을 확인해보세요.',
        },
        {
          icon: 'chatbubble-ellipses-outline',
          iconColor: '#AB47BC',
          borderColor: '#E1BEE7',
          content: 'AI 챗봇과 대화해보세요! 궁금한 금융 정보를 알려드려요.',
        },
        {
          icon: 'calendar-outline',
          iconColor: '#607D8B',
          borderColor: '#CFD8DC',
          content: '오늘 통화/문자 분석도 꼭 확인해보세요.',
        },
      ];

      try {
        const result = await getNotifications(userId);
        console.log('📥 가져온 알림 수:', result.length);

        if (result.length > 0) {
          setNotifications(result);
        } else {
          setNotifications(defaultNotifications);
          for (const noti of defaultNotifications) {
            console.log('🚀 저장 시도:', noti.content);
            await addNotification(userId, noti.icon, noti.iconColor, noti.borderColor, noti.content);
            console.log('✅ 저장 완료:', noti.content);
          }
        }
      } catch (err) {
        console.error('❌ 알림 처리 중 오류:', err);
        setNotifications(defaultNotifications);
      }
    };

    fetchData();
  }, []);

  return (
    <LinearGradient colors={['#F8F8F8', '#ECECEC']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {notifications.map((item, index) => (
          <View key={index} style={[styles.card, { borderColor: item.borderColor }]}>
            <View style={styles.cardHeader}>
              <Ionicons name={item.icon} size={22} color={item.iconColor} style={styles.icon} />
              <Text style={styles.cardContent}>{item.content}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { padding: 20 },
  card: {
    borderWidth: 1.5,
    borderRadius: 14,
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  icon: { marginRight: 10, marginTop: 3 },
  cardContent: { flex: 1, fontWeight: '500', color: '#333', lineHeight: 23 },
});
