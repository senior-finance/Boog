import React, { useState, useEffect, useMemo } from 'react';
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
import { db } from '../../database/firebase'; // Firebase 설정을 불러옴
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AccountScreenGUI from './AccountScreenGUI'; // UI 관련 컴포넌트를 불러옴
import {
  // kmj
  KFTC_CLIENT_ID_KMJ,
  KFTC_CLIENT_SECRET_KMJ,
  KFTC_TRAN_ID_KMJ,

  // hwc
  KFTC_CLIENT_ID_HWC,
  KFTC_CLIENT_SECRET_HWC,
  KFTC_TRAN_ID_HWC,

  // 공통
  KFTC_REDIRECT_URI,
  KFTC_BASE_URL,
  KFTC_SCOPE,
  KFTC_STATE,
} from '@env';
export const CONFIG = {
  kmj: {
    dbName: 'kmj',
    CLIENT_ID: KFTC_CLIENT_ID_KMJ,
    CLIENT_SECRET: KFTC_CLIENT_SECRET_KMJ,
    TRAN_ID: KFTC_TRAN_ID_KMJ,
  },
  hwc: {
    dbName: 'hwc',
    CLIENT_ID: KFTC_CLIENT_ID_HWC,
    CLIENT_SECRET: KFTC_CLIENT_SECRET_HWC,
    TRAN_ID: KFTC_TRAN_ID_HWC,
  },
};

// 계정별 Firebase 문서 ID 반환 (kmj → "Token", hwc → "Token2")
const getTokenDocId = account => account === 'hwc' ? 'Token2' : 'Token';

// 사용자 인증을 위한 URL 생성
// const AUTH_URL = `${baseUrl}/oauth/2.0/authorize?response_type=code&client_id=${KFTC_CLIENT_ID}&redirect_uri=${encodeURIComponent(
//   KFTC_REDIRECT_URI,
// )}&scope=${KFTC_SCOPE}&state=${KFTC_STATE}&auth_type=0`;

// const TOKEN_URL = `${baseUrl}/oauth/2.0/token`;
// const USER_ME_URL = `${baseUrl}/v2.0/user/me`;
// const ACCOUNT_BALANCE_URL = `${baseUrl}/v2.0/account/balance/fin_num`;

