// VoicePhishingScreen.js
import React from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Linking } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '../../components/CustomText';

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
  {
    id: '5',
    title: '📦 물품 결제 문자 피싱',
    summary: '결제 완료 문구로 놀라게 하여 전화 유도',
    image: require('../../assets/phishing5.png'),
    fullContent: `📦 물품 결제 문자 피싱\n\n"에어컨 416,000원 정상처리완료"처럼 사용자가 결제하지 않은 상품에 대해 결제가 완료되었다는 문자를 보내 수신자를 놀라게 만듭니다.\n\n이후 문구 하단에 있는 고객센터 번호로 전화를 유도하여, 개인 정보를 요구하거나 원격 제어 앱 설치를 시도합니다.\n\n✅ 절대 문자 속 번호로 전화하지 마시고, 카드사 또는 쇼핑몰 공식 앱/사이트에서 먼저 확인하세요.`,
    images: [require('../../assets/phishing5.png')],
  },
  {
    id: '6',
    title: '💸 정부지원 대출 문자 피싱',
    summary: '정부 정책인 것처럼 속여 앱 설치 유도',
    image: require('../../assets/phishing6.png'),
    fullContent: `💸 정부지원 대출 문자 피싱\n\n"[정부지원 대환대출] 간편대출 신청"이라는 문구로, 실제 정부 정책인 것처럼 위장합니다.\n\n'본인인증 PIN'이나 '앱 다운로드'라는 표현으로 수신자를 속여, 악성 앱 설치나 개인정보 입력을 유도합니다.\n\n이후 피해자는 원격 제어, 계좌 이체, 사칭 상담 등을 당할 수 있습니다.\n\n✅ 정부기관은 문자로 앱 설치를 유도하지 않으며, 출처가 불분명한 링크는 클릭하지 마세요.`,
    images: [require('../../assets/phishing6.png')],
  },
  {
    id: '7',
    title: '👪 가족 사칭 보이스피싱',
    summary: '엄마/자녀 등 가족인 척 접근해 앱 설치 유도',
    image: require('../../assets/phishing7.png'),
    fullContent: `👪 가족 사칭 보이스피싱\n\n"엄마 메시지 받은 거 없어?"처럼 가족이나 지인을 사칭해 접근합니다.\n\n대화를 통해 피해자의 신뢰를 얻은 뒤, "앱 설치해줘", "여기 링크 클릭해서 신청해줘" 등의 메시지로 유도합니다.\n\n보낸 링크는 보통 원격제어 앱(TeamViewer, AnyDesk 등)으로, 설치 시 피해자의 기기를 통째로 조작할 수 있게 됩니다.\n\n✅ 가족에게 먼저 전화 확인 필수! 낯선 링크나 앱 설치 요청은 무조건 의심하세요.`,
    images: [require('../../assets/phishing7.png')],
  }
];

const VoicePhishingScreen = ({ navigation }) => {
 const renderItem = ({ item }) => (
    <LinearGradient colors={['#f8fbff', '#f0f6ff']} style={styles.card}>
      {/* 왼쪽 이미지 */}
      <Image source={item.image} style={styles.image} />

      {/* 오른쪽 텍스트 */}
      <View style={styles.content}>
        <CustomText style={styles.title} numberOfLines={1}>
          {item.title}
        </CustomText>
        <CustomText style={styles.summary} numberOfLines={2}>
          {item.summary}
        </CustomText>

        {/* 파란 버튼 */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('VoicePhishingDetail', item)}
        >
          <CustomText style={styles.buttonText}>자세히</CustomText>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0f0ff',
  },
  list: {
    padding: 16,
    paddingBottom: 40,
  },
card: {
  flexDirection: 'row',
  backgroundColor: '#ffffff',
  borderRadius: 20,
  padding: 12,
  marginBottom: 16,
  alignItems: 'center',
  borderWidth: 1.5,
  borderColor: '#1A4DCC',

  // ✅ 그림자는 선택 (지우고 싶으면 아래 4줄 삭제)
  shadowColor: '#c0d9ff',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 6,
  elevation: 4,
},

  image: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
   
    fontWeight: 'bold',
    color: '#1A4DCC',
    marginBottom: 4,
  },
  summary: {
    
    color: '#555',
    marginBottom: 8,
  },
  button: {
    backgroundColor: 'rgb(45, 115, 208)',
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 20,
    alignSelf: 'flex-start',

},

 
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
   
  },
});
export default VoicePhishingScreen;