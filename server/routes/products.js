const router = require('express').Router();

const { getProductsByQuery, getPageProducts } = require('../controllers/products');

router.get('/', async (req, res) => {
  // OK!
  const { search, category } = req.query;

  const queriedProducts = await getProductsByQuery(search, category);
  res.send(queriedProducts);
});

router.get('/pages/:page', async (req, res) => {
  // OK!
  const page = +req.params.page;
  const pageSize = +(req.query.pageSize ?? 5);
  const pageProducts = await getPageProducts(page, pageSize);

  res.send(pageProducts);
});

module.exports = router;