const AccountScreen = () => {
  // 상태 관리: 각 단계별 진행상태
  const [step, setStep] = useState('home');
  // home, auth, fetchToken, fetchAccounts, accountList, fetchBalance, balance
  const [authCode, setAuthCode] = useState(null);
  const [tokenData, setTokenData] = useState(null);
  const [accountList, setAccountList] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [balanceData, setBalanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accountBalances, setAccountBalances] = useState([]);

  const [accountId, setAccountId] = useState('');
  const [amount, setAmount] = useState('');

  const [secrets, setSecrets] = useState(null);
  const [vaultError, setVaultError] = useState(null); // Vault 데이터 fetch 과정에서 발생한 에러

  const [testBedAccount, setTestBedAccount] = useState('');
  const cfg = CONFIG[testBedAccount] || {};

  // base URL 슬래시 제거는 한 번만
  const baseUrl = useMemo(
    () => KFTC_BASE_URL.replace(/\/+$/, ''),
    []
  );

  // 계정별로 동적 생성되는 URL들
  const AUTH_URL = useMemo(() => {
    if (!cfg.CLIENT_ID) return null;
    return (
      `${baseUrl}/oauth/2.0/authorize?` +
      `response_type=code` +
      `&client_id=${cfg.CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(KFTC_REDIRECT_URI)}` +
      `&scope=${KFTC_SCOPE}` +
      `&state=${KFTC_STATE}` +
      `&txnid=${cfg.TRAN_ID}`
    );
  }, [baseUrl, cfg]);

  const TOKEN_URL = `${baseUrl}/oauth/2.0/token`;
  const USER_ME_URL = `${baseUrl}/v2.0/user/me`;
  const ACCOUNT_BALANCE_URL = `${baseUrl}/v2.0/account/balance/fin_num`;

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
        // console.error('Vault secrets를 불러오는 중 에러 발생:', err);
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

  // 파이어베이스 토큰 저장 (account, data 순서)
  const storeTokenDataFirebase = async (account, data) => {
    try {
      const tokensColRef = collection(db, 'tokens');
      const docId = getTokenDocId(account);
      const tokenDocRef = doc(tokensColRef, docId);
      const snap = await getDoc(tokenDocRef);

      if (snap.exists()) {
        const currentData = snap.data();
        if (currentData.access_token !== data.access_token) {
          await setDoc(tokenDocRef, data);
          console.log(`${account}: Firebase에 토큰 데이터 업데이트 완료`);
        } else {
          console.log(`${account}: 토큰 값이 동일하여 업데이트하지 않음`);
        }
      } else {
        await setDoc(tokenDocRef, data);
        console.log(`${account}: Firebase에 토큰 데이터 저장 완료`);
      }
    } catch (error) {
      console.error(`${account}: Firebase 토큰 데이터 저장 에러:`, error);
    }
  };

  // 파이어베이스 토큰 로드 (account 인자 추가)
  const loadTokenDataFirebase = async account => {
    try {
      const docId = getTokenDocId(account);
      const tokenDocRef = doc(db, 'tokens', docId);
      const snap = await getDoc(tokenDocRef);

      if (snap.exists()) {
        return snap.data();
      } else {
        console.log(`${account}: 토큰 데이터가 존재하지 않습니다.`);
        return null;
      }
    } catch (error) {
      console.error(`${account}: Firebase 토큰 데이터 로드 에러:`, error);
      return null;
    }
  }

  // 잔고 데이터를 업데이트할 함수
  const handleReceiveMoney = item => {
    setAccountBalances(prevBalances => {
      // 해당 계좌가 이미 존재하는지 인덱스를 찾습니다.
      const index = prevBalances.findIndex(
        b => b.fintech_use_num === item.fintech_use_num,
      );
      if (index !== -1) {
        // 기존 항목이 있으면, balance_amt를 업데이트합니다.
        const updatedBalance =
          Number(prevBalances[index].balance_amt || 0) + 100000;
        return prevBalances.map((b, i) =>
          i === index ? { ...b, balance_amt: updatedBalance } : b,
        );
      } else {
        // 해당 계좌 항목이 없으면 새 항목을 추가합니다.
        return [
          ...prevBalances,
          {
            fintech_use_num: item.fintech_use_num,
            balance_amt: 100000,
            bank_name: item.bank_name || '알 수 없음',
          },
        ];
      }
    });
  };

  // 앱 시작 시 저장된 토큰 로드
  useEffect(() => {
    (async () => {
      // 아직 계정이 선택되지 않았으면 아무 것도 하지 않음
      if (!testBedAccount) {
        return;
      }
      // 1) testBedAccount가 'kmj'나 'hwc'가 아니면 바로 리턴
      if (!['kmj', 'hwc'].includes(testBedAccount)) {
        console.warn('토큰이 저장된 문서를 찾을 수 없습니다');
        return;
      }
      // 2) Firebase에서 토큰 불러오기
      const storedToken = await loadTokenDataFirebase(testBedAccount);

      // 3) 유효한 토큰이 있으면 다음 단계로
      if (storedToken?.access_token) {
        console.log(`${testBedAccount} 사용자로 접속 합니다...`);
        console.log(
          '저장된 토큰 데이터 로드:',
          storedToken.access_token.substring(0, 20) + '…'
        );
        setTokenData(storedToken);
        setStep('fetchAccounts');
      } else {
        // 토큰이 없거나 만료된 경우, 초기 화면으로
        console.log('저장된 토큰이 없거나 만료되어 인증 화면으로 이동합니다');
        setStep('auth');
      }
    })();
  }, [testBedAccount]);

  // WebView의 URL 변경 감지: 리다이렉트 URL에서 code 추출
  const handleNavigationStateChange = navState => {
    const { url } = navState;
    console.log('URL 변경됨:', url.substring(0, 20) + '...');
    if (url.startsWith(KFTC_REDIRECT_URI)) {
      const codeMatch = url.match(/[?&]code=([^&]+)/);
      if (codeMatch) {
        const code = codeMatch[1];
        console.log('추출된 code:', code.substring(0, 20) + '...');
        setAuthCode(code);
        setStep('fetchToken');
      }
    }
  };

  // code 받은 이후 토큰 요청하기
  useEffect(() => {
    if (step === 'fetchToken' && authCode && cfg.CLIENT_ID) {
      console.log('토큰 요청 시작 - code:', authCode.substring(0, 20) + '…');
      setLoading(true);

      const bodyParams = new URLSearchParams({
        code: authCode,
        client_id: cfg.CLIENT_ID,
        client_secret: cfg.CLIENT_SECRET,
        redirect_uri: KFTC_REDIRECT_URI,
        grant_type: 'authorization_code',
        txnid: cfg.TRAN_ID,
      });

      fetch(TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: bodyParams.toString(),
      })
        .then(async response => {
          const text = await response.clone().text();
          console.log('토큰 응답(raw):', text.substring(0, 100) + '…');
          return response.json();
        })
        .then(async data => {
          console.log('토큰 응답 데이터:', JSON.stringify(data).substring(0, 100) + '…');
          if (data.access_token) {
            setTokenData(data);
            // 계정별 Firebase 문서에 저장
            await storeTokenDataFirebase(testBedAccount, data);
            setStep('fetchAccounts');
          } else {
            console.error('토큰 요청 실패:', JSON.stringify(data));
            setError('토큰 요청 실패');
          }
        })
        .catch(err => {
          console.error('토큰 요청 에러:', err);
          setError(err.message);
        })
        .finally(() => {
          console.log('토큰 요청 완료');
          setLoading(false);
        });
    }
  }, [step, authCode, cfg, TOKEN_URL]);

  // 사용자 계좌 목록 요청 (HTTP Method를 GET으로 수정)
  useEffect(() => {
    if (step === 'fetchAccounts' && tokenData) {
      console.log(
        '계좌 목록 요청 시작 _ tokenData:',
        tokenData.user_seq_no.substring(0, 20) + '...',
      );
      setLoading(true);
      fetch(`${USER_ME_URL}?user_seq_no=${tokenData.user_seq_no}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      })
        .then(response => {
          console.log('계좌 목록 응답 수신:', response.status);
          return response.json();
        })
        .then(data => {
          // console.log('계좌 목록 응답 데이터:', data);
          if (data.res_list) {
            console.log('계좌 목록 성공적으로 획득');
            setAccountList(data.res_list);
            setStep('accountList');
          } else {
            console.error('계좌 목록 요청 실패:', data);
            setError('계좌 목록 요청 실패');
          }
        })
        .catch(err => {
          console.error('계좌 목록 요청 에러:', err);
          setError(err.message);
        })
        .finally(() => {
          console.log('계좌 목록 가져오기 완료');
          setLoading(false);
        });
    }
  }, [step, tokenData]);

  // accountList와 tokenData가 준비되면 모든 계좌의 잔고를 한 번에 가져오는 useEffect
  useEffect(() => {
    if (!accountList.length || !tokenData || !cfg.TRAN_ID) return;

    // 단일 계좌 잔액 조회 함수
    const fetchBalance = async account => {
      const random9 = Math.floor(Math.random() * 1e9)
        .toString()
        .padStart(9, '0');
      const bankTranId = `${cfg.TRAN_ID}U${random9}`;
      const tranDTime = new Date()
        .toISOString()
        .replace(/[-:TZ.]/g, '')
        .slice(0, 14);

      try {
        const res = await fetch(
          `${ACCOUNT_BALANCE_URL}` +
          `?bank_tran_id=${bankTranId}` +
          `&fintech_use_num=${account.fintech_use_num}` +
          `&tran_dtime=${tranDTime}`,
          {
            method: 'GET',
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
          }
        );
        const data = await res.json();
        return {
          fintech_use_num: account.fintech_use_num,
          balance_amt: data.balance_amt ?? '잔고 조회 실패',
          bank_name: data.bank_name ?? '은행 조회 실패',
        };
      } catch (error) {
        console.error(`잔고 조회 실패: ${account.fintech_use_num}`, error);
        return {
          fintech_use_num: account.fintech_use_num,
          balance_amt: '오류',
          bank_name: account.bank_name || '은행 조회 실패',
        };
      }
    };

    // 병렬 동시 요청 수 제한(예: 3개씩)
    const fetchAllBalances = async () => {
      const concurrency = 3;
      const results = [];
      for (let i = 0; i < accountList.length; i += concurrency) {
        const batch = accountList.slice(i, i + concurrency);
        // 한 번에 최대 concurrency 개의 요청만 실행
        const partial = await Promise.all(batch.map(fetchBalance));
        results.push(...partial);
        // (선택) 서버 과부하 방지를 위해 약간 대기
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      setAccountBalances(results);
    };

    fetchAllBalances();
  }, [accountList, tokenData, cfg.TRAN_ID, ACCOUNT_BALANCE_URL]);


  // 토큰 캐시 삭제 함수
  const handleClearToken = async () => {
    try {
      // 계정에 맞는 문서 ID(Token or Token2) 획득
      const docId = getTokenDocId(testBedAccount);
      const tokenDocRef = doc(db, 'tokens', docId);

      // 해당 문서의 access_token 필드만 삭제
      await updateDoc(tokenDocRef, {
        access_token: deleteField(),
      });

      console.log(`${testBedAccount}: Firebase ${docId} 문서의 access_token 필드 삭제됨`);
      setTokenData(null);
      setAccountList([]);
      setStep('home');
    } catch (error) {
      console.error(`${testBedAccount}: Firebase 토큰 삭제 에러:`, error);
    }
  };

  // 토큰 정말로 지울건지 물어보기
  const confirmClearToken = () => {
    Alert.alert(
      '토큰 삭제 확인',
      '정말로 파이어베이스 토큰 캐시를 삭제하시겠습니까?',
      [
        { text: '아니오', style: 'cancel' },
        { text: '예', onPress: handleClearToken },
      ],
      { cancelable: false },
    );
  };

  // 로컬 Express 서버 호출 함수
  // const writeWithdraw = async (accountId, amount) => {
  //   const API_URL = `http://10.0.2.2:3000/withdraw`;
  //   const res = await fetch(API_URL, {
  //     method: 'POST',
  //     headers: {'Content-Type': 'application/json'},
  //     body: JSON.stringify({accountId, amount}),
  //   });
  //   const json = await res.json();
  //   if (!res.ok || !json.insertedId) {
  //     const errMsg = json.error || JSON.stringify(json);
  //     throw new Error(`서버 오류: ${errMsg}`);
  //   }
  //   return json.insertedId;
  // };

  // 버튼 클릭 핸들러
  const handleWithdraw = async () => {
    // 테스트용 state 업데이트
    setAccountId('accountId TEST');
    setAmount('123456789');

    if (!accountId.trim() || Number(amount) <= 0) {
      Alert.alert('입력 오류', '유효한 계좌 ID와 금액을 입력해주세요.');
      return;
    }
    try {
      const newId = await writeWithdraw(accountId.trim(), parseFloat(amount));
      Alert.alert('출금 기록 생성됨', `ID: ${newId}`);
    } catch (err) {
      console.error('✖️ writeWithdraw 실패:', err);
      Alert.alert('오류 발생', err.message);
    }
  };

  return (
    <AccountScreenGUI
      CONFIG={CONFIG}
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
      testBedAccount={testBedAccount}
      setTestBedAccount={setTestBedAccount}
    />
  );
};

export default AccountScreen;
