const router = require('express').Router();

const { authCheck } = require('../middleware/auth');
const { expireCoupon } = require('../middleware/coupon');
const { getCoupon, createUserCoupon } = require('../controllers/coupons');

router.get('/', authCheck, expireCoupon, async (req, res) => {
  // OK!
  const { coupons } = req.locals;

  res.send(coupons);
});

// 쿠폰을 유저에 추가하기
router.post('/:id', authCheck, expireCoupon, async (req, res) => {
  // OK!
  const { email } = req.locals;
  const { id: couponId } = req.params;

  const coupon = await getCoupon(couponId);
  if (!coupon) return res.status(404).send({ message: '요청하신 쿠폰이 없습니다.' });

  if (coupon.endTime < new Date().getTime())
    return res.status(401).send({ message: '쿠폰 받는 유효기간이 지났습니다.' });

  // ❗ 쿠폰 개수 제한 기능 다시 해보기
  // const couponsHistory = getCouponHistory(email, couponId);
  // if (couponsHistory && couponsHistory.count === coupon.limit)
  //   return res.status(403).send({ message: '더이상 발급 받으실 수 없습니다.' });

  createUserCoupon(email, couponId);
  // addCouponHistory(email, couponId);

  res.send({ message: '쿠폰이 정상발급되었습니다.' });
});

module.exports = router;
