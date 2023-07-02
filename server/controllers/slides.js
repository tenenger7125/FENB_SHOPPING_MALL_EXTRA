const { Slide } = require('../models/shop');
const { getCoupon } = require('./coupons');

const createSlides = async slide => {
  // OK!
  try {
    const createdSlide = await Slide.create(slide);

    return createdSlide;
  } catch (err) {
    console.error('슬라이드를 추가하는데 실패했습니다.', err);
  }
};

const getSlides = async () => {
  // OK!
  try {
    const slides = await Slide.find();

    console.log(slides);
    return slides;
  } catch (err) {
    console.error('슬라이드를 가져오는데 실패했습니다.', err);
  }
};

module.exports = { createSlides, getSlides };
