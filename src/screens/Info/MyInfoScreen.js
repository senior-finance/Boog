import React, { useState, useContext } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
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
import { logoutSession } from '../Login/AutoLogin';

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
        { text: '취소', onPress: () => setModalVisible(false), color: 'transparent', textColor: '#999' },
        {
          text: '확인',
          onPress: async () => {
            setModalVisible(false);
            await logoutSession();
            setUserInfo(null);
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
          },
          color: '#1446D8',
          textColor: '#fff',
        },
      ],
    });
  };

  const handleSelectImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) return;
      if (response.assets && response.assets.length > 0) {
        setProfileUri(response.assets[0].uri);
      }
    });
  };

  const MENU = [
    { icon: 'text-outline', text: '글자 크기', to: 'FontSize' },
    { icon: 'volume-high-outline', text: '음향 크기', to: 'SoundVolumeSetting' },
    { icon: 'help-circle-outline', text: '자주 묻는 질문', to: 'FAQ' },
    { icon: 'chatbubble-ellipses-outline', text: '1:1 문의하기', to: 'InquiryForm' },
    { icon: 'document-text-outline', text: '문의 내역 확인', to: 'InquiryList' },
    { icon: 'log-out-outline', text: '로그아웃', action: confirmLogout },
  ];

  return (
    <LinearGradient colors={['rgba(140, 182, 222, 0.69)', '#e0f0ff']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={() => setSelectModalVisible(true)}>
            <View style={styles.profileCard}>
              <Image
                source={typeof profileUri === 'string' ? { uri: profileUri } : profileUri}
                style={styles.profileImage}
              />
              <View style={styles.cameraBadge}>
                <Ionicons name="camera-outline" size={18} color="#1446D8" />
              </View>
            </View>
          </TouchableOpacity>
          <CustomText style={styles.userName}>{userInfo?.username || '이름 없음'} 님</CustomText>
        </View>

        <View style={styles.menuContainer}>
          {MENU.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => item.to ? navigation.navigate(item.to) : item.action?.()}
              style={styles.cardWrapper}
            >
              <LinearGradient
                colors={['#ffffff', '#d6eaff']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.menuCard}
              >
                <Ionicons name={item.icon} size={22} color="#1446D8" style={styles.menuIcon} />
                <CustomText style={styles.menuText}>{item.text}</CustomText>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Modal visible={selectModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.selectBox}>
            <TouchableOpacity
              onPress={() => {
                setSelectModalVisible(false);
                navigation.navigate('ProfileIconSelect');
              }}
              style={styles.selectButton}
            >
              <CustomText style={styles.selectText}>기본 아이콘 선택</CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSelectModalVisible(false);
                handleSelectImage();
              }}
              style={styles.selectButton}
            >
              <CustomText style={styles.selectText}>갤러리에서 선택</CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectModalVisible(false)}
              style={[styles.selectButton, { borderTopWidth: 1 }]}
            >
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
  container: { flex: 1 },
  scroll: { alignItems: 'center', padding: 24, paddingTop: 60 },

  profileSection: { alignItems: 'center', marginBottom: 30 },
  profileCard: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#1446D8',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  profileImage: {
    width: 94,
    height: 94,
    borderRadius: 47,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1446D8',
  },
  userName: {
    marginTop: 16,
    fontWeight: '700',
    fontSize: 16,
    color: 'rgb(4, 63, 150)',
  },

  menuContainer: { width: '100%' },
  cardWrapper: {
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(21, 70, 216, 0.24)',
  },
  menuIcon: {
    marginRight: 16,
  },
  menuText: {
    fontWeight: '600',
    color: 'rgb(39, 39, 39)',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectBox: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  selectButton: {
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  selectText: {
    fontWeight: '500',
    color: '#1446D8',
  },
});

export default MyInfoScreen;
