import axios from 'axios';
import { MONGODB_BACKEND_URL } from '@env';

const API_BASE = MONGODB_BACKEND_URL;

// 공통 MongoDB API 호출 헬퍼 함수
export async function mongoDB(action, dbName, collName, params) {
  try {
    console.log('📡 요청 보냄:', action, dbName, collName, params);
    const res = await axios.post(
      `${API_BASE}api/${action}`,
      { dbName, collName, params },
      { headers: { 'Content-Type': 'application/json' } }
    );
    const { success, result, error } = res.data;
    if (!success) throw new Error(error);
    return result;
  } catch (err) {
    console.error(`[❌ mongoDB:${action}] 오류`, err?.response?.data || err.message);
    throw err;
  }
}

// === 입금 전용 deposit 함수 (로그남기 + 잔액 차감) ===
export async function deposit(dbName, accountId, accountBank, amount) {
  const logId = await mongoDB(
    'insertOne',
    'bank',
    'deposit',
    { document: { dbName, accountId, accountBank, amount, createdAt: new Date() } }
  );
  try {
    await mongoDB(
      'updateOne',
      dbName,
      'account',
      {
        filter: { accountId },
        update: { $inc: { amount: +amount } }
      }
    );
  } catch (err) {
    console.error('▶ updateOne failed:', err?.response?.status, err?.response?.data);
  }
  return logId;
}

// === 출금 전용 withdraw 함수 (로그남기 + 잔액 차감) ===
export async function withdraw(dbName, accountId, accountBank, amount) {
  const logId = await mongoDB(
    'insertOne',
    'bank',
    'withdraw',
    { document: { dbName, accountId, accountBank, amount, createdAt: new Date() } }
  );
  try {
    await mongoDB(
      'updateOne',
      dbName,
      'account',
      {
        filter: { accountId },
        update: { $inc: { amount: -amount } }
      }
    );
  } catch (err) {
    console.error('▶ updateOne failed:', err?.response?.status, err?.response?.data);
  }
  return logId;
}

// === 계좌 정보 Upsert ===
export async function accountUpsert(userName, accountId, accountBank, amount) {
  const accountNum = accountId.slice(-10);
  const result = await mongoDB(
    'updateOne',
    `${userName}`,
    'account',
    {
      filter: { accountId },
      update: {
        $set: { accountNum, userName, accountBank, amount },
        $setOnInsert: { createdAt: new Date() }
      },
      options: { upsert: true }
    }
  );
  return result.upsertedId || null;
}

// === 계좌 정보 조회 ===
export async function accountGet(userName, accountId) {
  try {
    const res = await mongoDB(
      'find',
      userName,
      'account',
      { query: { accountId } }
    );

    let docs = [];
    if (Array.isArray(res)) {
      docs = res;
    } else if (Array.isArray(res.documents)) {
      docs = res.documents;
    }

    const doc = docs[0];
    if (!doc) return null;

    const { accountNum, amount, accountBank } = doc;
    return { accountNum, amount, accountBank };
  } catch (err) {
    console.error('accountGet 실패:', err);
    return null;
  }
}

// === 전체 출금 기록 조회 ===
export async function accountGetAll(userName) {
  return await mongoDB('find', 'bank', 'withdraw', { query: {} });
}

// === 알림 저장 ===
export async function addNotification(userId, icon, iconColor, borderColor, content) {
  return await mongoDB('insertOne', 'info', 'notify', {
    document: {
      userId,
      icon,
      iconColor,
      borderColor,
      content,
      createdAt: new Date(),
    },
  });
}

// === 알림 조회 ===
export async function getNotifications(userId) {
  const res = await mongoDB('find', 'info', 'notify', {
    query: { userId },
    options: { sort: { createdAt: -1 } },
  });

  if (Array.isArray(res)) return res;
  if (Array.isArray(res.documents)) return res.documents;
  return [];
}
