import React, { useEffect, useState } from 'react';
import { NativeModules, Image, Dimensions } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
const NaverLogin = NativeModules.NaverLoginModule || require('@react-native-seoul/naver-login').default;
import * as KakaoLogin from '@react-native-seoul/kakao-login';
import { LOGIN_NAVER_KEY, LOGIN_NAVER_SECRET } from '@env';
import CustomModal from '../../components/CustomModal';
import { useUser } from './UserContext';

// 높이 계산
const screenHeight = Dimensions.get('window').height;

// 빈 공간 넣을때 쓰는거
const Gap = () => <View style={{ height: 16 }} />;

// 네이버 앱 설정
const consumerKey = `${LOGIN_NAVER_KEY}`;
const consumerSecret = `${LOGIN_NAVER_SECRET}`;
const appName = 'testapp';
const serviceUrlScheme = 'navertest';

export default function LoginScreen({ navigation }) {
  // 사용자 정보 선언
  const { setUserInfo } = useUser();

  // 네이버 SDK 초기화
  useEffect(() => {
    if (NaverLogin && typeof NaverLogin.initialize === 'function') {
      NaverLogin.initialize({
        appName,
        consumerKey,
        consumerSecret,
        serviceUrlSchemeIOS: serviceUrlScheme,
        disableNaverAppAuthIOS: true,
      });
    } else {
      console.warn('NaverLogin 모듈을 찾을 수 없습니다. 네이티브 모듈 설치 및 빌드를 확인하세요.');
    }
  }, []);

  // 상태 관리
  const [naverSuccess, setNaverSuccess] = useState(null);
  const [naverFailure, setNaverFailure] = useState(null);
  const [naverProfile, setNaverProfile] = useState(null);
  const [kakaoToken, setKakaoToken] = useState(null);
  const [kakaoProfile, setKakaoProfile] = useState(null);

  // 커스텀 모달 상태
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    buttons: [],
  });

  const showModal = ({ title, message, buttons }) => {
    setModalConfig({ title, message, buttons });
    setModalVisible(true);
  };

  // 공통 유저 저장 함수
  const saveSocialUser = async ({ provider, socialId, username, nickname }) => {
    const user = {
      provider, // 로그인 플랫폼
      socialId, // 사용자 고유 ID
      username, // 사용자 실제 이름
      nickname, // 사용자 지정 이름

      createdAt: new Date()
    };

    setUserInfo(user);
    //console.log(`[SAVE USER]`, user);
  };

  // 유저가 처음인지 확인 및 DB 정보 삽입
  const countNew = async () => {

    // 이미 고유 ID가 존재하는 기존 유저라면 바로 메인화면으로
    // 고유 ID가 존재하지 않는 새로운 유저라면 loginCount 0으로 설정 및 DB 저장

    // 1. 사용자 존재 여부 및 로그인 횟수 조회
    let loginCount = 0; // 실제 값 가져와야함

    // 2. 로그인 횟수 +1
    loginCount += 1;

    // 3. 사용자 정보 저장/업데이트
    // 로그인 횟수같은거

    // 4. 최초 로그인 여부에 따라 다른 화면

    //테스트 변수
    loginCount = 1;
    // loginCount = 2;
    if (loginCount === 1) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'SetUserNameScreen' }],
      });
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    }
  };


  // 네이버 로그인
  const onNaverLogin = async () => {
    const { failureResponse, successResponse } = await NaverLogin.login();
    setNaverSuccess(successResponse);
    setNaverFailure(failureResponse);

    if (successResponse) {
      //console.log('[NAVER] Login Success:', successResponse);
      const profileResult = await NaverLogin.getProfile(successResponse.accessToken);
      setNaverProfile(profileResult);
      const res = profileResult.response;

      await saveSocialUser({
        provider: 'naver',
        socialId: res.id,
        username: res.name,
        nickname: res.name,
      });

      showModal({
        title: '네이버 로그인 성공',
        message: ' ',
        buttons: [
          {
            text: '확인',
            onPress: () => {
              setModalVisible(false);
              countNew();
            },
            color: '#4B7BE5',
          },
        ],
      });
    }

    if (failureResponse) {
      //console.log('[NAVER] Login Failure:', failureResponse);
      showModal({
        title: '네이버 로그인 실패',
        message: '네이버 로그인에 실패했습니다.\n다시 시도해주세요.',
        buttons: [
          {
            text: '확인',
            onPress: () => setModalVisible(false),
            color: '#4B7BE5',
          },
        ],
      });
    }
  };


  // 네이버 로그아웃
  const onNaverLogout = async () => {
    try {
      await NaverLogin.logout();
      setNaverSuccess(null);
      setNaverFailure(null);
      setNaverProfile(null);
    } catch (e) {
      console.log(e);
    }
  };

  // 네이버 프로필 조회
  const onGetNaverProfile = async () => {
    if (!naverSuccess) {
      showModal({
        title: '로그인 필요',
        message: '먼저 네이버 로그인해주세요.',
        buttons: [
          {
            text: '확인',
            onPress: () => setModalVisible(false),
            color: '#4B7BE5',
          },
        ],
      });
      return;
    }
    try {
      const profileResult = await NaverLogin.getProfile(naverSuccess.accessToken);
      setNaverProfile(profileResult);
      //console.log('[NAVER] Profile:', profileResult);
    } catch (e) {
      setNaverProfile(null);
      ('[NAVER] Profile Fetch Error:', e);
    }
  };

  // 네이버 토큰 삭제
  const onDeleteNaverToken = async () => {
    try {
      await NaverLogin.deleteToken();
      setNaverSuccess(null);
      setNaverFailure(null);
      setNaverProfile(null);
    } catch (e) {
      console.log(e);
    }
  };

  // 카카오 로그인
  const onKakaoLogin = async () => {
    try {
      const token = await KakaoLogin.login();
      setKakaoToken(token);
      //console.log('[KAKAO] 로그인 성공:', token);

      const profile = await KakaoLogin.getProfile();
      setKakaoProfile(profile);
      //console.log('[KAKAO] 프로필 정보:', profile);

      await saveSocialUser({
        provider: 'kakao',
        socialId: String(profile.id),
        username: profile.nickname,
        nickname: profile.nickname,
      });

      showModal({
        title: '카카오 로그인 성공',
        message: ' ',
        buttons: [
          {
            text: '확인',
            onPress: () => {
              setModalVisible(false);
              countNew();
            },
            color: '#4B7BE5',
          },
        ],
      });
    } catch (error) {
      console.log('Kakao Login Error:', error);
      showModal({
        title: '카카오 로그인 실패',
        message: error.message || '에러 발생',
        buttons: [
          {
            text: '확인',
            onPress: () => setModalVisible(false),
            color: '#4B7BE5',
          },
        ],
      });
    }
  };

  // 카카오 로그아웃
  const onKakaoLogout = async () => {
    try {
      await KakaoLogin.logout();
      setKakaoToken(null);
      setKakaoProfile(null);
      //console.log('[KAKAO] 로그아웃 성공');
      showModal({
        title: '카카오 로그아웃 완료',
        message: '정상적으로 로그아웃되었습니다.',
        buttons: [
          {
            text: '확인',
            onPress: () => setModalVisible(false),
            color: '#4B7BE5',
          },
        ],
      });
    } catch (error) {
      console.log('[KAKAO] 로그아웃 오류:', error);
      showModal({
        title: '카카오 로그아웃 실패',
        message: error.message || '에러 발생',
        buttons: [
          {
            text: '확인',
            onPress: () => setModalVisible(false),
            color: '#4B7BE5',
          },
        ],
      });
    }
  };

  // 카카오 프로필 조회
  const onKakaoGetProfile = async () => {
    try {
      const profile = await KakaoLogin.getProfile();
      setKakaoProfile(profile);
      //console.log('[KAKAO] 프로필 정보:', profile);
      showModal({
        title: '카카오 프로필',
        message: profile.nickname || '이름 없음',
        buttons: [
          {
            text: '확인',
            onPress: () => setModalVisible(false),
            color: '#4B7BE5',
          },
        ],
      });
    } catch (error) {
      console.log('[KAKAO] 프로필 조회 실패:', error);
      showModal({
        title: '프로필 조회 실패',
        message: error.message || '에러 발생',
        buttons: [
          {
            text: '확인',
            onPress: () => setModalVisible(false),
            color: '#4B7BE5',
          },
        ],
      });
    }
  };

  // 카카오 토큰 삭제
  const onKakaoUnlink = async () => {
    try {
      await KakaoLogin.unlink();
      setKakaoToken(null);
      setKakaoProfile(null);
      //console.log('[KAKAO] 계정 연결 해제 성공');
      showModal({
        title: '카카오 계정 연결 해제 완료',
        message: '정상적으로 해제되었습니다.',
        buttons: [
          {
            text: '확인',
            onPress: () => setModalVisible(false),
            color: '#4B7BE5',
          },
        ],
      });
    } catch (error) {
      console.log('[KAKAO] unlink 실패:', error);
      showModal({
        title: '카카오 연결 해제 실패',
        message: error.message || '에러 발생',
        buttons: [
          {
            text: '확인',
            onPress: () => setModalVisible(false),
            color: '#4B7BE5',
          },
        ],
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>


      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.contentWrapper}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
          />

          <TouchableOpacity style={[styles.button, styles.kakao]} onPress={onKakaoLogin}>
            <View style={styles.buttonContent}>
              <FontAwesome name="comment" size={20} color="#000" style={styles.icon} />
              <Text style={styles.buttonText}>카카오로 로그인</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.naver]} onPress={onNaverLogin}>
            <View style={styles.buttonContent}>
              <FontAwesome name="leaf" size={20} color="#fff" style={styles.icon} />
              <Text style={[styles.buttonText, { color: '#fff' }]}>네이버로 로그인</Text>
            </View>
          </TouchableOpacity>

          {/* 테스트 용으로 로그인 안하고 메인화면으로 넘어갈 때 사용하는거 */}
          { <TouchableOpacity style={[styles.button, styles.skip]} onPress={() => navigation.navigate('MainTabs')}>
            <Text style={styles.buttonText}>로그인 없이 계속</Text>
          </TouchableOpacity> }

        </View>
      </ScrollView>
      {/* 공통 커스텀 모달 */}
      <CustomModal
        visible={modalVisible}
        title={modalConfig.title}
        message={modalConfig.message}
        buttons={modalConfig.buttons}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  contentWrapper: {
    marginTop: screenHeight * 0.3, // ← 위에서부터 원하는 비율 (20~25%)에 따라 조정
    alignItems: 'center',
  },
  logo: {
    width: "80%",
    height: 100,
    marginBottom: 32,
    resizeMode: 'contain',
  },

  kakao: { backgroundColor: '#FEE500' },
  naver: { backgroundColor: '#03C75A' },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    width: '70%',
    height: 70,
    alignItems: 'center',
    justifyContent: 'center', // ← 버튼 자체도 가운데 정렬 보장
    marginBottom: 30,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',    // ← 아이콘, 텍스트 수직 중앙 정렬
    justifyContent: 'center',
    height: '100%',
  },
  icon: {
    marginRight: 10,
  },
});