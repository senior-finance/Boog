import React, { useRef, useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, ActivityIndicator, Animated, StyleSheet, Easing } from 'react-native';
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

    const translateYAnim = useRef(new Animated.Value(50)).current; // Starts 50px below
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const [animateVisible, setAnimateVisible] = useState(false);

    // Function to handle the "지원금 받기" animation
    const handleAnimateReceive = (item) => {
        // Call the provided receive money functionality
        handleReceiveMoney(item);

        // Show the animated money icon
        setAnimateVisible(true);

        // Animate the icon upward and fade it in
        Animated.parallel([
            Animated.timing(translateYAnim, {
                toValue: 0, // Ends inside the amount display
                duration: 500,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1, // Fade in
                duration: 300,
                useNativeDriver: true,
            })
        ]).start(() => {
            // Once the icon is in place, animate it out with a fade and a slight upward move
            Animated.parallel([
                Animated.timing(opacityAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(translateYAnim, {
                    toValue: -50, // Move upward further
                    duration: 500,
                    easing: Easing.in(Easing.quad),
                    useNativeDriver: true,
                })
            ]).start(() => {
                // Reset animated values for the next use
                translateYAnim.setValue(50);
                opacityAnim.setValue(0);
                setAnimateVisible(false);
            });
        });
    };

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
});

export default AccountScreenGUI;
