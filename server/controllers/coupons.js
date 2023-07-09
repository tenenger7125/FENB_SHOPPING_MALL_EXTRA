const { ObjectId } = require('mongodb');
const { User, Coupon } = require('../models/shop');

const createCoupon = async coupon => {
  // OK!
  try {
    const createdCoupon = await Coupon.create(coupon);

    return createdCoupon;
  } catch (err) {
    console.error('쿠폰을 생성하는데 실패했습니다.', err);
  }
};

const createUserCoupon = async (email, _id) => {
  // OK!
  try {
    const coupon = await Coupon.findOne({ _id }).lean();
    coupon.couponId = coupon._id;
    delete coupon._id;

    const user = await User.findOneAndUpdate({ email }, { $push: { coupons: coupon } }, { new: true });

    return user.coupons;
  } catch (err) {
    console.error('쿠폰을 추가하는데 실패했습니다.', err);
  }
};

const getCoupons = async () => {
  // OK!
  try {
    const coupons = await Coupon.find();

    return coupons;
  } catch (err) {
    console.error('쿠폰을 가져오는데 실패했습니다.', err);
  }
};

const getUserCoupons = async email => {
  // OK!
  try {
    const user = await User.findOne({ email });

    return user.coupons;
  } catch (err) {
    console.error('가진 쿠폰들을 가져오는데 실패했습니다.', err);
  }
};

const getCoupon = async _id => {
  // OK!
  try {
    const coupon = await Coupon.findOne({ _id });

    return coupon;
  } catch (err) {
    console.error('쿠폰을 가져오는데 실패했습니다.', err);
  }
};

const getUserCoupon = async (email, userCouponId) => {
  try {
    const res = await User.findOne({ email, 'coupons._id': userCouponId }, { 'coupons.$': 1 });

    return res?.coupons[0];
  } catch (err) {
    console.error('가진 쿠폰을 가져오는데 실패했습니다.', err);
  }
};

const deleteUserCoupon = async (email, _id) => {
  // OK!
  try {
    const userCoupon = await User.findOneAndUpdate({ email }, { $pull: { coupons: { _id } } }, { new: true });

    return userCoupon;
  } catch (err) {
    console.error('쿠폰을 삭제하는데 실패했습니다.', err);
  }
};

const deleteExpiredUserCoupon = async email => {
  // OK!
  try {
    const userCoupon = await User.findOneAndUpdate(
      { email },
      { $pull: { coupons: { endTime: { $lt: new Date().getTime() } } } },
      { new: true }
    );

    return userCoupon;
  } catch (err) {
    console.error('유효기간 만료된 쿠폰을 삭제하는데 실패했습니다.', err);
  }
};

module.exports = {
  createCoupon,
  createUserCoupon,
  getCoupons,
  getUserCoupons,
  getCoupon,
  getUserCoupon,
  deleteUserCoupon,
  deleteExpiredUserCoupon,
};
