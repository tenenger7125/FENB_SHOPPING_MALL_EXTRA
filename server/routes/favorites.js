const router = require('express').Router();

const { authCheck } = require('../middleware/auth');
const { updateProductFavorite } = require('../controllers/products');
const {
  deleteUserFavorite,
  getUserFavorites,
  getUserFavorite,
  createUserFavorite,
} = require('../controllers/favorites');

router.get('/me', authCheck, async (req, res) => {
  // OK!
  const { email } = req.locals;
  const favorites = await getUserFavorites(email);

  return res.send(favorites);
});

router.post('/me', authCheck, async (req, res) => {
  // OK!
  const { email } = req.locals;
  const { id: productId } = req.body;

  const user = await createUserFavorite(email, productId);
  await updateProductFavorite(productId, 1);

  res.send(user.favorites.at(-1));
});

router.delete('/me/:id', authCheck, async (req, res) => {
  // OK!
  const { email } = req.locals;
  const { id: favoriteId } = req.params;

  const { productId } = await getUserFavorite(email, favoriteId);

  deleteUserFavorite(email, favoriteId);
  updateProductFavorite(productId, -1);

  res.send({ message: `관심상품에서 제거되었습니다.` });
});

module.exports = router;
