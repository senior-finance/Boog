import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Modal } from 'react-native';
import { ProfileContext } from './ProfileContext';

// 로컬 기본 이미지 사용 (이미지 경로에 맞게 조정)
// const defaultProfile = Image.resolveAssetSource(require('../../assets/minecraft-skin-head-girl.png')).uri;

const MyInfoScreen = ({ navigation }) => {
  const { profileUri, setProfileUri } = useContext(ProfileContext);
  const [selectModalVisible, setSelectModalVisible] = useState(false);

  const handleSelectImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) return;
      else if (response.assets && response.assets.length > 0) {
        setProfileUri(response.assets[0].uri);
      } else {
        Alert.alert('이미지 선택 실패', '다시 시도해 주세요.');
      }
    });
  };

  const handleProfilePress = () => {
    setSelectModalVisible(true);
  };

  return (
    <LinearGradient colors={['#F8F8F8', '#ECECEC']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={handleProfilePress}>
            {/* <Image source={{ uri: profileUri }} style={styles.profileImage} /> */}
            <Image
              source={typeof profileUri === 'string' ? { uri: profileUri } : profileUri}
              style={styles.profileImage}
            />
            <Ionicons name="camera-outline" size={24} color="#fff" style={styles.cameraIcon} />
          </TouchableOpacity>
          <Text style={styles.name}>부금이</Text>
          <Text style={styles.account}>111-222-4445543</Text>
        </View>


        {/* 버튼들 */}
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('CustomerService')}>
          <Ionicons name="chatbox-ellipses-outline" size={22} color="#4B7BE5" style={styles.icon} />
          <Text style={styles.menuText}>고객센터</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('FontSize')}>
          <Ionicons name="text-outline" size={22} color="#4B7BE5" style={styles.icon} />
          <Text style={styles.menuText}>글자 크기</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('SoundVolume')}>
          <Ionicons name="volume-high-outline" size={22} color="#4B7BE5" style={styles.icon} />
          <Text style={styles.menuText}>음향 크기</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('VoicePhishing')}>
          <Ionicons name="alert-circle-outline" size={22} color="#4B7BE5" style={styles.icon} />
          <Text style={styles.menuText}>보이스 피싱 사례</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('CallTextAnalysis')}>
          <Ionicons name="document-text-outline" size={22} color="#4B7BE5" style={styles.icon} />
          <Text style={styles.menuText}>통화 및 문자 분석</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 프로필 선택 모달 */}
      <Modal visible={selectModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.selectBox}>
            <TouchableOpacity onPress={() => {
              setSelectModalVisible(false);
              navigation.navigate('ProfileIconSelect'); // ← 여기!
            }} style={styles.selectButton}>
              <Text style={styles.selectText}>기본 아이콘 선택</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
              setSelectModalVisible(false);
              handleSelectImage();
            }} style={styles.selectButton}>
              <Text style={styles.selectText}>갤러리에서 선택</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setSelectModalVisible(false)} style={[styles.selectButton, { borderTopWidth: 1 }]}>
              <Text style={[styles.selectText, { color: '#999' }]}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>



    </LinearGradient>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  account: {
    fontSize: 14,
    color: '#666',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '85%',
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
  },
  icon: {
    marginRight: 12,
  },
  menuText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
  },

  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4B7BE5',
    padding: 6,
    borderRadius: 20,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  selectBox: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  selectButton: {
    width: '100%',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  },
  selectText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4B7BE5',
  },


});

export default MyInfoScreen;
