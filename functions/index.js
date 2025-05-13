const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'boog8282@gmail.com',      // ← 너의 Gmail
    pass: 'qnrl8282@@',          // ← 앱 비밀번호 (구글 계정 보안에서 발급)
  },
});

exports.sendInquiryMail = functions.firestore
  .document('inquiries/{docId}')
  .onCreate(async (snap) => {
    const data = snap.data();
    const mailOptions = {
      from: 'boog8282@gmail.com',
      to: 'boog8282@gmail.com', // 받는 사람 이메일 (본인)
      subject: `📩 문의: ${data.title}`,
      html: `
        <h3>제목: ${data.title}</h3>
        <p>${data.content}</p>
        <p>작성일: ${new Date(data.createdAt.toDate()).toLocaleString()}</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('✅ 이메일 전송 완료');
    } catch (err) {
      console.error('❌ 이메일 전송 실패:', err);
    }
  });
