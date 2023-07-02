const { deleteExpiredUserCoupon } = require('../controllers/coupons');

const expireCoupon = async (req, res, next) => {
  const { email } = req.locals;

  const user = await deleteExpiredUserCoupon(email);
  req.locals.coupons = user.coupons;
  next();
};

module.exports = { expireCoupon };
