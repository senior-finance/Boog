// client 함수에서 MongoDB에 액션을 요청하는 헬퍼 함수입니다.
// 액션은 insertOne, find, updateOne, deleteOne 등입니다.
// 액션에 따라 params의 형태가 달라집니다. 예를 들어, find는 query, updateOne은 filter와 update가 필요합니다.
// 액션별로 필요한 params를 확인하고 사용하세요.
import axios from 'axios';
import { MONGODB_BACKEND_URL } from '@env';

const API_BASE = MONGODB_BACKEND_URL;
/**
 * @param {string} action      insertOne, find, updateOne, deleteOne...
 * @param {string} dbName      DB 이름
 * @param {string} collName    컬렉션 이름
 * @param {object} params      액션별 파라미터 객체
 * @returns {Promise<any>}
 */

// 아래 함수는 커스텀 헬퍼 함수입니다. 액션에 따라 params의 형태가 달라집니다.
// 액션별로 필요한 params를 확인하고 사용하세요.
// 사용법 : mongoDB('insertOne', 'your-db-name', 'your-collection-name', { document: { name: 'John Doe' } }
// 공통 MongoDB API 호출 헬퍼 함수
export async function mongoDB(action, dbName, collName, params) {
  try {
    console.log('📡 요청 보냄:', action, dbName, collName, params);
    const res = await axios.post(
      `${API_BASE}api/${action}`,
      // 슬래시 중복 여부를 항상 조심하자...
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
// 
// 이하 함수는 자주 쓰는 헬퍼 함수입니다
// 
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
/**
 * userName DB 안의 account 컬렉션에서
 * accountId 에 해당하는 문서를 찾아 반환
 * @param {string} userName - dbName 으로도 사용
 * @param {string} accountId - fintech_use_num
 * @returns {{ accountNum: string, amount: number } | null}
 */
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

// === 퀴즈 관련 함수 ===
/**
 * @param {object} filter   - MongoDB 쿼리 필터 (기본: {})
 * @param {object} options  - find 옵션 (projection, sort 등, 기본: {})
 * @returns {Promise<Array>} - 조회된 문서 배열
 */

// 쉬운 퀴즈 불러오기
export async function getEasyQuiz() {
  return await mongoDB('find', 'learn', 'easyQuiz', {});  
}

// 어려운 퀴즈 불러오기
export async function getHardQuiz() {
  return await mongoDB('find', 'learn', 'hardQuiz', {});
}