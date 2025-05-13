const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const nodemailer = require('nodemailer');

initializeApp();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'boog8282@gmail.com',
    pass: 'yint mupo wwgm tcss',
  },
});

exports.sendInquiryMail = onDocumentCreated('inquiries/{docId}', async (event) => {
  const data = event.data.data();

  const mailOptions = {
    from: 'boog8282@gmail.com',
    to: 'boog8282@gmail.com',
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
