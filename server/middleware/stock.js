const { getProductStockBySize } = require('../controllers/stocks');
const { getUserCarts, deleteQuantityZero } = require('../controllers/carts');

const cartStockCheck = async (req, res, next) => {
  const { email } = req.locals;
  const carts = await getUserCarts(email);

  await deleteQuantityZero(email);

  req.locals.carts = carts;
  next();
};

module.exports = { cartStockCheck };
