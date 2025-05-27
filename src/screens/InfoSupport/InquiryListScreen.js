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
import { getUserInfoBySocialId } from '../../database/mongoDB';
import LottieView from 'lottie-react-native';
import loadingJson from '../../assets/loadingg.json';

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

  const [userName, setUserName] = useState('');

  useEffect(() => {
    const loadInquiries = async () => {
      try {
        let finalName = userInfo?.username || '';

        // username이 없으면 mongo에서 조회
        if (!finalName && userInfo?.socialId) {
          const userDoc = await getUserInfoBySocialId(userInfo.socialId);
          if (userDoc?.username) finalName = userDoc.username;
        }

        setUserName(finalName);

        const queryUser = finalName && finalName.trim() !== '' ? finalName.trim() : 'Guest';
        const data = await getInquiries(queryUser);
        setInquiries(data);
      } catch (error) {
        console.log('문의 내역 불러오기 오류:', error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000); // 최소 1초 유지
      }
    };

    loadInquiries();
  }, [userInfo]);

  if (loading) {
    return (
      <LinearGradient
        colors={['rgba(140, 182, 222, 0.69)', '#e0f0ff']}
        style={styles.loaderContainer}
      >
        <LottieView
          source={loadingJson}
          autoPlay
          loop
          style={{ width: 140, height: 140 }}
        />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['rgba(140, 182, 222, 0.69)', '#e0f0ff']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <CustomText style={styles.title}>
          📋 {userName || 'Guest'} 님의 문의 내역
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
    borderColor: 'rgb(57, 140, 255)',
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
