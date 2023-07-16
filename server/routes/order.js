const router = require('express').Router();

const { removeUserCart } = require('../controllers/carts');
const { updateStock } = require('../controllers/stocks');
const { getUserHistories, createUserHistory } = require('../controllers/histories');
const { getUserAddressOne } = require('../controllers/users');
const { getUserCoupon, deleteUserCoupon } = require('../controllers/coupons');
const { cartStockCheck } = require('../middleware/stock');
const { authCheck } = require('../middleware/auth');
const { expireCoupon } = require('../middleware/coupon');

// 결제 페이지 이동 전 check 용도
router.get('/', authCheck, cartStockCheck, expireCoupon, (req, res) => {
  // OK!
  const { carts } = req.locals;

  if (carts.length <= 0)
    return res.status(406).send({ message: '장바구니가 비어있습니다. 상품을 장바구니에 추가해주세요' });

  res.send({ message: '결제 페이지로 이동합니다.' });
});

// 쿠폰 적용시 확인 용도
router.get('/coupons/:id', authCheck, cartStockCheck, expireCoupon, async (req, res) => {
  //OK!
  const { email, carts } = req.locals;
  const { id: userCouponId } = req.params;

  const coupon = await getUserCoupon(email, userCouponId);

  if (!coupon) return res.status(404).send({ message: '존재하지 않는 쿠폰입니다' });

  const totalPrice = carts.reduce((acc, cart) => acc + cart.price * cart.quantity, 0);

  if (totalPrice < coupon.minimumPrice)
    return res.status(403).send({ message: `쿠폰을 사용하기 위한 최소 주문 금액을 충족하지 않습니다.` });

  const discountedTotalPrice = coupon.discountPrice
    ? totalPrice - coupon.discountPrice
    : totalPrice * (1 - coupon.discountRate / 100);
  const discountAmount = totalPrice - discountedTotalPrice;

  res.send({
    discountAmount,
    discountedTotalPrice,
  });
});

// 결제하기 버튼 클릭시 사용해주세요
router.post('/pay', authCheck, cartStockCheck, expireCoupon, async (req, res) => {
  //OK!
  const { email, carts } = req.locals;
  const { addressId, paymentMethod, couponId: userCouponId = null } = req.body;
  const totalPrice = carts.reduce((acc, cart) => acc + cart.price * cart.quantity, 0);

  let [discountAmount, discountedTotalPrice] = [0, totalPrice];

  if (userCouponId) {
    const coupon = await getUserCoupon(email, userCouponId);

    if (totalPrice < coupon.minimumPrice)
      return res.status(403).send({ message: `쿠폰을 사용하기 위한 최소 주문 금액을 충족하지 않습니다.` });

    discountedTotalPrice = coupon.discountPrice
      ? totalPrice - coupon.discountPrice
      : totalPrice * (1 - coupon.discountRate / 100);
    discountAmount = totalPrice - discountedTotalPrice;

    deleteUserCoupon(email, userCouponId);
  }
  const address = await getUserAddressOne(email, addressId);

  createUserHistory(email, {
    address,
    purchased: carts,
    totalPrice,
    discountAmount,
    discountedTotalPrice,
    paymentMethod,
  });

  // 상품 사이즈 별 수량 변경하기
  carts.forEach(({ productId, size, quantity }) => updateStock(productId, size, -quantity));

  // 유저 장바구니 비우기
  removeUserCart(email);
  res.send({ message: '결제가 완료되었습니다.' });
});

// 결제 목록 확인
router.get('/history', authCheck, async (req, res) => {
  const { email } = req.locals;
  const histories = await getUserHistories(email);

  res.send(histories);
});

module.exports = router;
