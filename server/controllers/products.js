const { Product } = require('../models/shop');
const { BRANDS, COLORS, GENDER, CATEGORIES } = require('../constants/products');

const createProduct = async productInfo => {
  // OK!
  try {
    const res = await Product.create({
      ...productInfo,
      brand: BRANDS[productInfo.brand],
      category: CATEGORIES[productInfo.category],
      color: COLORS[productInfo.color],
      gender: GENDER[productInfo.gender],
      favorites: productInfo.favorites || 0,
      dateOfManufacture: new Date(productInfo.dateOfManufacture),
    });
    return res;
  } catch (err) {
    console.error('상품 생성에 실패했습니다.', err);
  }
};

const getProducts = async () => {
  // OK!
  try {
    const products = await Product.find();
    return products;
  } catch (err) {
    console.error('모든 상품 목록을 가져오는데 실패했습니다.', err);
  }
};

const getPageProducts = async (page, pageSize) => {
  // OK!
  try {
    const count = await Product.estimatedDocumentCount();
    const products = await Product.find()
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    return {
      products,
      currentPage: page,
      totalProducts: count,
      totalPages: Math.ceil(count / pageSize),
    };
  } catch (err) {
    console.error('페이지별 상품 목록들을 가져오는데 실패했습니다.', err);
  }
};

const getProductById = async _id => {
  try {
    const productById = await Product.findById(_id);
    return productById;
  } catch (err) {
    console.error('id로 상품 목록을 가져오는데 실패했습니다.', err);
  }
};

const getProductsByQuery = async (searchQuery, categoryQuery) => {
  // OK!
  const query = searchQuery
    ? {
        $or: [
          { name: { $regex: searchQuery } },
          { 'brand.kr': { $regex: searchQuery } },
          { 'brand.en': { $regex: searchQuery } },
          { 'category.en': { $regex: searchQuery } },
          { 'category.kr': { $regex: searchQuery } },
        ],
      }
    : categoryQuery
    ? { 'category.en': { $regex: categoryQuery } }
    : {};

  try {
    const queriedProducts = await Product.find(query);
    return queriedProducts;
  } catch (err) {
    console.error('query로 상품 목록을 가져오는데 실패했습니다.', err);
  }
};

const updateProductFavorite = async (_id, delta) => {
  // user 작업 필수, favorite 작업 필수
  try {
    const updatedProduct = await Product.findOneAndUpdate({ _id }, { $inc: { favorites: delta } }, { new: true });

    return updatedProduct;
  } catch (err) {
    console.error('query로 상품 목록을 가져오는데 실패했습니다.', err);
  }
};

module.exports = {
  createProduct,
  getProducts,
  getPageProducts,
  getProductById,
  getProductsByQuery,
  updateProductFavorite,
};
