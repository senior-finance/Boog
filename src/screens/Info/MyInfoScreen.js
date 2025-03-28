import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; // CLI용 올바른 import
import { launchImageLibrary } from 'react-native-image-picker';

const MyInfoScreen = ({ navigation }) => {
  const [profileUri, setProfileUri] = useState('https://mc-heads.net/avatar/username/100.png');

  const handleSelectImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        return;
      } else if (response.assets && response.assets.length > 0) {
        setProfileUri(response.assets[0].uri);
      } else {
        Alert.alert('이미지 선택 실패', '다시 시도해 주세요.');
      }
    });
  };

  return (
    <LinearGradient colors={['#AEEEEE', '#DDA0DD']} style={styles.container}>
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={handleSelectImage}>
          <Image source={{ uri: profileUri }} style={styles.profileImage} />
        </TouchableOpacity>
        <Text style={styles.name}>부금이</Text>
        <Text style={styles.account}>111-222-4445543</Text>
      </View>

      {/* 버튼 영역 */}
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('CustomerService')}>
      <Text style={styles.menuText}>고객센터</Text>
      </TouchableOpacity>

      {/* 설정 메뉴 */}
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('FontSize')}>
        <Text style={styles.menuText}>글자 크기</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('SoundVolume')}>
        <Text style={styles.menuText}>음향 크기</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('VoicePhishing')}>
        <Text style={styles.menuText}>보이스 피싱 사례</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('CallTextAnalysis')}>
         <Text style={styles.menuText}>통화 및 문자 분석</Text>
      </TouchableOpacity>
    

      {/* 하단 네비게이션 바 */}
      <View style={styles.bottomNav}>
      <TouchableOpacity onPress={() => navigation.navigate('Main')}>
        <Text style={styles.navText}>🏠 홈</Text>
      </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.navText}>💖</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
profileImage: {
  width: 100,
  height: 100,
  borderRadius: 50,
  marginBottom: 10,
},
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  account: {
    fontSize: 14,
    color: '#555',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    marginBottom: 20,
  },
  smallButton: {
    backgroundColor: '#ffffff88',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center', 
    justifyContent: 'center',
    minWidth: 100,
  },

  buttonText: {
    fontWeight: 'bold',
  },
  menuItem: {
    backgroundColor: 'white',
    width: '80%',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#ffffff88',
  },
  navText: {
    fontSize: 20,
  },
});

export default MyInfoScreen;
