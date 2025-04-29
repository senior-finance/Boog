import React, { useRef, useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, ActivityIndicator, Animated, StyleSheet, Easing, Image } from 'react-native';
import { WebView } from 'react-native-webview';
import CustomText from '../../components/CustomText';

// 내부에서 사용할 상수 변수 선언
const DEFAULT_TITLE = '금융결제원 테스트베드';
const LOADING_MESSAGE = '로딩 중...';

const AccountScreenGUI = ({
    step,
    setStep,
    AUTH_URL,
    handleNavigationStateChange,
    loading,
    accountList,
    accountBalances,
    handleReceiveMoney,
    handleWithdraw,
    confirmClearToken
}) => {

    // 애니메이션 초기값 (0)
    const animationValue = useRef(new Animated.Value(0)).current;

    // 애니메이션 실행 함수
    const handleAnimateReceive = () => {
        // 애니메이션 값을 0으로 리셋
        animationValue.setValue(0);

        // 두 단계의 애니메이션 순차 실행:
        // 1단계: 빠밤하면서 확대 및 배경 원 등장
        // 2단계: 아래로 슬라이드하며 사라짐
        Animated.sequence([
            Animated.timing(animationValue, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(animationValue, {
                toValue: 2,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start(() => {
            // 애니메이션 종료 후 필요한 추가 동작
        });
    };

    // 이미지의 translateY: 초기 위치에서 약간 위로 올렸다가, 2단계에서는 아래로 슬라이드
    const translateY = animationValue.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [0, -100, 300], // 초기엔 약간 위로 올라갔다가 최종적으로 아래로 이동
    });

    // 이미지의 확대 효과 (scale)
    const scale = animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 2],
        extrapolate: 'clamp',
    });

    // 이미지의 투명도: 나타났다 사라지는 효과
    const imageOpacity = animationValue.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [0, 1, 0],
    });

    // 이미지에 적용할 Animated 스타일
    const animatedImageStyle = {
        transform: [{ translateY }, { scale }],
        opacity: imageOpacity,
    };

    // 배경 원의 확대 효과 (동일한 scale을 사용하거나 개별 인터폴레이션 가능)
    const circleScale = animationValue.interpolate({
        inputRange: [0, 2],
        outputRange: [1, 4],
        extrapolate: 'clamp',
    });

    // 배경 원의 투명도: 이미지와 동시에 등장 후 서서히 사라짐
    const circleOpacity = animationValue.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [0, 0.5, 0],
    });

    // 홈 화면 렌더링
    if (step === 'home') {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{DEFAULT_TITLE}</Text>
                <Button title="인증하기" onPress={() => setStep('auth')} />
            </View>
        );
    }

    // 인증 화면 렌더링
    if (step === 'auth') {
        return (
            <WebView
                source={{ uri: AUTH_URL }}
                onNavigationStateChange={handleNavigationStateChange}
            />
        );
    }

    // 로딩 상태 렌더링
    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
                <Text>{LOADING_MESSAGE}</Text>
            </View>
        );
    }

    // 계좌 목록 화면 렌더링 (잔액 및 출금 버튼 포함)
    if (step === 'accountList') {
        return (
            <View style={styles.container}>
                <CustomText style={styles.title}>! 금융결제원 테스트베드 환경에 등록된 모의 계좌입니다</CustomText>
                <CustomText style={styles.title}>계좌 목록 </CustomText>
                <FlatList
                    data={accountList}
                    keyExtractor={(item) => item.fintech_use_num}
                    renderItem={({ item }) => {
                        // 배열에서 해당 계좌의 잔고 정보를 찾아 반환
                        const balanceObj = accountBalances.find(
                            (b) => b.fintech_use_num === item.fintech_use_num
                        );
                        return (
                            <View style={styles.accountItem}>
                                <View style={styles.accountInfo}>
                                    <CustomText style={styles.bankName}>
                                        은행명 : {balanceObj ? balanceObj.bank_name : '은행 조회 중...'}
                                    </CustomText>
                                    <CustomText style={styles.accountNumber}>
                                        계좌번호 : {item.account_num_masked || '정보없음'}
                                    </CustomText>
                                    <CustomText style={styles.balance}>
                                        잔액 :{" "}
                                        {balanceObj ? Number(balanceObj.balance_amt).toLocaleString() : '잔액 조회 중...'}
                                    </CustomText>
                                </View>
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity
                                        style={styles.receiveButton}
                                        // onPress={() => handleReceiveMoney(item)}
                                        onPress={() => handleAnimateReceive(item)}
                                    >
                                        <CustomText style={styles.receiveButtonText}>지원금 받기</CustomText>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.withdrawButton}
                                        onPress={() => handleWithdraw(item)}
                                    >
                                        <CustomText style={styles.withdrawButtonText}>출금</CustomText>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    }}
                />
                <Button title="token 캐시 초기화" onPress={confirmClearToken} />
                {/* 배경 원 1 */}
                <Animated.View
                    pointerEvents="none"
                    style={[
                        styles.circle,
                        {
                            opacity: circleOpacity,
                            transform: [{ scale: circleScale }],
                        },
                    ]}
                />
                {/* 배경 원 2 */}
                <Animated.View
                    pointerEvents="none"
                    style={[
                        styles.circle,
                        styles.circle2,
                        {
                            opacity: circleOpacity,
                            transform: [{ scale: circleScale }],
                        },
                    ]}
                />
                {/* 애니메이션을 적용한 이미지 */}
                <Animated.View pointerEvents="none" style={[styles.imageContainer, animatedImageStyle]}>
                    <Image
                        source={require('../../assets/icon1.png')}
                        style={styles.image}
                    />
                </Animated.View>
            </View>
        );
    }

    // 그 외의 상태: 진행 중 메시지
    return (
        <View style={styles.container}>
            <Text>프로세스 진행 중...</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20
    },
    accountItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f8f8f8',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    accountInfo: {
        flex: 1,
    },
    accountNumber: {
        // fontSize: 14,
        marginBottom: 2
    },
    balance: {
        // fontSize: 12,
        color: '#333',
        marginTop: 2
    },
    bankName: {
        // fontSize: 14,
        color: '#555',
        marginTop: 2,
    },
    buttonContainer: {
        flexDirection: 'row',
    },
    receiveButton: {
        backgroundColor: '#28a745',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 5,
        marginRight: 8,
    },
    receiveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    withdrawButton: {
        backgroundColor: '#007bff',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 5,
    },
    withdrawButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain', // 또는 'cover' 선택
    },
    imageContainer: {
        position: 'absolute',
        width: 100,
        height: 100,
        top: '50%',
        left: '50%',
        marginTop: -25, // height의 절반
        marginLeft: -25, // width의 절반
        alignItems: 'center',
        justifyContent: 'center',
    },
    circle: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'lightblue',
    },
    circle2: {
        // 두번째 원은 첫번째 원과 약간 겹치되 다른 위치나 색상을 줄 수 있음
        backgroundColor: 'lightgreen',
        top: '20%',
        left: '20%',
        width: 120,
        height: 120,
        // top: 15,
        // left: 10,
    },
});

export default AccountScreenGUI;
