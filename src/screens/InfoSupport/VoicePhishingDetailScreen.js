import React from 'react';
import { View, ScrollView, Image, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '../../components/CustomText';

const VoicePhishingDetailScreen = ({ route }) => {
  const { title, fullContent, images } = route.params;

  return (
    <LinearGradient colors={['#E3F2FD', '#ffffff']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* 제목 */}
        <CustomText style={styles.titleText}>📌 {title}</CustomText>

        {/* 이미지 미리보기 */}
        {images.map((img, idx) => (
          <Image key={idx} source={img} style={styles.image} resizeMode="contain" />
        ))}

        {/* 내용 박스 */}
        <View style={styles.contentBox}>
          <CustomText style={styles.contentTitle}>{title}</CustomText>

          <CustomText style={styles.content}>
            "삼가 고인의 명복을 빕니다."라는 문구와 함께 지인인 것처럼 위장한 부고 문자를 발송해,
            수신자가 슬픔과 당황스러움 속에서 링크를 클릭하게 유도합니다.
          </CustomText>

          <CustomText style={styles.content}>
            링크를 클릭하면 <CustomText style={styles.highlight}>악성 앱이 설치</CustomText>되거나{' '}
            <CustomText style={styles.highlight}>개인정보가 유출</CustomText>될 수 있습니다.
          </CustomText>

          <CustomText style={styles.important}>
            출처 불명 문자에 포함된 링크는 절대 클릭하지 마세요.
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
    fontSize: 20,
    lineHeight: 28,
    flexWrap: 'wrap',
    includeFontPadding: false,
  },
  image: {
    width: '100%',
    height: 230,
    borderRadius: 16,
    marginBottom: 20,
    backgroundColor: '#f0f4ff',
  },
  contentBox: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(33, 113, 245, 0.6)',
    shadowColor: '#4B7BE5',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  contentTitle: {
    fontWeight: 'bold',
    marginBottom: 14,
    color: '#1A4DCC',
    fontSize: 17,
  },
  content: {
    color: '#333',
    lineHeight: 24,
    marginBottom: 12,
    flexWrap: 'wrap',
    includeFontPadding: false,
  },
  highlight: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  important: {
    marginTop: 10,
    backgroundColor: '#D9E6FF',
    padding: 12,
    borderRadius: 10,
    color: '#003C9E',
    fontWeight: 'bold',
    lineHeight: 22,
  },
});

export default VoicePhishingDetailScreen;
