const { User, Product } = require('../models/shop');
const { ObjectId } = require('mongodb');

const createUserCart = async (email, _id, size, quantity) => {
  // OK!
  try {
    const existingCart = await User.findOne({ email, 'carts.productId': new ObjectId(_id), 'carts.size': size });

    if (existingCart) {
      await User.updateOne(
        { email, 'carts.productId': new ObjectId(_id), 'carts.size': size },
        {
          $inc: { 'carts.$[item].quantity': 1 },
        },
        {
          arrayFilters: [{ 'item.productId': new ObjectId(_id), 'item.size': size }],
        }
      );
    } else {
      const product = await Product.findOne({ _id }).lean();
      product.size = size;
      product.quantity = quantity;
      product.productId = product._id;
      delete product._id;

      await User.findOneAndUpdate(
        { email },
        {
          $push: { carts: product },
        }
      );
    }

    const user = await User.findOne({ email });
    return user.carts.find(cart => `${cart.productId}` === `${new ObjectId(_id)}` && cart.size === size);
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
    const user = await User.findOne({ email, 'carts.productId': new ObjectId(productId), 'carts.size': size });

    // user.carts.find의 결과가 없는 경우 : findOne에서 걸러지기 때문에 결국 user 값이 없다.

    return user
      ? user.carts.find(cart => `${cart.productId}` === `${new ObjectId(productId)}` && cart.size === size).quantity
      : 0;
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
