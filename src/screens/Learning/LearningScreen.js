import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // 아이콘 사용

const LearningScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>학습 콘텐츠</Text>

      {/* 카드형 버튼들 */}
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Quiz')}>
        <Icon name="school-outline" size={36} color="#3B82F6" />
        <Text style={styles.cardText}>금융 용어 학습하기</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('DepositStep1')}>
        <Icon name="bank-transfer" size={36} color="#3B82F6" />
        <Text style={styles.cardText}>입금 연습하기</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card}>
        <Icon name="alert-circle-outline" size={36} color="#3B82F6" />
        <Text style={styles.cardText}>사기 사례 대비하기{'\n'}(보이스피싱, 금융 피해 등)</Text>
      </TouchableOpacity>

      {/* 도움 버튼 */}
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.footerButton, styles.help]}>
          <Text style={styles.footerText}>도움</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// 스타일
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 40,
    color: 'black',
  },
  card: {
    width: '90%',
    height: 125,
    borderRadius: 20,
    backgroundColor: 'white',
    marginBottom: 30,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  cardText: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  // 도움 버튼
  footer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  footerButton: {
    width: '30%',
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: 'center',
  },
  help: {
    backgroundColor: '#DFEBF8',
  },
  footerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default LearningScreen;