const router = require('express').Router();

const {
  updateUserCart,
  deleteUserCart,
  getUserCart,
  createUserCart,
  getSelectedUserCarts,
  deleteQuantityZero,
} = require('../controllers/carts');
const { getProductStockBySize } = require('../controllers/stocks');
const { cartStockCheck } = require('../middleware/stock');
const { authCheck } = require('../middleware/auth');

router.get('/me', authCheck, cartStockCheck, async (req, res) => {
  // OK!
  const { carts } = req.locals;

  res.send(carts);
});

router.post('/me/:id', authCheck, cartStockCheck, async (req, res) => {
  // OK!
  const { email } = req.locals;
  const { id } = req.params;
  const { selectedSize, quantity = 1 } = req.body;

  // 이번에 요청한 상품의 재고 확인
  const selectedSizeCarts = await getSelectedUserCarts(email, id, selectedSize);

  const stock = await getProductStockBySize(id, selectedSize);
  const selectedQuantity = selectedSizeCarts.reduce((acc, cur) => acc + cur.quantity, 0) + quantity;

  if (stock.quantity < selectedQuantity)
    return res.status(406).send({ message: '상품의 재고가 없습니다. 수량을 다시 선택해주세요' });

  //❗ 같은 상품이면서 같은 수량일 경우, 합치는 것 해야한다.
  createUserCart(email, id, selectedSize, quantity);

  res.send({ message: '장바구니에 상품이 정상적으로 추가되었습니다.' });
});

// cart 변경
router.patch('/me/:id', authCheck, cartStockCheck, async (req, res) => {
  // OK!
  const { email } = req.locals;
  const { id: cartId } = req.params;
  const { selectedSize, quantity = 1 } = req.body;

  // 이번에 요청한 상품의 재고 확인
  const cart = await getUserCart(email, cartId, selectedSize);

  if (!cart.productId) return res.status(406).send({ message: '잘못된 상품을 선택했습니다.' });

  const stock = await getProductStockBySize(cart.productId, selectedSize);

  if (stock.quantity < quantity)
    return res.status(406).send({ message: '상품의 재고가 없습니다. 수량을 다시 선택해주세요' });

  await updateUserCart(email, cartId, selectedSize, quantity);
  await deleteQuantityZero(email);

  res.send({ message: '장바구니 상품이 변경되었습니다.' });
});

// 삭제
router.delete('/:id', authCheck, cartStockCheck, async (req, res) => {
  const { email } = req.locals;
  const selectedSize = +req.query.selectedSize;
  const { id: cartId } = req.params;

  await deleteUserCart(email, cartId, selectedSize);
  res.send({ message: '장바구니 상품이 삭제되었습니다.' });
});

module.exports = router;
