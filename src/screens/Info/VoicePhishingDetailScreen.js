import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const VoicePhishingDetailScreen = ({ route }) => {
  const { title, fullContent, images } = route.params;

  return (
    <LinearGradient colors={['#F8F8F8', '#F8F8F8']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        
        {/* 🔷 제목 텍스트만 (박스 제거됨) */}
        <CustomText style={styles.titleText}>📌 {title}</CustomText>

        {/* 이미지 미리보기 */}
        {images.map((img, idx) => (
          <Image key={idx} source={img} style={styles.image} resizeMode="contain" />
        ))}

        {/* 🔷 본문 박스 */}
        <View style={styles.contentBox}>
          <CustomText style={styles.contentTitle}> {title}</CustomText>
          <CustomText style={styles.content}>
            "삼가 고인의 명복을 빕니다."라는 문구와 함께 지인인 것처럼 위장한 부고 문자를 발송해, 
            수신자가 슬픔과 당황스러움 속에서 링크를 클릭하게 유도합니다.
          </CustomText>
          <CustomText style={styles.content}>
            링크를 클릭하면 <CustomText style={styles.highlight}>악성 앱이 설치</CustomText>되거나 
            <CustomText style={styles.highlight}>개인정보가 유출</CustomText>될 수 있습니다.
          </CustomText>
          <CustomText style={styles.important}>
            ✅ 출처 불명 문자에 포함된 링크는 절대 클릭하지 마세요.
          </CustomText>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  titleText: {
        fontWeight: 'bold',
    color: '#1A4DCC',
    marginBottom: 20,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 230,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
  },
  contentBox: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 3,
  },
  contentTitle: {
        fontWeight: 'bold',
    marginBottom: 14,
    color: '#333',
  },
  content: {
        color: '#333',
    lineHeight: 24,
    marginBottom: 12,
  },
  highlight: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  important: {
        marginTop: 10,
    backgroundColor: '#E8F0FE',
    padding: 10,
    borderRadius: 8,
    color: '#1A3E8D',
    fontWeight: 'bold',
  },
});

export default VoicePhishingDetailScreen;
