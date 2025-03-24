// VoicePhishingScreen.js
import React from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Linking } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const data = [
  {
    id: '1',
    title: '📩 부고 문자 피싱',
    summary: '삼가 고인의 명복을 빕니다. 위장 문자로 링크 클릭 유도',
    image: require('../../assets/phishing1.png'),
    fullContent: `📩 부고 문자 피싱\n\n"삼가 고인의 명복을 빕니다."라는 문구와 함께 지인인 것처럼 위장한 부고 문자를 발송해, 수신자가 슬픔과 당황스러움 속에서 링크를 클릭하게 유도합니다.\n\n링크를 클릭하면 악성 앱이 설치되거나 개인정보가 유출될 수 있습니다.\n\n✅ 출처 불명 문자에 포함된 링크는 절대 클릭하지 마세요.`,
    images: [require('../../assets/phishing1.png')],
  },
  {
    id: '2',
    title: '🦠 질병 정보 문자 피싱',
    summary: '○○병 확산 뉴스로 가장해 개인정보 탈취 유도',
    image: require('../../assets/phishing2.png'),
    fullContent: `🦠 질병 정보 문자 피싱\n\n"○○병 확산! 예방수칙 확인하세요."와 같은 내용으로 사용자의 공포심을 자극하고, 가짜 뉴스 링크를 통해 악성 앱을 설치하게 하거나 금융 정보를 입력하도록 유도합니다.\n\n✅ 정부기관 사칭 문자 주의! 공식 홈페이지에서 직접 확인하세요.`,
    images: [require('../../assets/phishing2.png')],
  },
  {
    id: '3',
    title: '🔓 해킹·유출 경고 문자 피싱',
    summary: '개인정보 유출 안내로 위장해 로그인 유도',
    image: require('../../assets/phishing3.png'),
    fullContent: `🔓 해킹·유출 경고 문자 피싱\n\n"회원님의 개인정보가 유출되었습니다"라는 메시지를 보내 수신자를 불안하게 만든 뒤, 가짜 보안 페이지로 유도하여 로그인 정보, 계좌번호 등을 입력하도록 합니다.\n\n✅ 공식 사이트 직접 접속 후 확인!`,
    images: [require('../../assets/phishing3.png')],
  },
  {
    id: '4',
    title: '💰 세금/환급 문자 피싱',
    summary: '국세청 환급금 가장 문자로 계좌 탈취',
    image: require('../../assets/phishing4.png'),
    fullContent: `💰 세금/환급 문자 피싱\n\n"국세청 환급금이 있습니다" 또는 "세금 미납 내역 안내" 등의 문자를 통해 가짜 링크에 접속을 유도하고, 주민등록번호나 계좌정보를 입력하도록 합니다.\n\n✅ 국세청은 문자로 환급이나 납부 안내를 하지 않으며, 홈택스 등 공식 경로를 이용하세요.`,
    images: [require('../../assets/phishing4.png')],
  },
];

const VoicePhishingScreen = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('VoicePhishingDetail', item)}
    >
      <Image source={item.image} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.summary}>{item.summary}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#AEEEEE', '#DDA0DD']} style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.newsButton}
            onPress={() =>
              Linking.openURL('https://search.naver.com/search.naver?query=보이스피싱')
            }
          >
            <Text style={styles.newsButtonText}>📰 보이스피싱 관련 최신 뉴스 더 보러가기</Text>
          </TouchableOpacity>
        }
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 10 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  summary: { fontSize: 14, color: '#333' },
  newsButton: {
    marginTop: 20,
    marginBottom: 40,
    padding: 15,
    backgroundColor: '#ffffffcc',
    borderRadius: 12,
    alignItems: 'center',
  },
  newsButtonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default VoicePhishingScreen;
