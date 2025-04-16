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
import {
    KFTC_CLIENT_ID,
    KFTC_CLIENT_SECRET,
    KFTC_REDIRECT_URI,
    KFTC_BASE_URL,
    KFTC_SCOPE,
    KFTC_STATE,
    KFTC_TRAN_ID,
} from '@env';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import AccountScreenGUI from './AccountScreenGUI'; // UI 관련 컴포넌트를 불러옴

// 사용자 인증을 위한 URL 생성
const AUTH_URL = `${KFTC_BASE_URL}/oauth/2.0/authorize?response_type=code&client_id=${KFTC_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    KFTC_REDIRECT_URI
)}&scope=${KFTC_SCOPE}&state=${KFTC_STATE}&auth_type=0`;

const TOKEN_URL = `${KFTC_BASE_URL}/oauth/2.0/token`;
const USER_ME_URL = `${KFTC_BASE_URL}/v2.0/user/me`;
const ACCOUNT_BALANCE_URL = `${KFTC_BASE_URL}/v2.0/account/balance/fin_num`;

const AccountScreen = () => {
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

    const [secrets, setSecrets] = useState(null);
    const [vaultError, setVaultError] = useState(null); // Vault 데이터 fetch 과정에서 발생한 에러

    useEffect(() => {
        fetch('http://10.0.2.2:3000/vault-secret') // Android 에뮬레이터의 로컬 서버 접근 IP
            .then(response => {
                if (!response.ok) {
                    throw new Error('서버 응답에 문제가 있습니다.');
                }
                return response.json();
            })
            .then(data => {
                console.log('파싱된 데이터:', JSON.stringify(data, null, 2));
                setSecrets(data); // 성공적으로 받은 Vault 비밀 정보 저장
            })
            .catch(err => {
                console.error('Vault secrets를 불러오는 중 에러 발생:', err);
                setVaultError(err); // 에러 상태 저장
            });
    }, []);

    // 로컬에 토큰 저장 및 로드 함수
    // const storeTokenData = async (data) => {
    //     try {
    //         await AsyncStorage.setItem('tokenData', JSON.stringify(data));
    //         console.log("토큰 데이터 저장 완료");
    //     } catch (err) {
    //         console.error("토큰 데이터 저장 에러:", err);
    //     }
    // };

    // const loadTokenData = async () => {
    //     try {
    //         const storedData = await AsyncStorage.getItem('tokenData');
    //         return storedData ? JSON.parse(storedData) : null;
    //     } catch (err) {
    //         console.error("토큰 데이터 로드 에러:", err);
    //         return null;
    //     }
    // };

    // 파이어베이스 토큰 저장 및 로드 (사용자 userID 없이 고정된 문서 사용)
    const storeTokenDataFirebase = async (data) => {
        try {
            const tokenDocRef = firestore().collection('tokens').doc("Token");
            const doc = await tokenDocRef.get();

            if (doc.exists) {
                const currentData = doc.data();
                // 현재 저장된 access_token과 새로 받은 access_token 비교
                if (currentData.access_token !== data.access_token) {
                    await tokenDocRef.set(data);
                    console.log("Firebase에 토큰 데이터 업데이트 완료");
                } else {
                    console.log("토큰 값이 동일하여 업데이트하지 않음");
                }
            } else {
                // 문서가 없는 경우 새로 저장
                await tokenDocRef.set(data);
                console.log("Firebase에 토큰 데이터 저장 완료");
            }
        } catch (error) {
            console.error("Firebase 토큰 데이터 저장 에러:", error);
        }
    };

    const loadTokenDataFirebase = async () => {
        try {
            const doc = await firestore().collection('tokens').doc("Token").get();
            if (doc.exists) {
                return doc.data();
            } else {
                console.log("토큰 데이터가 존재하지 않습니다.");
                return null;
            }
        } catch (error) {
            console.error("Firebase 토큰 데이터 로드 에러:", error);
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
            // const storedToken = await loadTokenData();
            const storedToken = await loadTokenDataFirebase();
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
                        // storeTokenData(data); // 토큰 저장
                        storeTokenDataFirebase(data); // 기존 storeTokenData(data) 대신 Firebase에 저장
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
                            //vault 사용 시 secrets.KFTC_TRAN_ID
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
            await firestore().collection('tokens').doc("Token").update({
                access_token: firestore.FieldValue.delete()
            });
            console.log("파이어베이스 최신 토큰 필드 삭제됨");
            setTokenData(null);
            setAccountList([]);
            setStep('home');
        } catch (error) {
            console.error("파이어베이스 토큰 필드 삭제 에러:", error);
        }
    };

    // 토큰 정말로 지울건지 물어보기
    const confirmClearToken = () => {
        Alert.alert(
            "토큰 삭제 확인",
            "정말로 파이어베이스 토큰 캐시를 삭제하시겠습니까?",
            [
                { text: "아니오", style: "cancel" },
                { text: "예", onPress: handleClearToken }
            ],
            { cancelable: false }
        );
    };

    const handleWithdraw = () => { };

    return (
        <AccountScreenGUI
            step={step}
            setStep={setStep}
            AUTH_URL={AUTH_URL}
            handleNavigationStateChange={handleNavigationStateChange}
            loading={loading}
            accountList={accountList}
            accountBalances={accountBalances}
            handleReceiveMoney={handleReceiveMoney}
            handleWithdraw={handleWithdraw}
            confirmClearToken={confirmClearToken}
        />
    );
}

export default AccountScreen;
