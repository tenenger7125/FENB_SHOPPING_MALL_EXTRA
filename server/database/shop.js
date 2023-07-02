const mongoose = require('mongoose');

const mongooseConnect = async callback => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL, {
      useUnifiedTopology: true,
    });
    callback();
    console.log('몽구스 연결에 성공했습니다.');
  } catch (err) {
    console.error('몽구스 연결에 실패했습니다.', err);
  }
};

module.exports = { mongooseConnect };
