
import { db } from '../../database/firebase';
import { collection, addDoc, getDocs, query as firestoreQuery, where, orderBy } from 'firebase/firestore';

/**
 * 문의 내역을 Firestore에 저장하는 함수
 */
export async function sendInquiry({ userName, title, content }) {
  console.log('📨 Firestore에 저장 시도 중...');
  await addDoc(collection(db, 'inquiries'), {
    userName,
    title,
    content,
    createdAt: new Date(),
  });
  console.log('Firestore 저장 완료');
}

/**
 * Firestore에서 userName에 해당하는 문의 내역을 가져오는 함수
 */
export async function getInquiries(userName) {
  console.log('📨 Firestore에서 문의 내역 불러오는 중...', userName);
  try {
    // 단일 필터 쿼리 (where만 사용)
    const inquiriesRef = collection(db, 'inquiries');
    const q = firestoreQuery(
      inquiriesRef,
      where('userName', '==', userName)
    );
    const snapshot = await getDocs(q);

    const inquiries = snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      const createdAt = data.createdAt && typeof data.createdAt.toDate === 'function'
        ? data.createdAt.toDate()
        : data.createdAt;
      return {
        id: docSnap.id,
        userName: data.userName,
        title: data.title,
        content: data.content,
        createdAt: data.createdAt?.toDate()
      };
    });

    // 클라이언트에서 최신순 정렬
    inquiries.sort((a, b) => b.createdAt - a.createdAt);

    console.log('Firestore 문의 내역 불러오기 완료:', inquiries.length, '건');
    return inquiries;
  } catch (error) {
    console.error('🛑 문의 내역 불러오기 오류:', error);
    throw error;
  }
}