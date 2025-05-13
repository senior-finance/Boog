
import { db } from '../../database/firebase';
import { collection, addDoc } from 'firebase/firestore';

/**
 * 문의 내역을 Firestore에 저장하는 함수
 */
export async function sendInquiry({ title, content }) {
  console.log('📨 Firestore에 저장 시도 중...');
  await addDoc(collection(db, 'inquiries'), {
    title,
    content,
    createdAt: new Date(),
  });
  console.log('✅ Firestore 저장 완료');
}
