import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  UIManager,
  LayoutAnimation,
  Platform,
  SectionList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { addNotification, getNotifications } from '../../database/mongoDB';
import { useUser } from '../Login/UserContext';
import CustomText from '../../components/CustomText';
import dayjs from 'dayjs';

export default function NotificationScreen() {
  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const { userInfo } = useUser();
  const userId = userInfo?.username || 'Guest';
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getNotifications(userId);
        const formattedResult = result.map(item => ({
          id: item._id.toString(),
          // 각 알림마다 개별 애니메이션 값 추가 (X 이동 + 투명도)
          translateX: new Animated.Value(0),
          opacity: new Animated.Value(1),
          ...item,
        }));
        setNotifications(formattedResult);
      } catch (err) {
        console.log('알림 처리 중 오류:', err);
        setNotifications([]);
      }
    };
    fetchData();
  }, [userId]);

  const getCategory = dateStr => {
    const today = dayjs().startOf('day');
    const target = dayjs(dateStr).startOf('day');
    const diff = today.diff(target, 'day');
    if (diff === 0) return '오늘';
    if (diff === 1) return '어제';
    if (diff < 7) return '최근 일주일';
    return '오래 전';
  };

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
    const target = notifications.find(n => n.id === id);
    if (!target) return;

    // 애니메이션 시작: 오른쪽으로 슬라이드 + 사라지기
    Animated.parallel([
      Animated.timing(target.translateX, {
        toValue: 500, // → X축으로 이동
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(target.opacity, {
        toValue: 0, // → 점점 투명해짐
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // 애니메이션 완료 후 상태에서 제거 (그리고 나머지 알림 부드럽게 이동)
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setNotifications(prev => prev.filter(n => n.id !== id));
    });
  };

  // 전체 삭제 함수
  const clearAll = () => {
    const animations = notifications.map(n =>
      Animated.parallel([
        Animated.timing(n.translateX, {
          toValue: 500,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(n.opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ])
    );
    Animated.stagger(50, animations).start(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setNotifications([]);
    });
  };

  return (
    <LinearGradient colors={['rgb(208, 224, 241)', 'rgb(213, 225, 236)']} style={styles.container}>
      {/* 상단 우측 모두 지우기 버튼 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={clearAll} style={styles.clearAllButton}>
          <CustomText style={styles.clearAllText}>모두 지우기</CustomText>
        </TouchableOpacity>
      </View>
      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.scrollContainer}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <CustomText style={styles.emptyText}>보여줄 알림이 존재하지 않아요</CustomText>
          </View>
        )}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionTitle}>{section.title}</Text>
        )}
        renderItem={({ item }) => (
          // 알림 카드 렌더링: Animated.View 사용하여 부드럽게 제거
          <Animated.View
            style={[
              styles.card,
              {
                transform: [{ translateX: item.translateX }],
                opacity: item.opacity,
              },
            ]}
          >
            <View style={styles.cardHeader}>
              <View style={styles.left}>
                <Ionicons name={item.icon} size={24} color={item.iconColor} style={styles.icon} />
                <CustomText style={styles.cardContent}>{item.content}</CustomText>
              </View>
              {/* 닫기 버튼 */}
              <TouchableOpacity onPress={() => dismiss(item.id)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#999" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { padding: 20, paddingBottom: 40 },
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
  },
  left: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  icon: { marginRight: 10, marginTop: 3 },
  cardContent: { flex: 1, color: '#1A4DCC', fontWeight: '500', fontSize: 20, lineHeight: 24 },
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
    fontSize: +24,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  clearAllButton: {
    padding: 8,
  },
  clearAllText: {
    fontSize: +20,
    fontWeight: '600',
    color: '#1A4DCC',
  },
});
