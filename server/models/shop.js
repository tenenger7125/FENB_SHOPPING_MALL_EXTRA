const mongoose = require('mongoose');
const { ProductSchema, UserSchema, CouponSchema, SlideSchema } = require('../schema/shop');

const Product = mongoose.model('Product', ProductSchema);
const User = mongoose.model('User', UserSchema);
const Coupon = mongoose.model('Coupon', CouponSchema);
const Slide = mongoose.model('Slide', SlideSchema);

module.exports = { Product, User, Coupon, Slide };
