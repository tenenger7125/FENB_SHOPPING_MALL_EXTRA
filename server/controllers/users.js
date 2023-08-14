const { User } = require('../models/shop');
const { ObjectId } = require('mongodb');

// signup api
const createUser = async ({ email, name, phone, password, ...address }) => {
  // OK!
  const newAddress = address.postcode
    ? [
        {
          recipient: name,
          recipientPhone: phone,
          ...address,
          isDefault: true,
        },
      ]
    : [];

  try {
    const user = await User.create({ email, password, name, phone, address: newAddress, favorites: [], carts: [] });
    // 🧠 {new: true} 옵션을 추가하면 2번 create 된다.
    return user;
  } catch (err) {
    console.error('유저 생성에 실패했습니다.', err);
  }
};

// 추가
const createUserAddress = async ({ email, ...address }) => {
  // OK!
  try {
    // 유저의 주소를 처음 추가하는 거면 isDefault가 true, 그렇지 않으면 false로 세팅한다.
    const user = await User.findOneAndUpdate({ email }, { $set: { 'address.$[].isDefault': false } }, { new: true });
    const newAddress = {
      ...address,
      isDefault: user.address.length === 0,
    };
    const createdUserAddress = await User.findOneAndUpdate(
      { email },
      { $push: { address: newAddress } },
      { new: true }
    );

    return createdUserAddress.address.at(-1);
  } catch (err) {
    console.error('유저 주소를 추가하는데 실패했습니다.', err);
  }
};

const getUser = async email => {
  // OK!
  try {
    const user = await User.findOne({ email });
    return user;
  } catch (err) {
    console.error('유저 정보를 가져오는데 실패했습니다.', err);
  }
};

const getUserAddress = async email => {
  // OK! ❗ getUser와 중복된다.
  try {
    const user = await User.findOne({ email });

    return user.address;
  } catch (err) {
    console.error('유저 주소를 가져오는데 실패했습니다.', err);
  }
};

const getUserAddressOne = async (email, _id) => {
  // OK! ❗ getUser와 중복된다.
  try {
    const res = await User.findOne({ email, 'address._id': _id }, { 'address.$': 1 });

    return res?.address[0];
  } catch (err) {
    console.error('유저 주소를 가져오는데 실패했습니다.', err);
  }
};

// 비밀번호 변경
const updatePassword = async (email, password) => {
  // OK!
  try {
    const updatedUserPassword = await User.findOneAndUpdate({ email }, { $set: password }, { new: true });

    return updatedUserPassword;
  } catch (err) {
    console.error('패스워드를 변경하는데 실패했습니다.', err);
  }
};

// 이름 변경
const updateName = async (email, name) => {
  // OK!
  try {
    await User.findOneAndUpdate({ email }, { $set: name }, { new: true });
  } catch (err) {
    console.error('유저 이름을 변경하는데 실패했습니다.', err);
  }
};

// 전화번호 변경
const updatePhone = async (email, phone) => {
  // OK!
  try {
    await User.findOneAndUpdate({ email }, { $set: phone }, { new: true });
  } catch (err) {
    console.error('유저 전화번호를 변경하는데 실패했습니다.', err);
  }
};

// 배송지 수정
const updateUserAddress = async (email, _id, address) => {
  // OK!
  const newAddress = Object.fromEntries(
    Object.entries(address).map(([key, value]) => [`address.$[address].${key}`, value])
  );

  try {
    const updatedUser = await User.findOneAndUpdate(
      { email, 'address._id': _id },
      { $set: newAddress },
      { new: true, arrayFilters: [{ 'address._id': _id }] }
    );
    return updatedUser?.address.find(address => `${address._id}` === `${new ObjectId(_id)}`);
  } catch (err) {
    console.error('유저 주소를 변경하는데 실패했습니다.', err);
  }
};

// 기본 배송지 변경
const updateUserDefaultAddress = async (email, _id) => {
  // OK!
  try {
    await User.findOneAndUpdate({ email }, { $set: { 'address.$[].isDefault': false } });
    const user = await User.findOneAndUpdate(
      { email, 'address._id': _id },
      { $set: { 'address.$[address].isDefault': true } },
      { new: true, arrayFilters: [{ 'address._id': _id }] }
    );

    return user;
  } catch (err) {
    console.error('유저 기본 배송지를 변경하는데 실패했습니다.', err);
  }
};

// 배송지 삭제
const deleteUserAddress = async (email, _id) => {
  // OK!
  try {
    const user = await User.findOneAndUpdate({ email }, { $pull: { address: { _id } } });
    return user.address;
  } catch (err) {
    console.error('유저 배송지를 삭제하는데 실패했습니다.', err);
  }
};

// 기본 배송지는 배열 맨앞으로 이동
const sortUserDefaultAddress = async email => {
  // OK!
  try {
    const sortedAddress = await User.findOneAndUpdate(
      { email },
      {
        $push: {
          address: {
            $each: [],
            $sort: { isDefault: -1 },
          },
        },
      }
    );
    return sortedAddress;
  } catch (err) {
    console.error('유저 기본 배송지를 변경하는데 실패했습니다.');
  }
};

const confirmUser = async (email, password) => {
  try {
    const user = await User.findOne({ email, password });

    return user;
  } catch (err) {
    console.error('유저 정보가 없습니다.', err);
  }
};

//❗ 아이디 중복 확인 추가하기
const hasUserEmail = async email => {
  try {
    const count = await User.countDocuments({ email });

    return count === 1;
  } catch (err) {
    console.error('유저 정보가 없습니다.', err);
  }
};

//❗ 비밀번호 확인하는거 추가하기
const hasUserPassword = async (email, password) => {
  try {
    const count = await User.countDocuments({ email, password });

    return count === 1;
  } catch (err) {
    console.error('비밀번호가 일치하지 않습니다.', err);
  }
};

//❗ 계정 삭제 추가하기
const deleteUser = async email => {
  // OK!
  try {
    await User.findOneAndDelete({ email });
  } catch (err) {
    console.error('회원 정보을 삭제하는데 실패했습니다.', err);
  }
};

module.exports = {
  createUser,
  createUserAddress,
  getUser,
  getUserAddress,
  getUserAddressOne,
  updatePassword,
  updateName,
  updatePhone,
  updateUserDefaultAddress,
  updateUserAddress,
  deleteUserAddress,
  confirmUser,
  sortUserDefaultAddress,
  hasUserEmail,
  hasUserPassword,
  deleteUser,
};
