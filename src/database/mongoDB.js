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
    // console.log('요청 보냄:', action, dbName, collName, params);
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
    console.log(`[mongoDB:${action}] 오류`, err?.response?.data || err.message);
    throw err;
  }
}
// 
// 이하 함수는 자주 쓰는 헬퍼 함수입니다
// 
// === 입금 전용 deposit 함수 (로그남기 + 잔액 증가 + trans에도 기록) ===
export async function deposit(
  dbName,
  accountNum,
  accountBank,
  amount,
  counterpartyAccountNum,      // 추가
  counterpartyAccountBank      // 추가
) {
  const numeric = Number(amount);

  // 1) bank.deposit 컬렉션에 로그 남기기
  const logId = await mongoDB(
    'insertOne',
    'bank',
    'deposit',
    {
      document: {
        dbName,
        accountNum,
        accountBank,
        amount: numeric,
        createdAt: new Date()
      }
    }
  );

  try {
    // 2) account 컬렉션에서 잔액 증가
    await mongoDB(
      'updateOne',
      dbName,
      'account',
      {
        filter: { accountNum },
        update: { $inc: { amount: numeric } }
      }
    );

    // 3) trans 컬렉션에도 거래내역 기록 (입금)
    await mongoDB('insertOne', dbName, 'trans', {
      document: {
        accountNum,
        accountBank,
        counterpartyAccountNum,       // 상대방 계좌
        counterpartyAccountBank,      // 상대방 은행
        type: 'deposit',
        amount: numeric,
        createdAt: new Date()
      }
    });
    
  } catch (err) {
    console.log('▶ updateOne or trans insert failed:', err?.response?.status, err?.response?.data);
    // 필요 시 롤백 로직 추가 가능
  }

  return logId;
}

// === 출금 전용 withdraw 함수 (로그남기 + 잔액 차감 + trans에도 기록) ===
export async function withdraw(
  dbName,
  accountNum,
  accountBank,
  amount,
  counterpartyAccountNum,      // 추가
  counterpartyAccountBank      // 추가
) {
  const numeric = Number(amount);
  // 1) bank.withdraw 컬렉션에 로그 남기기
  const logId = await mongoDB(
    'insertOne',
    'bank',
    'withdraw',
    {
      document: {
        dbName,
        accountNum,
        accountBank,
        amount: numeric,
        createdAt: new Date()
      }
    }
  );
  try {
    // 2) account 컬렉션에서 잔액 차감
    await mongoDB(
      'updateOne',
      dbName,
      'account',
      {
        filter: { accountNum },
        update: { $inc: { amount: -numeric } }
      }
    );

    // 3) trans 컬렉션에도 거래내역 기록 (출금)
    await mongoDB('insertOne', dbName, 'trans', {
      document: {
        accountNum,
        accountBank,
        counterpartyAccountNum,       // 상대방 계좌
        counterpartyAccountBank,      // 상대방 은행
        type: 'withdraw',
        amount: numeric,
        createdAt: new Date()
      }
    });

  } catch (err) {
    // console.log('▶ updateOne or trans insert failed:', err?.response?.status, err?.response?.data);
    // 필요하다면 여기서 롤백 로직 추가 가능
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
        // 메타 정보만 갱신
        $set: { accountNum, userName, accountBank },
        // 최초 문서가 없을 때만 amount 필드와 생성일을 설정
        $setOnInsert: {
          amount: Number(amount),
          createdAt: new Date(),
        }
      },
      options: { upsert: true }
    }
  );
  return result.upsertedId || null;
}

// === 계좌 정보 조회 ===
export async function accountGet(userName, accountId) {
  try {
    const res = await mongoDB('find', userName, 'account', { query: { accountId } });

    // res 혹은 res.documents 에서 docs 배열 뽑기
    const docs = Array.isArray(res)
      ? res
      : Array.isArray(res.documents)
        ? res.documents
        : [];

    const record = docs[0];
    if (!record) return null;

    // ① 원본 amount 값
    let rawAmt = record.amount;

    // ② MongoDB Decimal128 JSON 직렬화 형태 처리
    if (rawAmt && typeof rawAmt === 'object' && '$numberDecimal' in rawAmt) {
      rawAmt = rawAmt.$numberDecimal;
    }

    // ③ 숫자로 변환
    const amountNum = Number(rawAmt);
    const amount = isNaN(amountNum) ? 0 : amountNum;

    return {
      accountNum: record.accountNum,
      accountBank: record.accountBank,
      amount,               // JS 숫자
    };
  } catch (err) {
    console.log('accountGet 실패:', err);
    return null;
  }
}

