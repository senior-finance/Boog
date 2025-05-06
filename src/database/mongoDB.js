// client 함수에서 MongoDB에 액션을 요청하는 헬퍼 함수입니다.
// 액션은 insertOne, find, updateOne, deleteOne 등입니다.
// 액션에 따라 params의 형태가 달라집니다. 예를 들어, find는 query, updateOne은 filter와 update가 필요합니다.
// 액션별로 필요한 params를 확인하고 사용하세요.

const API_BASE = process.env.SERVER_URL || 'http://10.0.2.2:3000';

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
  const res = await fetch(`${API_BASE}/api/${action}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dbName, collName, params })
  });
  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error);
  }
  return json.result;
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
