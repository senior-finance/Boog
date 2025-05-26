import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
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
    const d = new Date(date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${day} ${hh}:${mm}`;
  }

  useEffect(() => {
    const loadInquiries = async () => {
      try {
        const rawUser = userInfo?.username;
        const queryUser = rawUser && rawUser.trim() !== '' ? rawUser.trim() : 'Guest';
        const data = await getInquiries(queryUser);
        setInquiries(data);
      } catch (error) {
        console.log('문의 내역 불러오기 오류:', error);
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
      colors={['rgba(140, 182, 222, 0.69)', '#e0f0ff']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <CustomText style={styles.title}>
          📋 {inquiries[0]?.userName || ''} 님의 문의 내역
        </CustomText>

        {inquiries.length === 0 ? (
          <CustomText style={styles.emptyText}>문의 내역이 없습니다.</CustomText>
        ) : (
          inquiries.map((item) => (
            <View key={item.id} style={styles.cardWrapper}>
              <LinearGradient
                colors={['#ffffff', '#d6eaff']}
                style={styles.listCard}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
              >
                <View style={styles.rowWrap}>
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={24}
                    color="#1446D8"
                    style={styles.icon}
                  />
                  <View style={{ flex: 1 }}>
                    <CustomText style={styles.cardTitle}>제목: {item.title}</CustomText>
                    <CustomText style={styles.cardContent}>내용: {item.content}</CustomText>
                    <CustomText style={styles.dateText}>
                      {item.createdAt ? formatDate(item.createdAt) : ''}
                    </CustomText>
                  </View>
                </View>
              </LinearGradient>
            </View>
          ))
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 80 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: {
    fontWeight: '900',
    color: '#1446D8',

    textAlign: 'center',
    marginBottom: 20,
  },
  cardWrapper: {
    marginBottom: 20,
    borderRadius: 20,
  },
  listCard: {
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,

    borderWidth: 1.5,
    borderColor: 'rgba(21, 70, 216, 0.24)',
  },
  rowWrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  icon: {
    marginRight: 12,
    marginTop: 3,
  },
  cardTitle: {
    fontWeight: '600',

    color: 'rgb(39, 39, 39)',
    marginBottom: 6,
  },
  cardContent: {

    color: 'rgb(70, 70, 70)',
    marginBottom: 6,
  },
  dateText: {

    color: '#666',
    textAlign: 'right',
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 40,
  },
});

export default InquiryListScreen;
