// src/firebase.js
import { initializeApp, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';

// 1) android/app/google-services.json를 require
const gs = require('../../android/app/google-services.json');

// 2) 필요한 값 꺼내기
const projectId       = gs.project_info.project_id;
const storageBucket   = gs.project_info.storage_bucket;
const messagingSender = gs.project_info.project_number;

// 클라이언트 배열 중 android 설정이 있는 항목 찾기
const androidClient = gs.client.find(c =>
  c.client_info.android_client_info?.package_name === 'com.seniorfinance'
);

// 모바일 SDK 앱 ID와 API 키
const appId = androidClient.client_info.mobilesdk_app_id;
const apiKey = androidClient.api_key[0].current_key;

// 3) Web SDK용 설정 객체 생성
const firebaseConfig = {
  apiKey,
  authDomain: `${projectId}.firebaseapp.com`,
  projectId,
  storageBucket,
  messagingSenderId: messagingSender,
  appId,
  // measurementId 등 필요하면 추가
};

// 4) 초기화 & export
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;
