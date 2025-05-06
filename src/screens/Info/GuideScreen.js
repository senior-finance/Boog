import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import CustomText from '../../components/CustomText';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function GuideScreen() {
  const navigation = useNavigation();

  const sectionDetails = {
    home: {
      title: '📱 홈 화면',
      content: '잔액 확인, 송금, 입금, 출금 기능을 사용할 수 있어요.',
    },
    function: {
      title: '🧩 기능 탭',
      content: '퀴즈, 지도, AI 대화, 복지 기능 등을 사용할 수 있어요.',
    },
    ai: {
      title: '🧠 AI 대화',
      content: '말로 질문하면 챗봇이 기능을 안내해줘요.',
    },
    info: {
      title: '⚙️ 내 정보',
      content: '글자 크기, 음성 설정, 문의 내역 등을 확인하고 변경할 수 있어요.',
    },
  };

  const goToDetail = (sectionKey) => {
    const { title, content } = sectionDetails[sectionKey];
    navigation.navigate('GuideDetail', { title, content });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Ionicons name="book-outline" size={40} color="#4B7BE5" style={styles.icon} />
      <CustomText style={styles.title}>앱 사용법</CustomText>

      {Object.keys(sectionDetails).map((key) => (
        <View style={styles.card} key={key}>
          <CustomText style={styles.cardTitle}>{sectionDetails[key].title}</CustomText>
          <CustomText style={styles.cardDesc}>{sectionDetails[key].content}</CustomText>
          <TouchableOpacity style={styles.button} onPress={() => goToDetail(key)}>
            <CustomText style={styles.buttonText}>자세히 보기</CustomText>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F8F8F8',
  },
  icon: {
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B7BE5',
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 15,
    color: '#444',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#4B7BE5',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
