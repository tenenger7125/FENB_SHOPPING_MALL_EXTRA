const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  recipient: String,
  recipientPhone: String,
  mainAddress: String,
  detailAddress: String,
  postcode: String,
  isDefault: Boolean,
});

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  imgURL: String,
  description: String,
  feature: String,
  brand: { en: String, kr: String },
  category: { en: String, kr: String },
  color: { color: String, en: String, kr: String },
  gender: { en: String, kr: String },
  favorites: Number,
  dateOfManufacture: String,
  stocks: [{ size: Number, quantity: Number }],
});

const FavoritesSchema = ProductSchema.omit(['stocks', 'favorites']).add({
  productId: mongoose.Types.ObjectId,
});
const CartsSchema = ProductSchema.omit(['stocks', 'favorites']).add({
  productId: mongoose.Types.ObjectId,
  size: Number,
  quantity: Number,
});
const HistoriesSchema = new mongoose.Schema(
  {
    address: AddressSchema,
    purchased: [CartsSchema],
    totalPrice: String,
    discountAmount: String,
    discountedTotalPrice: String,
    paymentMethod: String,
  },
  { timestamps: true }
);

const CouponSchema = new mongoose.Schema({
  discountRate: Number,
  discountPrice: Number,
  minimumPrice: Number,
  endTime: Number,
  limit: Number,
});

const UserCouponSchema = CouponSchema.add({ couponId: mongoose.Types.ObjectId });

const SlideSchema = new mongoose.Schema({
  couponId: mongoose.Types.ObjectId,
  title: String,
  imgURL: String,
  sideBackgroundColor: String,
});

const UserSchema = new mongoose.Schema(
  {
    email: String,
    password: String,
    name: String,
    phone: String,
    address: [AddressSchema],
    favorites: [FavoritesSchema],
    carts: [CartsSchema],
    histories: [HistoriesSchema],
    coupons: [UserCouponSchema],
  },
  { timestamps: true }
);

module.exports = { ProductSchema, UserSchema, CouponSchema, SlideSchema };
