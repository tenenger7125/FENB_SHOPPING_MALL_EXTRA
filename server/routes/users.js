const router = require('express').Router();

const {
  getUser,
  getUserAddress,
  createUserAddress,
  updateUserDefaultAddress,
  sortUserDefaultAddress,
  updateUserAddress,
  deleteUserAddress,
} = require('../controllers/users');
const { authCheck } = require('../middleware/auth');

router.get('/me', authCheck, async (req, res) => {
  // OK!
  const { email } = req.locals;
  const { name, phone, address } = await getUser(email);

  res.send({ email, name, phone, address });
});

router.get('/me/address', authCheck, async (req, res) => {
  // OK!
  const { email } = req.locals;
  const address = await getUserAddress(email);

  res.send(address);
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

// 기본 배송지 변경
router.patch('/me/address/default/:id', authCheck, async (req, res) => {
  // OK!
  const { email } = req.locals;
  const { id } = req.params;

  await updateUserDefaultAddress(email, id);
  await sortUserDefaultAddress(email);
  res.send({ message: '기본 배송지가 변경되었습니다.' });
});

router.patch('/me/address/:id', authCheck, (req, res) => {
  // OK!
  const { email } = req.locals;
  const id = req.params.id;
  const newAddress = req.body;

  updateUserAddress(email, id, newAddress);
  res.send({ message: '배송지가 수정되었습니다.' });
});

router.delete('/me/address/:id', authCheck, async (req, res) => {
  // OK!
  const { email } = req.locals;
  const { id } = req.params;

  await deleteUserAddress(email, id);
  res.send({ message: '배송지가 삭제되었습니다.' });
});

// ❗ 회원탈퇴 기능 추가해야함

module.exports = router;
