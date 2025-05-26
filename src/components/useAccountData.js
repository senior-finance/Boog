import { useState, useEffect, useMemo } from 'react';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../database/firebase';
import { CONFIG } from '../screens/Account/AccountScreen';
import { useUser } from '../screens/Login/UserContext';
import axios from 'axios';
import {
  mongoDB,
  accountUpsert,
  accountGet,
} from '../database/mongoDB';  // 위에서 작성한 mongoDB, accountUpsert, accountGet 함수들
import {
  KFTC_BASE_URL,
  KFTC_REDIRECT_URI,
  KFTC_SCOPE,
  KFTC_STATE,
} from '@env';

export function useAccountData(testBedAccount) {
  const { userInfo } = useUser();        // userInfo.dbName: 몽고DB에서 사용하는 DB 이름
  const dbName = userInfo?.dbName;      // 예: 'kmj' 또는 'hwc'
  const [tokenData, setTokenData] = useState(null);
  const [accountList, setAccountList] = useState([]);
  const [rawBalances, setRawBalances] = useState([]);   // API에서 받은 순수 데이터
  const [mergedData, setMergedData] = useState([]);     // API + Mongo 결과 병합
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cfg = CONFIG[testBedAccount] || {};
  const baseUrl = useMemo(() => KFTC_BASE_URL.replace(/\/+$/, ''), []);
  const USER_ME_URL = `${baseUrl}/v2.0/user/me`;
  const ACCOUNT_BALANCE_URL = `${baseUrl}/v2.0/account/balance/fin_num`;

  // 1) Firebase에 저장된 토큰 로드
  useEffect(() => {
    if (!['kmj','hwc'].includes(testBedAccount)) return;
    (async () => {
      setLoading(true);
      try {
        const docId = testBedAccount==='hwc' ? 'Token2' : 'Token';
        const snap = await getDoc(doc(db,'tokens',docId));
        if (snap.exists()) setTokenData(snap.data());
      } catch(e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [testBedAccount]);

  // 2) 계좌 목록 조회
  useEffect(() => {
    if (!tokenData?.access_token) return;
    setLoading(true);
    fetch(`${USER_ME_URL}?user_seq_no=${tokenData.user_seq_no}`, {
      headers:{ Authorization:`Bearer ${tokenData.access_token}` }
    })
      .then(r=>r.json())
      .then(data => {
        if (data.res_list) setAccountList(data.res_list);
        else throw new Error('계좌 목록 응답 에러');
      })
      .catch(e=>setError(e))
      .finally(()=>setLoading(false));
  }, [tokenData]);

  // 3) 잔고 병렬 조회 (API)
  useEffect(() => {
    if (!accountList.length || !tokenData?.access_token) return;
    const fetchBalance = async account => {
      const rand = Math.floor(Math.random()*1e9).toString().padStart(9,'0');
      const bankTranId = `${cfg.TRAN_ID}U${rand}`;
      const tranDTime = new Date().toISOString().replace(/[-:TZ.]/g,'').slice(0,14);
      try {
        const res = await fetch(
          `${ACCOUNT_BALANCE_URL}?bank_tran_id=${bankTranId}`+
          `&fintech_use_num=${account.fintech_use_num}`+
          `&tran_dtime=${tranDTime}`,
          { headers:{ Authorization:`Bearer ${tokenData.access_token}` } }
        );
        const d = await res.json();
        return {
          fintech_use_num: account.fintech_use_num,
          balance_amt: d.balance_amt,
          bank_name:  d.bank_name,
          bank_num:   account.fintech_use_num.slice(-10),
        };
      } catch {
        return {
          fintech_use_num: account.fintech_use_num,
          balance_amt: '조회실패',
          bank_name: account.bank_name,
          bank_num: account.fintech_use_num.slice(-10),
        };
      }
    };

    (async () => {
      setLoading(true);
      try {
        const batches = [];
        const concurrency = 3;
        for (let i=0; i<accountList.length; i+=concurrency) {
          const part = await Promise.all(
            accountList.slice(i,i+concurrency).map(fetchBalance)
          );
          batches.push(...part);
          await new Promise(res=>setTimeout(res,200));
        }
        setRawBalances(batches);
      } catch(e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [accountList, tokenData]);

  // 4) rawBalances → MongoDB에 upsert + 로컬 데이터 fetch → mergedData 생성
  useEffect(() => {
    if (!dbName || !rawBalances.length) return;
    (async () => {
      setLoading(true);
      try {
        const merged = await Promise.all(rawBalances.map(async rec => {
          // (1) 몽고DB에 최신 잔고 동기화
          await accountUpsert(dbName, rec.fintech_use_num, rec.bank_name, rec.balance_amt);
          // (2) 동기화된 로컬 정보 조회
          const local = await accountGet(dbName, rec.fintech_use_num) || {};
          return {
            ...rec,
            accountNum:  local.accountNum,    // 몽고에 저장된 뒤 10자리
            localAmount: local.amount,        // 몽고에 기록된 잔액
          };
        }));
        setMergedData(merged);
      } catch(e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [rawBalances, dbName]);

  return { data: mergedData, loading, error };
}