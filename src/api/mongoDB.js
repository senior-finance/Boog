import { MONGO_API_BASE_URL, MONGO_API_KEY, MONGO_API_CLUSTER } from '@env';

const BASE_URL = MONGO_API_BASE_URL;
const API_KEY = MONGO_API_KEY;
const CLUSTER = MONGO_API_CLUSTER;

/**
 * 공통 MongoDB Data API 호출 함수
 * @param {string} action - Data API 액션 (insertOne/Many, findOne, find, updateOne, deleteOne/Many 등)
 * @param {string} dbName - 데이터베이스 이름
 * @param {string} collName - 컬렉션 이름
 * @param {object} params - action별 파라미터 (document, filter, update, limit 등)
 * @returns {Promise<any>} - API 호출 결과 JSON
 */
export async function callDataApi(action, dbName, collName, params) {
  const url = `${BASE_URL}/${action}`;
  const payload = {
    dataSource: CLUSTER,
    database: dbName,
    collection: collName,
    ...params,
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': API_KEY,
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!res.ok || json.error) {
    throw new Error(json.error || JSON.stringify(json));
  }
  return json;
}

// 문서 읽기 read
// ex ) readDocument('DB 이름', 'Collection 이름', { name: 'John Doe' })
export async function readDocument(dbName, collName, filter) {
  const { document } = await callDataApi('findOne', dbName, collName, { filter });
  return document;
}

// 문서 쓰기 write
// ex ) writeDocument('DB 이름', 'Collection 이름', { name: 'John Doe', age: 30 })
export async function writeDocument(dbName, collName, doc) {
  const { insertedId } = await callDataApi('insertOne', dbName, collName, { document: doc });
  return insertedId;
}

/**
 * 필요에 따라 updateDocument, deleteDocument 등 추가 가능
 */
