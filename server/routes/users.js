const router = require('express').Router();

const {
  getUser,
  getUserAddress,
  createUserAddress,
  updatePassword,
  updateName,
  updatePhone,
  updateUserDefaultAddress,
  sortUserDefaultAddress,
  updateUserAddress,
  deleteUser,
  deleteUserAddress,
  hasUserPassword,
} = require('../controllers/users');
const { authCheck } = require('../middleware/auth');

router.get('/me', authCheck, async (req, res) => {
  // OK!
  const { email } = req.locals;
  const { name, phone, address, password } = await getUser(email);

  res.send({ email, name, phone, address, password: password.length });
});

router.get('/me/address', authCheck, async (req, res) => {
  // OK!
  const { email } = req.locals;
  const address = await getUserAddress(email);

  res.send(address);
});

router.post('/me/password', authCheck, async (req, res) => {
  const { email } = req.locals;
  const { currentPassword } = req.body;

  const isCorrespond = await hasUserPassword(email, currentPassword);

  res.send({ isCorrespond });
});

router.post('/me/address', authCheck, async (req, res) => {
  // OK!
  const { email } = req.locals;
  const { recipient, recipientPhone, mainAddress, detailAddress, postcode } = req.body;

  if (!recipient || !recipientPhone || !mainAddress || !postcode)
    return res.status(406).send({ message: '모든 정보를 입력해주세요.' });

  const address = await createUserAddress({ email, recipient, recipientPhone, mainAddress, detailAddress, postcode });

  res.send(address);
});

// 비밀번호 변경
router.patch('/me/password', authCheck, async (req, res) => {
  const { email } = req.locals;
  const newPassword = req.body;

  const isCorrespond = await hasUserPassword(email, newPassword.currentPassword);

  if (!isCorrespond) return res.status(400).send({ message: '현재 비밀번호와 일치하지 않습니다.' });

  const { password } = await updatePassword(email, newPassword);

  res.send({ password: password.length });
});

// 이름 변경
router.patch('/me/name', authCheck, async (req, res) => {
  const { email } = req.locals;
  const name = req.body;

  await updateName(email, name);

  res.send({ message: '이름을 성공적으로 변경했습니다.' });
});

// 전화번호 변경
router.patch('/me/phone', authCheck, async (req, res) => {
  const { email } = req.locals;
  const phone = req.body;

  await updatePhone(email, phone);

  res.send({ message: '전화번호를 성공적으로 변경했습니다.' });
});

// 기본 배송지 변경
router.patch('/me/address/default/:id', authCheck, async (req, res) => {
  // OK!
  const { email } = req.locals;
  const { id } = req.params;

  await updateUserDefaultAddress(email, id);
  await sortUserDefaultAddress(email);
  res.send({ message: '기본 배송지가 변경되었습니다.' });
});

router.patch('/me/address/:id', authCheck, async (req, res) => {
  // OK!
  const { email } = req.locals;
  const id = req.params.id;
  const { recipient, recipientPhone, mainAddress, detailAddress, postcode } = req.body;

  const address = await updateUserAddress(email, id, {
    recipient,
    recipientPhone,
    mainAddress,
    detailAddress,
    postcode,
  });

  res.send(address);
});

router.delete('/me/address/:id', authCheck, async (req, res) => {
  // OK!
  const { email } = req.locals;
  const { id } = req.params;

  await deleteUserAddress(email, id);
  res.send({ message: '배송지가 삭제되었습니다.' });
});

// ❗ 회원탈퇴 기능 추가해야함
router.delete('/me', authCheck, async (req, res) => {
  const { email } = req.locals;

  await deleteUser(email);

  res.send({ message: '계정이 성공적으로 삭제되었습니다. ' });
});

module.exports = router;
