import React from 'react';
import { ScrollView, StyleSheet, View, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '../../components/CustomText';

// ✅ 이미지 import
import quiz1 from '../../assets/guide/quiz1.png';
import quiz2 from '../../assets/guide/quiz2.png';
import ai1 from '../../assets/guide/ai1.png';
import ai2 from '../../assets/guide/ai2.png';
import ai3 from '../../assets/guide/ai3.png';
import ai4 from '../../assets/guide/ai4.png';
import map1 from '../../assets/guide/map1.png';
import map2 from '../../assets/guide/map2.png';
import map3 from '../../assets/guide/map3.png';
import map4 from '../../assets/guide/map4.png';
import map5 from '../../assets/guide/map5.png';
import map6 from '../../assets/guide/map6.png';
import voicephishing1 from '../../assets/guide/voicephishing1.png';
import voicephishing2 from '../../assets/guide/voicephishing2.png';
import voicephishing3 from '../../assets/guide/voicephishing3.png';
import voicephishing4 from '../../assets/guide/voicephishing4.png';
import welfare1 from '../../assets/guide/welfare1.png';
import welfare2 from '../../assets/guide/welfare2.png';
import welfare3 from '../../assets/guide/welfare3.png';
import analysis1 from '../../assets/guide/analysis1.png';
import analysis2 from '../../assets/guide/analysis2.png';
import analysis3 from '../../assets/guide/analysis3.png';
import analysis4 from '../../assets/guide/analysis4.png';
import myinfo1 from '../../assets/guide/myinfo1.png';
import myinfo2 from '../../assets/guide/myinfo2.png';
import myinfo3 from '../../assets/guide/myinfo3.png';

export default function GuideDetailScreen({ route }) {
  const title = route?.params?.title || '기능 설명';
  const sectionKey = route?.params?.key || '';

  const guideSteps = {
    deposit: [
      '1. 입금할 은행을 선택해 주세요.',
      '2. 계좌번호를 정확히 입력해 주세요.',
      '3. 입금할 금액을 입력하고 확인 버튼을 누르면 입금 연습이 완료돼요.',
    ],
    ai: [
      {
        text: '1. 홈 화면의 스마트 기능 영역에서 AI 챗봇 버튼을 눌러 대화를 시작해요.',
        image: ai1,
      },
      {
        text: '2. AI 챗봇이 다양한 질문 키워드들을 보여줘요. 원하는 키워드를 선택하세요.',
        image: ai2,
      },
      {
        text: '3. 버튼 외에도 자유롭게 질문을 입력해도 챗봇이 답변해줘요.',
        image: ai3,
      },
      {
        text: '4. 화면 하단에 챗봇 말풍선 버튼이 항상 나와있어서, 클릭하면 언제든지 궁금한 점을 물어볼 수 있어요. 버튼은 자유롭게 이동할 수 있어 원하는 위치에 배치할 수 있어요.',
        image: ai4,
      },
    ],

    voicePhishing: [
      { text: '1. 메인 화면의 스마트 기능 영역에서서 "보이스 피싱" 버튼을 눌러 보이스피싱 사례 안내 화면으로 이동해요.', image: voicephishing1 },
      { text: '2. 다양한 보이스피싱 사례들이 실제 문자 예시와 함께 설명이 제공돼요. 자세한 설명을 보고싶으면 자세히 버튼을 눌러주세요.', image: voicephishing2 },
      { text: '3. 해당 사례의 본문과 주의사항을 자세히 볼 수 있어요.', image: voicephishing3 },
      { text: '4. 하단의 버튼을 누르면 네이버에서 보이스피싱 관련 최신 뉴스를 확인할 수 있어요.', image: voicephishing4 },
    ],
    location: [
      {
        text: '1. 홈 화면에서 "지도" 버튼을 눌러 근처 은행/ATM 검색 화면으로 이동해요.',
        image: map1,
      },
      {
        text: '2. 첫 화면에서는 가장 가까운 은행들이 화면에 나타나요.',
        image: map2,
      },
      {
        text: '3. 원하는 은행을 선택하고 검색 버튼을 눌러 해당 은행만 검색할 수도 있어요.',
        image: map3,
      },
      {
        text: '4. 지도 하단 목록에서 지점의 상세 주소와 거리 정보가 표시돼요.',
        image: map4,
      },
      {
        text: '5. 선택한 지점으로 길 안내를 원하면 "길찾기" 버튼을 눌러주세요.',
        image: map5,
      },
      {
        text: '6. "확인"을 누르면 길찾기가 시작돼요.',
        image: map6,
      },
    ],

    accessibility: [
      { text: '1. 내 정보 화면에서는 프로필 사진을 변경하거나, 글자와 음향 크기를 설정할 수 있고 자주 묻는 질문도 확인 할 수 있어요.', image: myinfo1 },
      { text: '2. "1:1 문의하기" 버튼을 눌러 궁금한 점이나 불편사항을 직접 보낼 수 있어요.', image: myinfo2 },
      { text: '3. 문의 제목과 내용을 입력한 후 "문의 보내기" 버튼을 누르면 문의가 접수돼요.', image: myinfo3 },
    ],
    quiz: [
      {
        text: '1. 메인 화면에서 퀴즈 버튼을 누르면 금융 학습 화면으로 이동할 수 있어요.',
        image: quiz1,
      },
      {
        text: '2. "금융 용어 학습하기"나 "입금 연습하기" 중 원하는 기능을 눌러 자유롭게 이용해 보세요.',
        image: quiz2,
      },


    ],
    welfare: [
      { text: '1. 메인 화면에서 "복지혜택" 버튼을 누르면 어르신들을 위한 다양한 혜택을 한눈에 확인할 수 있어요.', image: welfare1 },
      { text: '2. 연금, 건강검진, 장기요양보험 등 원하는 항목을 선택하면 상세 안내를 볼 수 있어요.', image: welfare2 },
      { text: '3. "자세히 보기" 버튼을 누르면 관련 기관의 공식 웹사이트로 연결돼요.', image: welfare3 },
    ],
    analysis: [
      {
        text: '1. 메인인 화면의 스마트 기능 영역에서 "통화·문자" 버튼을 눌러 자동 분석 화면으로 이동해요.',
        image: analysis1,
      },
      {
        text: '2. "오늘 기록 스캔하기" 버튼을 누르면 오늘 받은 문자와 통화 기록을 분석해요.',
        image: analysis2,
      },
      {
        text: '3. 분석이 완료되면 안전한 경우에는 "의심스러운 기록이 없습니다"라는 메시지가 뜹니다.',
        image: analysis3,
      },
      {
        text: '4. 의심 기록이 있을 경우, 어떤 문자에서 어떤 키워드가 감지됐는지, 통화는 몇 건이 어떤 이유로 의심되는지 결과 메시지가 뜹니다.',
        image: analysis4,
      },
    ],

  };

  const steps = guideSteps[sectionKey] || ['해당 기능에 대한 설명이 없습니다.'];

  return (
    <LinearGradient
      colors={['rgb(208, 224, 241)', 'rgb(213, 225, 236)']}
      style={styles.gradient}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <CustomText style={styles.title}>{title}</CustomText>

        <View style={styles.stepWrapper}>
          {steps.map((step, index) => (
            <View key={index} style={styles.stepBox}>
              <CustomText style={styles.stepText}>
                {typeof step === 'string' ? step : step.text}
              </CustomText>
              {typeof step === 'object' && step.image && (
                <Image source={step.image} style={styles.stepImage} resizeMode="contain" />
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },

  container: {
    padding: 24,
    alignItems: 'center',
  },

  title: {
    fontWeight: '900',
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 30,
    color: '#1A4DCC',
  },

  stepWrapper: {
    width: '100%',
    rowGap: 20,
  },

  stepBox: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(33, 113, 245, 0.5)',
    shadowColor: '#4B7BE5',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },

  stepText: {
    fontWeight: '600',
    fontSize: 15,
    color: '#333',
    lineHeight: 24,
  },

  stepImage: {
    width: '100%',
    height: 640,
    marginTop: 20,
    borderRadius: 1,
    resizeMode: 'cover',
    backgroundColor: 'rgba(33, 113, 245, 0.5)',
  },
});
