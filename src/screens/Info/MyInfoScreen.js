import React, { useState, useContext } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ProfileContext } from './ProfileContext';
import CustomText from '../../components/CustomText';
import { useUser } from '../Login/UserContext';
import CustomModal from '../../components/CustomModal';

const MyInfoScreen = ({ navigation }) => {
  const { userInfo, setUserInfo } = useUser();
  const { profileUri, setProfileUri } = useContext(ProfileContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', buttons: [] });
  const [selectModalVisible, setSelectModalVisible] = useState(false);

  const showModal = ({ title, message, buttons }) => {
    setModalConfig({ title, message, buttons });
    setModalVisible(true);
  };

  const confirmLogout = () => {
    showModal({
      title: '로그아웃',
      message: '정말 로그아웃하시겠습니까?',
      buttons: [
        {
          text: '취소',
          onPress: () => setModalVisible(false),
          color: '#999',
          textColor: 'white',
        },
        {
          text: '확인',
          onPress: () => {
            setModalVisible(false);
            executeLogout();
          },
          color: '#4B7BE5',
          textColor: 'white',
        },
      ],
    });
  };

  const executeLogout = () => {
    setUserInfo(null);
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  const handleSelectImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) return;
      if (response.assets && response.assets.length > 0) {
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
            <View style={{ position: 'relative' }}>
              <View style={styles.profileWrapper}>
                <Image
                  source={typeof profileUri === 'string' ? { uri: profileUri } : profileUri}
                  style={styles.profileImage}
                />
              </View>
              <Ionicons name="camera-outline" size={24} color="#fff" style={styles.cameraIcon} />
            </View>
          </TouchableOpacity>
          <CustomText style={styles.name}>{`${userInfo?.nickname || '이름 없음'} 님`}</CustomText>
          {/* <CustomText style={styles.account}>계좌</CustomText> */}
        </View>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('FontSize')}>
          <Ionicons name="text-outline" size={22} color="#4B7BE5" style={styles.icon} />
          <CustomText style={styles.menuText}>글자 크기</CustomText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('SoundVolumeSetting')}>
          <Ionicons name="volume-high-outline" size={22} color="#4B7BE5" style={styles.icon} />
          <CustomText style={styles.menuText}>음향 크기</CustomText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('FAQ')}>
          <Ionicons name="help-circle-outline" size={22} color="#4B7BE5" style={styles.icon} />
          <CustomText style={styles.menuText}>자주 묻는 질문</CustomText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('InquiryForm')}>
          <Ionicons name="chatbubble-ellipses-outline" size={22} color="#4B7BE5" style={styles.icon} />
          <CustomText style={styles.menuText}>1:1 문의하기</CustomText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('InquiryList')}>
          <Ionicons name="document-text-outline" size={22} color="#4B7BE5" style={styles.icon} />
          <CustomText style={styles.menuText}>문의 내역 확인</CustomText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={confirmLogout}>
          <Ionicons name="log-out-outline" size={22} color="#4B7BE5" style={styles.icon} />
          <CustomText style={styles.menuText}>로그아웃</CustomText>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={selectModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.selectBox}>
            <TouchableOpacity onPress={() => {
              setSelectModalVisible(false);
              navigation.navigate('ProfileIconSelect');
            }} style={styles.selectButton}>
              <CustomText style={styles.selectText}>기본 아이콘 선택</CustomText>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
              setSelectModalVisible(false);
              handleSelectImage();
            }} style={styles.selectButton}>
              <CustomText style={styles.selectText}>갤러리에서 선택</CustomText>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setSelectModalVisible(false)} style={[styles.selectButton, { borderTopWidth: 1 }]}>
              <CustomText style={[styles.selectText, { color: '#999' }]}>취소</CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <CustomModal
        visible={modalVisible}
        title={modalConfig.title}
        message={modalConfig.message}
        buttons={modalConfig.buttons}
      />
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
  profileWrapper: {
    borderWidth: 2,
    borderColor: '#4B7BE5',
    borderRadius: 70,
    padding: 6,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 12,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: -5,
    backgroundColor: '#4B7BE5',
    padding: 6,
    borderRadius: 20,
  },
  name: {
    fontWeight: 'bold',
    color: '#333',
  },
  account: {
    color: '#666',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '90%',
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginVertical: 10,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(75, 123, 229, 0.5)',
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
    fontWeight: '600',
    color: '#333',
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
    fontWeight: '500',
    color: '#4B7BE5',
  },
});

export default MyInfoScreen;
