const router = require('express').Router();

const { authCheck } = require('../middleware/auth');
const { toggleProductFavorite, getProduct, updateProductFavorite } = require('../controllers/products');
const {
  addFavorite,
  deleteUserFavorite,
  getUserFavorites,
  hasUserFavorite,
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

  const isFavorite = await hasUserFavorite(email, productId);
  const delta = isFavorite ? -1 : 1;

  if (isFavorite) deleteUserFavorite(email, productId);
  else createUserFavorite(email, productId);

  updateProductFavorite(productId, delta);

  res.send({ message: `위시리스트에 ${isFavorite ? '제거' : '추가'}되었습니다.` });
});

module.exports = router;
