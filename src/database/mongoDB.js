// client 함수에서 MongoDB에 액션을 요청하는 헬퍼 함수입니다.
// 액션은 insertOne, find, updateOne, deleteOne 등입니다.
// 액션에 따라 params의 형태가 달라집니다. 예를 들어, find는 query, updateOne은 filter와 update가 필요합니다.
// 액션별로 필요한 params를 확인하고 사용하세요.
import axios from 'axios';
import { MONGODB_BACKEND_URL } from '@env'

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
export async function mongoDB(action, dbName, collName, params) {
  try {
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
    // 네트워크 에러나 서버 오류 모두 여기로 잡힙니다.
    console.error(`[mongoDB:${action}]`, err);
    throw err;
  }
}

// 이하 함수는 자주 쓰는 헬퍼 함수입니다

// === 입금 전용 deposit 함수 (로그남기 + 잔액 차감) ===
export async function deposit(dbName, accountId, accountBank, amount) {
  // 1) 거래 로그 남기기
  // console.log(dbName.dbName)
  const logId = await mongoDB(
    'insertOne',
    'bank',       // 로그는 bank DB 안에
    'deposit',   // deposit 컬렉션
    { document: { dbName, accountId, accountBank, amount, createdAt: new Date() } }
  );
  // 2) account 컬렉션에서 amount 증감하기
  try {
    await mongoDB(
      'updateOne',
      dbName,       // 사용자별 DB 이름 (예: 'kmj' 등)
      'account',    // account 컬렉션
      {
        filter: { accountId },
        update: { $inc: { amount: +amount } }
      }
    );
  } catch (err) {
    console.error('▶ updateOne failed:', err.response?.status, err.response?.data);
  }
  return logId;
}

// === 출금 전용 withdraw 함수 (로그남기 + 잔액 차감) ===
export async function withdraw(dbName, accountId, accountBank, amount) {
  // 1) 거래 로그 남기기
  // console.log(dbName.dbName)
  const logId = await mongoDB(
    'insertOne',
    'bank',       // 로그는 bank DB 안에
    'withdraw',   // withdraw 컬렉션
    { document: { dbName, accountId, accountBank, amount, createdAt: new Date() } }
  );
  // 2) account 컬렉션에서 amount 차감하기
  try {
    await mongoDB(
      'updateOne',
      dbName,       // 사용자별 DB 이름 (예: 'kmj' 등)
      'account',    // account 컬렉션
      {
        filter: { accountId },
        update: { $inc: { amount: -amount } }
      }
    );
  } catch (err) {
    console.error('▶ updateOne failed:', err.response?.status, err.response?.data);
  }
  return logId;
}

// === DB에 계좌 정보 Upsert 함수 ===
export async function accountUpsert(userName, accountId, accountBank, amount) {
  // 임의 계좌 번호 부여 accountId 뒤 10글자
  const accountNum = accountId.slice(-10);
  const result = await mongoDB(
    'updateOne',               // 액션을 updateOne으로 변경
    `${userName}`,                        // cfg.js에 설정된 DB 이름 사용
    'account',                 // 컬렉션 이름
    {
      filter: { accountId },   // accountId가 일치하는 문서 찾기
      update: {
        $set: { accountNum, userName, accountBank, amount },
        $setOnInsert: { createdAt: new Date() }
      },
      options: { upsert: true } // 문서가 없으면 새로 삽입
    }
  );
  // upsert 결과: 
  // - 기존 문서 갱신 시 result.modifiedCount
  // - 새로 삽입 시 result.upsertedId
  return result.upsertedId || null;
}

// === DB에서 계좌번호, 금액 가져오는 함수 ===
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

    // 헬퍼 반환 형태에 따라 배열 또는 documents 필드 처리
    let docs = [];
    if (Array.isArray(res)) {
      docs = res;
    } else if (Array.isArray(res.documents)) {
      docs = res.documents;
    }

    const doc = docs[0];
    if (!doc) return null;
    // 헬퍼 결과 형식에 따라 조정하세요.
    // 예시) res.document = { accountId, accountNum, amount, … }
    // console.log('1 accountGet 결과:', res);

    // 여기서 반드시 **객체**를 반환해야 합니다!
    const { accountNum, amount, accountBank } = doc;
    return { accountNum, amount, accountBank };
  } catch (err) {
    console.error('accountGet 실패:', err);
    return null;
  }
}

// 전체 컬렉션 내역 불러오기
export async function accountGetAll(userName) {
  return await mongoDB('find', 'bank', 'withdraw', { query: {} });
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