const { User } = require('../models/shop');

const createUserHistory = async (email, history) => {
  try {
    const createdUserHistory = await User.findOneAndUpdate(
      { email },
      { $push: { histories: { $each: [history], $position: 0 } } },
      { new: true }
    );

    return createdUserHistory;
  } catch (err) {
    console.error('구매내역을 기록하는데 실패했습니다.', err);
  }
};

const getUserHistories = async email => {
  // OK!
  try {
    const user = await User.findOne({ email });

    return user.histories;
  } catch (err) {
    console.error('장바구니에 담긴 상품을 가져오는데 실패했습니다.', err);
  }
};

module.exports = { createUserHistory, getUserHistories };
