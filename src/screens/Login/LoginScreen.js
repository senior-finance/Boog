import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
//import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as KakaoLogin from '@react-native-seoul/kakao-login';

export default function LoginScreen({ navigation }) {
    // React.useEffect(() => {
    //     GoogleSignin.configure({
    //         webClientId: '1021861865118-jbme38v4flm0opln5rcttne95b5hsrfm.apps.googleusercontent.com',
    //     });
    // }, []);

    //   const onGoogleLogin = async () => {
    //     try {
    //       await GoogleSignin.hasPlayServices();
    //       const userInfo = await GoogleSignin.signIn();
    //       console.log('Google user:', userInfo);
    //       Alert.alert('구글 로그인 성공', userInfo.user.name);
    //     } catch (error) {
    //       console.error('Google Login Error:', error);
    //       Alert.alert('구글 로그인 실패', error.message);
    //     }
    //   };

    // const onGoogleLogin = async () => {
    //     console.log('Google Login 함수 진입');
    //     try {
    //         await GoogleSignin.hasPlayServices();
    //         console.log('Play Services 체크 통과');
    //         const userInfo = await GoogleSignin.signIn();
    //         console.log('로그인 성공:', userInfo);
    //         Alert.alert('구글 로그인 성공', userInfo.user.name);
    //     } catch (error) {
    //         console.error('Google Login Error:', error);
    //         Alert.alert('구글 로그인 실패', error.message);
    //     }
    // };

    const onKakaoLogin = async () => {
        try {
            const token = await KakaoLogin.login();
            console.log('Kakao token:', token);

            const profile = await KakaoLogin.getProfile();
            console.log('Kakao profile:', profile);

            Alert.alert('카카오 로그인 성공', profile.nickname || '이름 없음');
        } catch (error) {
            console.error('Kakao Login Error:', error);
            Alert.alert('카카오 로그인 실패', error.message || '에러 발생');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>소셜 로그인</Text>

            {/* <TouchableOpacity
                style={[styles.button, styles.google]}
                onPress={onGoogleLogin}
            >
                <Text style={styles.buttonText}>구글 로그인</Text>
            </TouchableOpacity> */}

            <TouchableOpacity
                style={[styles.button, styles.kakao]}
                onPress={onKakaoLogin}
            >
                <Text style={styles.buttonText}>카카오 로그인</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, styles.skip]}
                onPress={() => navigation.navigate('MainTabs')}
            >
                <Text style={styles.buttonText}>로그인 없이 계속</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 40 },
    button: {
        paddingVertical: 12,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
        marginBottom: 16,
    },
    google: { backgroundColor: '#4285F4' },
    kakao: { backgroundColor: '#FEE500' },
    skip: { backgroundColor: '#999', marginTop: 12 },
    buttonText: { color: '#000', fontSize: 16 },
});
