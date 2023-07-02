const router = require('express').Router();

const { getSlides } = require('../controllers/slides');

router.get('/', async (req, res) => {
  const slides = await getSlides();

  res.send(slides);
});

module.exports = router;
