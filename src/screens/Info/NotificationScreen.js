import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '../../components/CustomText';

const NotificationScreen = () => {
  const notifications = [
    {
      id: 1,
      icon: 'checkmark-circle',
      iconColor: '#4CAF50',
      borderColor: '#C8E6C9',
      content: '[출금] 500,000원 | 계좌 123-4567-8901\n거래 시간: 2025-01-30 14:15',
    },
    {
      id: 2,
      icon: 'close-circle',
      iconColor: '#F44336',
      borderColor: '#FFCDD2',
      content: '이상 출금 감지! 최근 1시간 내 5회 출금.\n본인이 아닐 경우 즉시 고객센터로 문의하세요.',
    },
    {
      id: 3,
      icon: 'alert-circle',
      iconColor: '#FF9800',
      borderColor: '#FFE0B2',
      content: '금융사기 예방! 보이스피싱 주의하세요.\n의심 거래 발생 시 즉시 고객센터로 문의하세요.',
    },
    {
      id: 4,
      icon: 'calendar',
      iconColor: '#9E9E9E',
      borderColor: '#E0E0E0',
      content: '내일(1월 30일)은, 50,000원이 출금되는 날 입니다',
    },
    {
      id: 5,
      icon: 'information-circle',
      iconColor: '#03A9F4',
      borderColor: '#B3E5FC',
      content: '현재 받을 수 있는 노인 연금 혜택이 있습니다.\n신청하시겠습니까?',
    },
    {
      id: 6,
      icon: 'cash-outline',
      iconColor: '#4CAF50',
      borderColor: '#DCEDC8',
      content: '[입금] 1,000,000원 | 계좌 987-6543-2100\n거래 시간: 2025-01-31 09:30',
    },
    {
      id: 7,
      icon: 'warning-outline',
      iconColor: '#FFC107',
      borderColor: '#FFF9C4',
      content: '고위험 국가에서 로그인 시도가 감지되었습니다.\n보안을 위해 비밀번호를 변경하세요.',
    },
    {
      id: 8,
      icon: 'chatbubble-ellipses-outline',
      iconColor: '#AB47BC',
      borderColor: '#E1BEE7',
      content: '챗봇 상담을 통해 새로운 혜택 정보를 확인하세요!',
    },
    {
      id: 9,
      icon: 'cloud-download-outline',
      iconColor: '#29B6F6',
      borderColor: '#B3E5FC',
      content: '전자 명세서가 도착했습니다.\n앱 내에서 확인 가능합니다.',
    },
    {
      id: 10,
      icon: 'gift-outline',
      iconColor: '#EF5350',
      borderColor: '#FFCDD2',
      content: '생일 축하합니다! 특별 금융 혜택이 준비되어 있습니다 🎉',
    },
  ];

  return (
    <LinearGradient colors={['#F8F8F8', '#ECECEC']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {notifications.map((item) => (
          <View key={item.id} style={[styles.card, { borderColor: item.borderColor }]}>
            <View style={styles.cardHeader}>
              <Ionicons name={item.icon} size={22} color={item.iconColor} style={styles.icon} />
              <CustomText style={styles.cardContent}>{item.content}</CustomText>
            </View>
          </View>
        ))}
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
  },
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  icon: {
    marginRight: 10,
    marginTop: 3,
  },
  cardContent: {
    flex: 1,
   
    fontWeight: '500',
    color: '#333',
    lineHeight: 23,
  },
});

export default NotificationScreen;
