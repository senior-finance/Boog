import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '../../components/CustomText';


const FunctionButton = ({ title, onPress, icon }) => (
  <TouchableOpacity style={styles.functionButton} onPress={onPress}>
    <Ionicons name={icon} size={30} color="#4B7BE5" />
    <CustomText style={styles.functionText}>{String(title)}</CustomText>
  </TouchableOpacity>
);

const FunctionScreen = ({ navigation }) => {
  return (
    <LinearGradient colors={['#F8F8F8', '#ECECEC']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.gridContainer}>
          <FunctionButton title="퀴즈" icon="school" onPress={() => navigation.navigate('Learning')} />
          <FunctionButton title="지도" icon="map" onPress={() => navigation.navigate('MapView')} />
          <FunctionButton title="사용법" icon="book-outline" onPress={() => navigation.navigate('Guide')} />

          <FunctionButton title="지문 인증" icon="finger-print" onPress={() => navigation.navigate('Biometric')} />
          <FunctionButton title="정부 복지 혜택" icon="gift" onPress={() => navigation.navigate('Welfare')} />
          <FunctionButton title="자동 통화/문자 분석" icon="phone-portrait" onPress={() => navigation.navigate('AutoPhoneAnalysis')} />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '90%',
    marginTop: 20,
  },
  functionButton: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 40,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  functionText: {
    color: '#333',
    marginTop: 10,
    fontWeight: '600',
  },
});

export default FunctionScreen;
