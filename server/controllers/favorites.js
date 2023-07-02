const { User, Product } = require('../models/shop');

const createUserFavorite = async (email, productId) => {
  // OK!
  try {
    const product = await Product.findOne({ _id: productId }).lean();
    product.productId = product._id;
    delete product._id;

    const createdUserFavorite = await User.findOneAndUpdate(
      { email },
      { $push: { favorites: product } },
      { new: true }
    );

    return createdUserFavorite;
  } catch (err) {
    console.error('관심상품을 추가하는데 실패했습니다.', err);
  }
};

const getUserFavorites = async email => {
  // OK!
  try {
    const user = await User.findOne({ email });

    return user.favorites;
  } catch (err) {
    console.error('관심상품을 가져오는데 실패했습니다.', err);
  }
};

const hasUserFavorite = async (email, productId) => {
  // OK!
  try {
    const user = await User.findOne({ email, 'favorites.productId': productId });

    return (user?.favorites.length ?? 0) === 1;
  } catch (err) {
    console.error('관심상품을 가져오는데 실패했습니다.', err);
  }
};

const deleteUserFavorite = async (email, productId) => {
  // OK!
  try {
    const user = await User.findOneAndUpdate({ email }, { $pull: { favorites: { productId } } });

    return user.favorites;
  } catch (err) {
    console.error('관심상품을 가져오는데 실패했습니다.', err);
  }
};

module.exports = {
  createUserFavorite,
  getUserFavorites,
  deleteUserFavorite,
  hasUserFavorite,
};
