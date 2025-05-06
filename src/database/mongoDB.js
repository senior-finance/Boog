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
// === ex 출금 전용 헬퍼 ===
export async function withdraw(accountId, accountName, amount) {
  const result = await mongoDB(
    'insertOne', // 액션
    'bank', // DB 이름
    'withdraw', // 컬렉션 이름
    { document: { accountId, accountName, amount, createdAt: new Date() } }
  );
  // result.insertedId 반환
  return result.insertedId;
}
