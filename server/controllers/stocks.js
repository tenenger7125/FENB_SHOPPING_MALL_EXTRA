const { Product } = require('../models/shop');

const createProductStocks = async (_id, stocks) => {
  // OK!
  try {
    const updatedProduct = await Product.findOneAndUpdate({ _id }, { $set: { stocks } }, { new: true });
    return updatedProduct;
  } catch (err) {
    console.error('상품의 재고를 추가하는데 실패했습니다.', err);
  }
};

const getProductStocks = async _id => {
  // OK!
  try {
    const product = await Product.findOne({ _id });

    return product.stocks;
  } catch (err) {
    console.error('상품의 재고를 가져오는데 실패했습니다.');
  }
};

const getProductStockBySize = async (_id, size) => {
  // OK!
  try {
    const product = await Product.findOne({ _id });

    return product.stocks.find(stock => stock.size === size);
  } catch (err) {
    console.error('상품 사이즈의 재고를 가져오는데 실패했습니다.');
  }
};

const updateStock = async (_id, size, quantity) => {
  // OK! stock을 넘는 수량을 주문할 경우 업데이트되지 않는다.
  try {
    const updatedStock = await Product.findOneAndUpdate(
      { _id },
      { $inc: { 'stocks.$[elem].stock': quantity } },
      { new: true, arrayFilters: [{ 'elem.size': size, 'elem.stock': { $gte: -quantity } }] }
    );

    return updatedStock;
  } catch (err) {
    console.error('상품의 재고를 수정하는데 실패했습니다.');
  }
};

module.exports = { createProductStocks, getProductStocks, getProductStockBySize, updateStock };
