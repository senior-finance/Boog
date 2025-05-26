// src/firebase.js
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, collection, addDoc, getDocs, query, where, orderBy, serverTimestamp 
} from 'firebase/firestore';

// 1) android/app/google-services.json를 require
const gs = require('../../android/app/google-services.json');

// 2) 필요한 값 꺼내기
const projectId = gs.project_info.project_id;
const storageBucket = gs.project_info.storage_bucket;
const messagingSender = gs.project_info.project_number;

// 3) android 클라이언트 정보 찾기
const androidClient = gs.client.find(c =>
  c.client_info.android_client_info?.package_name === 'com.seniorfinance'
);

// 4) 모바일 SDK App ID / API 키 꺼내기
const appId = androidClient.client_info.mobilesdk_app_id;
const apiKey = androidClient.api_key[0].current_key;

// 5) Web SDK용 config 구성
const firebaseConfig = {
  apiKey,
  authDomain: `${projectId}.firebaseapp.com`,
  projectId,
  storageBucket,
  messagingSenderId: messagingSender,
  appId,
};

// 6) Firebase 초기화 & Firestore 연결
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// 필요한 경우 확장을 위해 다음도 추가 가능:
// export const auth = getAuth(app); (추후 로그인 쓸 때)
// export const storage = getStorage(app); (추후 파일 업로드 시)

export default app;
