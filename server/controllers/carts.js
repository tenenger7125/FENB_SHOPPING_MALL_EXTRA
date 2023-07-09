const { User, Product } = require('../models/shop');
const { ObjectId } = require('mongodb');

const createUserCart = async (email, _id, size, quantity) => {
  // OK!
  try {
    const product = await Product.findOne({ _id }).lean();
    product.size = size;
    product.quantity = quantity;
    product.productId = product._id;
    delete product._id;

    const createdUserCart = await User.findOneAndUpdate(
      { email },
      {
        $push: { carts: product },
      },
      { new: true }
    );

    return createdUserCart.carts.at(-1);
  } catch (err) {
    console.error('장바구니에 상품을 추가하는데 실패했습니다.', err);
  }
};

const getUserCarts = async email => {
  // OK!
  try {
    const user = await User.findOne({ email });

    return user.carts;
  } catch (err) {
    console.error('장바구니에 담긴 상품들을 가져오는데 실패했습니다.', err);
  }
};

const countSelectedUserCarts = async (email, productId, size) => {
  //OK!
  try {
    const user = await User.aggregate([
      {
        $match: { email },
      },
      {
        $project: {
          carts: {
            $filter: {
              input: '$carts',
              as: 'cart',
              cond: { $and: [{ $eq: ['$$cart.size', size] }, { $eq: ['$$cart.productId', new ObjectId(productId)] }] },
            },
          },
        },
      },
      {
        $unwind: '$carts',
      },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: '$carts.quantity' },
        },
      },
    ]);
    return user[0]?.totalQuantity ?? 0;
  } catch (err) {
    console.error('장바구니에 담긴 특정 상품을 가져오는데 실패했습니다.', err);
  }
};

const getUserCart = async (email, cartId, size) => {
  //OK!
  try {
    const user = await User.findOne({ email, 'carts._id': cartId, 'carts.size': size });

    return user?.carts[0] ?? {};
  } catch (err) {
    console.error('장바구니에 담긴 상품을 가져오는데 실패했습니다.', err);
  }
};

const updateUserCart = async (email, cartId, size, quantity) => {
  // ❗ 0이 되거나 마이너스가 될때 처리가 필요하다.
  // OK!
  try {
    const user = await User.findOneAndUpdate(
      { email, 'carts._id': cartId, 'carts.size': size },
      {
        $set: { 'carts.$[product1].quantity': quantity },
      },
      {
        new: true,
        arrayFilters: [{ 'product1._id': cartId }],
      }
    );

    return user.carts;
  } catch (err) {
    console.error('장바구니를 수정하는데 실패했습니다.', err);
  }
};

const deleteQuantityZero = async email => {
  try {
    const user = await User.findOneAndUpdate({ email }, { $pull: { carts: { quantity: 0 } } }, { new: true });

    return user.carts;
  } catch (err) {
    console.error('수량이 0인 상품을 제거하는데 실패했습니다.', err);
  }
};

const deleteUserCart = async (email, cartId) => {
  // OK!
  try {
    const user = await User.findOneAndUpdate({ email }, { $pull: { carts: { _id: cartId } } }, { new: true });

    return user.carts;
  } catch (err) {
    console.error('장바구니 상품을 삭제하는데 실패했습니다.', err);
  }
};

const removeUserCart = async email => {
  // OK!
  try {
    const user = await User.findOneAndUpdate({ email }, { $set: { carts: [] } });

    return user.carts;
  } catch (err) {
    console.error('장바구니를 비우는데 실패했습니다.', err);
  }
};

module.exports = {
  createUserCart,
  getUserCarts,
  getUserCart,
  updateUserCart,
  deleteUserCart,
  deleteQuantityZero,
  removeUserCart,
  countSelectedUserCarts,
};
