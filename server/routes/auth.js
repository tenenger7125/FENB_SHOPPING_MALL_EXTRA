const jwt = require('jsonwebtoken');
const router = require('express').Router();

const users = require('../controllers/users');
const { authCheck } = require('../middleware/auth');

router.get('/signout', (req, res) => {
  // OK!
  res.cookie('accessToken', '', { maxAge: 0, httpOnly: true });
  res.send({ isSignIn: false });
});

router.get('/verify', authCheck, (req, res) => {
  res.send({ isSignIn: true });
});

router.post('/signin', async (req, res) => {
  // OK!
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(401).send({ message: '사용자 아이디 또는 패스워드가 전달되지 않았습니다.' });

  const user = await users.confirmUser(email, password);
  if (!user) return res.status(401).send({ message: '등록되지 않은 사용자입니다.' });

  const accessToken = jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
    expiresIn: '1d',
  });

  res.cookie('accessToken', accessToken, {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7d
    httpOnly: true,
  });

  // 로그인 성공
  res.send({ email, username: user.name });
});

router.post('/signup', async (req, res) => {
  // OK!
  const { email, name, phone, password, mainAddress, detailAddress, postcode } = req.body;

  if (!email || !password || !name || !phone)
    return res.status(401).send({ message: '필수 정보가 전달되지 않았습니다.' });

  const isDuplicate = await users.hasUserEmail(email);

  if (isDuplicate) return res.status(400).send({ message: '이메일이 중복입니다.' });

  users.createUser({
    email,
    name,
    phone,
    password,
    mainAddress,
    detailAddress,
    postcode,
  });

  res.send({ message: '회원가입이 완료되었습니다.' });
});

router.post('/signup/email', async (req, res) => {
  // OK!
  const { email } = req.body;
  const isDuplicate = await users.hasUserEmail(email);

  res.send({ isDuplicate });
});

module.exports = router;
