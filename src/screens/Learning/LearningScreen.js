import React, { useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomText from '../../components/CustomText';

const LearningScreen = ({ navigation }) => {
  const [pressedIndex, setPressedIndex] = useState(null);
  const scaleAnimRefs = useRef([]);

  const handlePressIn = index => {
    setPressedIndex(index);
    Animated.spring(scaleAnimRefs.current[index], {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = index => {
    Animated.spring(scaleAnimRefs.current[index], {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const cards = [
    {
      title: '금융 용어 학습하기',
      desc: '용어를 쉽게 배워보세요 >',
      icon: 'school-outline',
      nav: 'QuizLevel',
    },
    {
      title: '입금 연습하기',
      desc: '입금하는 방법을 배워보세요 >',
      icon: 'bank-transfer',
      nav: 'DepositStep1',
    },
    {
      title: '보이스피싱 사례',
      desc: '사기 문자 유형을 확인해보세요 >',
      icon: 'alert-circle-outline',
      nav: 'VoicePhishingScreen',
    },
  ];

  // Initialize animated values
  if (scaleAnimRefs.current.length !== cards.length) {
    scaleAnimRefs.current = cards.map(() => new Animated.Value(1));
  }

  return (
    <View style={styles.container}>
      <CustomText
        style={[
          styles.title,
          { fontSize: (styles.title.fontSize || +25) }
        ]}
      >
        학습 콘텐츠
      </CustomText>
      {cards.map((card, idx) => (
        <Animated.View
          key={idx}
          style={{
            transform: [{ scale: scaleAnimRefs.current[idx] }],
            width: '100%',
            marginBottom: 20,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.card}
            onPress={() => navigation.navigate(card.nav)}
            onPressIn={() => handlePressIn(idx)}
            onPressOut={() => handlePressOut(idx)}
          >
            <View style={styles.cardLeft}>
              <CustomText style={styles.cardTitle}>{card.title}</CustomText>
              <CustomText style={styles.cardDesc}>{card.desc}</CustomText>
            </View>
            <Icon name={card.icon} size={50} color="#4B7BE5" />
          </TouchableOpacity>
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 50,
    color: '#333',
    backgroundColor: 'rgba(75, 123, 229, 0.1)', // 연한 블루
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
  card: {
    width: '95%',
    borderRadius: 20,
    backgroundColor: '#fff', //'#EEF3F9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 30,
    padding: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1.5,
    borderColor: 'rgba(75, 123, 229, 0.5)'
  },
  cardLeft: {
    flex: 1,
    marginRight: 10,
  },
  cardTitle: {
    fontWeight: 'bold',
    color: '#4B7BE5',
    marginBottom: 6,
  },
  cardDesc: {
    color: '#555',
  },
});

export default LearningScreen;