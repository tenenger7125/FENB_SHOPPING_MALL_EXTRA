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
    console.error('관심상품들을 가져오는데 실패했습니다.', err);
  }
};

const getUserFavorite = async (email, favoriteId) => {
  // OK!
  try {
    const user = await User.findOne({ email, 'favorites._id': favoriteId });

    return user?.favorites[0] ?? {};
  } catch (err) {
    console.error('관심상품을 가져오는데 실패했습니다.', err);
  }
};

const deleteUserFavorite = async (email, favoriteId) => {
  // OK!
  try {
    const user = await User.findOneAndUpdate({ email }, { $pull: { favorites: { _id: favoriteId } } });

    return user.favorites;
  } catch (err) {
    console.error('관심상품을 삭제하는데 실패했습니다.', err);
  }
};

module.exports = {
  createUserFavorite,
  getUserFavorites,
  getUserFavorite,
  deleteUserFavorite,
};
