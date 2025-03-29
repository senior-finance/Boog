import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Button,
    ActivityIndicator,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    KFTC_CLIENT_ID,
    KFTC_CLIENT_SECRET,
    KFTC_REDIRECT_URI,
    KFTC_SCOPE,
    KFTC_STATE,
    KFTC_TRAN_ID,
} from '@env';

// 사용자 인증을 위한 URL 생성
const AUTH_URL = `https://testapi.openbanking.or.kr/oauth/2.0/authorize?response_type=code&client_id=${KFTC_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    KFTC_REDIRECT_URI
)}&scope=${KFTC_SCOPE}&state=${KFTC_STATE}&auth_type=0`;

const TOKEN_URL = 'https://testapi.openbanking.or.kr/oauth/2.0/token';
const USER_ME_URL = 'https://testapi.openbanking.or.kr/v2.0/user/me';
const ACCOUNT_BALANCE_URL = 'https://testapi.openbanking.or.kr/v2.0/account/balance/fin_num';

const Account = () => {
    // 상태 관리: 각 단계별 진행상태
    const [step, setStep] = useState('home'); // home, auth, fetchToken, fetchAccounts, accountList, fetchBalance, balance
    const [authCode, setAuthCode] = useState(null);
    const [tokenData, setTokenData] = useState(null);
    const [accountList, setAccountList] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [balanceData, setBalanceData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [accountBalances, setAccountBalances] = useState([]);

    // 토큰 저장 및 로드 함수
    const storeTokenData = async (data) => {
        try {
            await AsyncStorage.setItem('tokenData', JSON.stringify(data));
            console.log("토큰 데이터 저장 완료");
        } catch (err) {
            console.error("토큰 데이터 저장 에러:", err);
        }
    };

    const loadTokenData = async () => {
        try {
            const storedData = await AsyncStorage.getItem('tokenData');
            return storedData ? JSON.parse(storedData) : null;
        } catch (err) {
            console.error("토큰 데이터 로드 에러:", err);
            return null;
        }
    };

    // 잔고 데이터를 업데이트할 함수
    const handleReceiveMoney = (item) => {
        setAccountBalances((prevBalances) => {
            // 해당 계좌가 이미 존재하는지 인덱스를 찾습니다.
            const index = prevBalances.findIndex(b => b.fintech_use_num === item.fintech_use_num);
            if (index !== -1) {
                // 기존 항목이 있으면, balance_amt를 업데이트합니다.
                const updatedBalance = Number(prevBalances[index].balance_amt || 0) + 100000;
                return prevBalances.map((b, i) =>
                    i === index ? { ...b, balance_amt: updatedBalance } : b
                );
            } else {
                // 해당 계좌 항목이 없으면 새 항목을 추가합니다.
                return [
                    ...prevBalances,
                    { fintech_use_num: item.fintech_use_num, balance_amt: 100000, bank_name: item.bank_name || '알 수 없음' }
                ];
            }
        });
    };

    // 앱 시작 시 저장된 토큰 로드
    useEffect(() => {
        (async () => {
            const storedToken = await loadTokenData();
            if (storedToken && storedToken.access_token) {
                console.log("저장된 토큰 데이터 로드:", storedToken);
                setTokenData(storedToken);
                setStep('fetchAccounts');
            }
        })();
    }, []);

    // WebView의 URL 변경 감지: 리다이렉트 URL에서 code 추출
    const handleNavigationStateChange = (navState) => {
        const { url } = navState;
        console.log("URL 변경됨:", url);
        if (url.startsWith(KFTC_REDIRECT_URI)) {
            const codeMatch = url.match(/[?&]code=([^&]+)/);
            if (codeMatch) {
                const code = codeMatch[1];
                console.log("추출된 code:", code);
                setAuthCode(code);
                setStep('fetchToken');
            }
        }
    };

    // code를 받은 후 토큰 요청
    useEffect(() => {
        if (step === 'fetchToken' && authCode) {
            console.log("토큰 요청 시작 - code:", authCode);
            setLoading(true);
            fetch(TOKEN_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `code=${authCode}&client_id=${KFTC_CLIENT_ID}&client_secret=${KFTC_CLIENT_SECRET}&redirect_uri=${encodeURIComponent(
                    KFTC_REDIRECT_URI
                )}&grant_type=authorization_code`,
            })
                .then((response) => {
                    console.log("토큰 응답 수신:", response);
                    return response.json();
                })
                .then((data) => {
                    console.log("토큰 응답 데이터:", data);
                    if (data.access_token) {
                        setTokenData(data);
                        storeTokenData(data); // 토큰 저장
                        setStep('fetchAccounts');
                    } else {
                        console.error("토큰 요청 실패:", data);
                        setError('토큰 요청 실패');
                    }
                })
                .catch((err) => {
                    console.error("토큰 요청 에러:", err);
                    setError(err.message);
                })
                .finally(() => {
                    console.log("토큰 요청 완료");
                    setLoading(false);
                });
        }
    }, [step, authCode]);

    // 사용자 계좌 목록 요청 (HTTP Method를 GET으로 수정)
    useEffect(() => {
        if (step === 'fetchAccounts' && tokenData) {
            console.log("계좌 목록 요청 시작 - tokenData:", tokenData);
            setLoading(true);
            fetch(`${USER_ME_URL}?user_seq_no=${tokenData.user_seq_no}`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${tokenData.access_token}` },
            })
                .then((response) => {
                    console.log("계좌 목록 응답 수신:", response);
                    return response.json();
                })
                .then((data) => {
                    console.log("계좌 목록 응답 데이터:", data);
                    if (data.res_list) {
                        console.log("계좌 목록 성공적으로 획득");
                        setAccountList(data.res_list);
                        setStep('accountList');
                    } else {
                        console.error("계좌 목록 요청 실패:", data);
                        setError('계좌 목록 요청 실패');
                    }
                })
                .catch((err) => {
                    console.error("계좌 목록 요청 에러:", err);
                    setError(err.message);
                })
                .finally(() => {
                    console.log("계좌 목록 요청 완료");
                    setLoading(false);
                });
        }
    }, [step, tokenData]);

    // accountList와 tokenData가 준비되면 모든 계좌의 잔고를 한 번에 가져오는 useEffect
    useEffect(() => {
        if (accountList.length > 0 && tokenData) {
            const fetchAllBalances = async () => {
                let balances = [];
                await Promise.all(
                    accountList.map(async (account) => {
                        // bankTranId는 한 줄로 생성 (총 20자리)
                        const bankTranId = `${KFTC_TRAN_ID}U${Math.floor(Math.random() * 1e9)
                            .toString()
                            .padStart(9, '0')}`;
                        const tranDTime = new Date()
                            .toISOString()
                            .replace(/[-:TZ.]/g, '')
                            .slice(0, 14);
                        try {
                            const response = await fetch(
                                `${ACCOUNT_BALANCE_URL}?bank_tran_id=${bankTranId}&fintech_use_num=${account.fintech_use_num}&tran_dtime=${tranDTime}`,
                                {
                                    method: 'GET',
                                    headers: { Authorization: `Bearer ${tokenData.access_token}` },
                                }
                            );
                            const data = await response.json();
                            if (data.balance_amt !== undefined) {
                                balances.push({
                                    fintech_use_num: account.fintech_use_num,
                                    balance_amt: data.balance_amt,
                                    bank_name: data.bank_name, // 은행명 추가
                                });
                            } else {
                                balances.push({
                                    fintech_use_num: account.fintech_use_num,
                                    balance_amt: '잔고 조회 실패',
                                    bank_name: '은행 조회 실패',
                                });
                            }
                        } catch (error) {
                            console.error(`잔고 조회 실패: ${account.fintech_use_num}`, error);
                            balances.push({
                                fintech_use_num: account.fintech_use_num,
                                balance_amt: '오류',
                                bank_name: account.bank_name, // 또는 "은행 조회 실패"
                            });
                        }
                    })
                );
                setAccountBalances(balances);
            };
            fetchAllBalances();
        }
    }, [accountList, tokenData]);

    // 토큰 캐시 삭제 함수
    const handleClearToken = async () => {
        try {
            await AsyncStorage.removeItem('tokenData');
            console.log("토큰 캐시 삭제됨");
            setTokenData(null);
            setAccountList([]);
            setStep('home');
        } catch (error) {
            console.error("토큰 삭제 에러:", error);
        }
    };

    // 각 단계에 따른 화면 렌더링
    if (step === 'home') {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>금융결제원 테스트베드</Text>
                <Button title="인증하기" onPress={() => setStep('auth')} />
            </View>
        );
    }

    if (step === 'auth') {
        return (
            <WebView
                source={{ uri: AUTH_URL }}
                onNavigationStateChange={handleNavigationStateChange}
            />
        );
    }

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
                <Text>로딩 중...</Text>
            </View>
        );
    }

    if (error) {
        Alert.alert('오류', error, [{ text: '확인', onPress: () => setError(null) }]);
    }

    // 계좌 목록 화면 (잔고와 우측 출금 버튼 포함)
    if (step === 'accountList') {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>계좌 목록</Text>
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
                                    <Text style={styles.bankName}>
                                        은행명 : {balanceObj ? balanceObj.bank_name : '은행 조회 중...'}
                                    </Text>
                                    <Text style={styles.accountNumber}>
                                        계좌번호 : {item.account_num_masked || '정보없음'}
                                    </Text>
                                    <Text style={styles.balance}>
                                        잔액 : {" "}
                                        {balanceObj ? Number(balanceObj.balance_amt).toLocaleString() : '잔액 조회 중...'}
                                    </Text>
                                </View>
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity
                                        style={styles.receiveButton}
                                        onPress={() => handleReceiveMoney(item)}
                                    >
                                        <Text style={styles.receiveButtonText}>지원금 받기</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.withdrawButton}
                                        onPress={() => handleWithdraw(item)}
                                    >
                                        <Text style={styles.withdrawButtonText}>출금</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    }}
                />
                <Button title="token 캐시 초기화" onPress={handleClearToken} />
            </View>
        );
    }

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
        fontSize: 14,
        marginBottom: 2
    },
    balance: {
        fontSize: 12,
        color: '#333',
        marginTop: 2
    },
    bankName: {
        fontSize: 14,
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

export default Account;