// === 전체 거래 기록 조회 ===
export async function accountGetAll(dbName) {
  if (!dbName) {
    return { success: false, error: 'dbName이 제공되지 않았습니다.' };
  }
  // 'transactions' 컬렉션 이름은 실제 스키마에 맞게 조정하세요
  return await mongoDB('find', dbName, 'trans', { query: {} });
}

// accountNum과 accountBank 모두 선택적(optional) 파라미터로 처리
export async function withdrawVerify({ accountNum, accountBank }) {
  // 공통 쿼리 조건 구성
  const query = {};
  if (accountNum) {
    query.accountNum = accountNum;
  }
  if (accountBank) {
    const prefix = accountBank.slice(0, -2);
    query.accountBank = { $regex: `^${prefix}` };
  }

  // kmj, hwc count 컬렉션을 병렬 조회
  const [kmjResults, hwcResults] = await Promise.all([
    mongoDB('find', 'kmj', 'account', { query }),
    mongoDB('find', 'hwc', 'account', { query }),
  ]);

  // 각 결과에 source 필드 추가
  const annotatedKmj = kmjResults.map(doc => ({ ...doc, source: 'kmj' }));
  const annotatedHwc = hwcResults.map(doc => ({ ...doc, source: 'hwc' }));

  // 둘을 합쳐 반환
  return [...annotatedKmj, ...annotatedHwc];
}

// === 알림 저장 (옵션 객체 전용) ===
export async function addNotification(
  userId,
  {
    icon = 'information-circle',
    iconColor = '#2196F3',
    borderColor = '#BBDEFB',
    content,
  }
) {
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
// === 느슨한 알림 조회 ===
export async function getNotifications(identifier) {
  // 1) identifier가 username인지 dbName인지 구분하기 위해 users 컬렉션에서 조회
  const user = await mongoDB('findOne', 'user', 'info', {
    query: {
      $or: [
        { username: identifier },
        { dbName: identifier }
      ]
    }
  });

  // 2) 중복 방지를 위해 배열로 모아두기
  const ids = [identifier];
  if (user && user.username && !ids.includes(user.username)) {
    ids.push(user.username);
  }
  if (user && user.dbName && !ids.includes(user.dbName)) {
    ids.push(user.dbName);
  }

  // 3) notify 컬렉션에서 userId 필드가 ids 배열에 속하는 모든 알림 조회
  const res = await mongoDB('find', 'info', 'notify', {
    query: { userId: { $in: ids } },
    options: { sort: { createdAt: -1 } }
  });

  // 4) 결과 문서 배열로 통일
  const docs = Array.isArray(res)
    ? res
    : Array.isArray(res.documents)
      ? res.documents
      : [];

  // 5) _id 또는 id를 문자열로 변환해 고유 id 생성
  return docs.map((doc, idx) => {
    const rawId = doc._id || doc.id;
    const id = rawId
      ? typeof rawId === 'string'
        ? rawId
        : rawId.toString()
      : `notif-${idx}`;
    return { id, ...doc };
  });
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

// 소셜 로그인 사용자 Upsert 저장
// socialId 기준으로 중복 방지하고, 없으면 새로 생성
export async function upsertSocialLoginUser({
  provider, socialId, username, nickname, passToken, dbName
}) {
  return await mongoDB('updateOne', 'user', 'info', {
    filter: { socialId },
    update: {
      $set: { provider, username, nickname, passToken, dbName },
      $setOnInsert: { createdAt: new Date() },
    },
    options: { upsert: true },
  });
}

// username 업데이트
export async function updateUsername(socialId, username) {
  return await mongoDB('updateOne', 'user', 'info', {
    filter: { socialId },
    update: { $set: { username } },
  });
}

// 문의내역에서 아이디만 불러오기
export async function getUserInfoBySocialId(socialId) {
  if (!socialId) return null;
  try {
    const result = await mongoDB('find', 'user', 'info', {
      query: { socialId },
      options: { limit: 1 }
    });

    const docs = Array.isArray(result)
      ? result
      : Array.isArray(result.documents)
        ? result.documents
        : [];

    return docs[0] || null;
  } catch (err) {
    console.log('getUserInfoBySocialId 실패:', err);
    return null;
  }
}