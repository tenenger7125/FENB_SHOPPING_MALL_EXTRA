const router = require('express').Router();

const {
  updateUserCart,
  deleteUserCart,
  getUserCart,
  createUserCart,
  countSelectedUserCarts,
  deleteQuantityZero,
  getUserCarts,
} = require('../controllers/carts');
const { getProductStockBySize } = require('../controllers/stocks');
const { cartStockCheck } = require('../middleware/stock');
const { authCheck } = require('../middleware/auth');

router.get('/me', authCheck, cartStockCheck, async (req, res) => {
  // OK!
  const { carts } = req.locals;

  res.send(carts);
});

router.post('/quantity', authCheck, cartStockCheck, async (req, res) => {
  // OK!
  const { carts } = req.locals;

  for (let i = 0; i < carts.length; i++) {
    const stock = await getProductStockBySize(carts[i].productId, carts[i].size);

    if (stock.quantity < carts[i].quantity)
      return res.status(406).send({ message: '상품의 재고가 없습니다. 수량을 다시 선택해주세요' });
  }

  res.send({ message: '장바구니 상품들의 수량을 모두 확인했습니다.' });
});

router.post('/me/:id', authCheck, cartStockCheck, async (req, res) => {
  // OK!
  const { email } = req.locals;
  const { id } = req.params;
  const { size, quantity = 1 } = req.body;

  // 이번에 요청한 상품의 재고 확인
  const stock = await getProductStockBySize(id, size);
  const selectedQuantity = (await countSelectedUserCarts(email, id, size)) + quantity;

  if (stock.quantity < selectedQuantity)
    return res.status(406).send({ message: '상품의 재고가 없습니다. 수량을 다시 선택해주세요' });

  const cart = await createUserCart(email, id, size, quantity);

  res.send(cart);
});

// cart 변경
router.patch('/me/:id', authCheck, cartStockCheck, async (req, res) => {
  // OK!
  const { email } = req.locals;
  const { id: cartId } = req.params;
  const { size, quantity = 1 } = req.body;

  // 이번에 요청한 상품의 재고 확인
  const cart = await getUserCart(email, cartId, size);

  if (!cart?.productId) return res.status(406).send({ message: '잘못된 상품을 선택했습니다.' });

  const stock = await getProductStockBySize(cart.productId, size);

  if (stock.quantity < quantity)
    return res.status(406).send({ message: '상품의 재고가 없습니다. 수량을 다시 선택해주세요' });

  await updateUserCart(email, cartId, size, quantity);
  await deleteQuantityZero(email);

  res.send({ message: '장바구니 상품이 변경되었습니다.' });
});

// 삭제
router.delete('/me/:id', authCheck, cartStockCheck, async (req, res) => {
  const { email } = req.locals;
  const { id: cartId } = req.params;

  await deleteUserCart(email, cartId);
  res.send({ message: '장바구니 상품이 삭제되었습니다.' });
});

module.exports = router;
