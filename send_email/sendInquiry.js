const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

// 환경 변수에서 Gmail 정보 가져오기
const gmailUser = functions.config().gmail.user;
const gmailPass = functions.config().gmail.pass;

// Nodemailer 설정
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailUser,
    pass: gmailPass,
  },
});

exports.sendInquiry = functions
  .region('asia-northeast3')
  .runWith({ memory: '256MB', timeoutSeconds: 60 })
  .https
  .onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(204).send('');

    const { title, content, userName, userEmail } = req.body;

    if (!title || !content || !userName || !userEmail) {
      return res.status(400).send('입력 누락');
    }

    const mailOptions = { // 이메일 꾸밀려면 여기서 꾸미면 됨
      from: `"문의 시스템" <${gmailUser}>`,
      to: gmailUser,
      subject: `[1:1 문의] ${title}`,
      html: `
        <h2>1:1 문의 도착</h2>
        <p><strong>보낸 사람:</strong> ${userName} (${userEmail})</p>
        <p><strong>제목:</strong> ${title}</p>
        <p><strong>내용:</strong><br>${content.replace(/\n/g, "<br>")}</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('메일 전송 성공');
      res.status(200).send('이메일 전송 성공');
    } catch (error) {
      console.error('메일 전송 실패:', error);
      res.status(500).send('이메일 전송 실패');
    }
  });
