import React, { useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Animated,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '../../components/CustomText';

const LearningScreen = ({ navigation }) => {
  const [pressedIndex, setPressedIndex] = useState(null);
  const scaleAnimRefs = useRef([]);

  const cards = [
    {
      title: '금융 용어 학습하기',
      desc: '용어를 쉽게 배워보세요',
      icon: 'school-outline',
      nav: 'QuizLevel',
    },
    {
      title: '송금 연습하기',
      desc: '송금하는 방법을\n배워보세요',
      icon: 'bank-transfer',
      nav: 'DepositStep1',
    },

        {
      title: '보이스피싱 사례 살펴보기',
      desc: '실제 사례로 예방해보세요',
      icon: 'shield-alert-outline',
      nav: 'VoicePhishingScreen',
    },

  ];

  if (scaleAnimRefs.current.length !== cards.length) {
    scaleAnimRefs.current = cards.map(() => new Animated.Value(1));
  }

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

  return (
    <LinearGradient
      colors={['#D8ECFF', '#E9F4FF']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
      <CustomText
        style={[
          styles.title,
          { fontSize: (styles.title.fontSize || +25) }
        ]}
      >
        금융 교육 목록
      </CustomText>

        {cards.map((card, idx) => (
          <Animated.View
            key={idx}
            style={{
              transform: [{ scale: scaleAnimRefs.current[idx] }],
              marginBottom: 30,
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
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: '#4B7BE5',
  //  backgroundColor: 'rgba(75, 123, 229, 0.1)',
//    paddingHorizontal: 20,
  //  paddingVertical: 12,
  //  borderRadius: 15,
    marginTop: 30,
    marginBottom: 50,
    textAlign: 'center',
  },
  card: {
    width: '95%',
    borderRadius: 20,
    backgroundColor: '#F0F8FF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 50,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(75, 123, 229, 0.3)',
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