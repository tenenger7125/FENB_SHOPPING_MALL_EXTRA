import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://api.486-shoe.shop',
  withCredentials: true,
});

export const fetchProducts = async () => {
  const { data } = await instance.get('/api/products');
  return data;
};

export const fetchPageProducts = async (page, pageSize) => {
  const { data } = await instance.get(`/api/products/pages/${page}?pageSize=${pageSize}`);
  return data;
};

export const fetchFilteredProducts = search => async () => {
  const { data } = await instance.get(`/api/products${search}`);
  return data;
};

export const fetchSlides = async () => {
  const { data } = await instance.get('/api/slides');
  return data;
};

export const fetchUser = async () => {
  const { data } = await instance.get('api/users/me');
  return data;
};

export const signOut = async () => {
  await instance.get('api/auth/signout');
};

export const requestVerify = async () => {
  const { data } = await instance.get('/api/auth/verify');
  return data;
};

export const fetchFavorites = async () => {
  const { data } = await instance.get('/api/favorites/me');
  return data;
};

export const fetchCarts = async () => {
  const { data } = await instance.get('/api/carts/me');
  return data;
};

export const fetchAddresses = async () => {
  const { data } = await instance.get('api/users/me/address');
  return data;
};

export const fetchCoupons = async () => {
  const { data } = await instance.get('/api/coupons');
  return data;
};

export const applyCoupon = async id => {
  const { data } = await instance.get(`/api/order/coupons/${id}`);
  return data;
};

export const fetchHistory = async () => {
  const { data } = await instance.get('/api/order/history');
  return data;
};

export const signIn = async ({ email, password }) => {
  const { data } = await instance.post('/api/auth/signin', {
    email,
    password,
  });

  return data;
};

export const checkEmailDuplicate = async email => {
  const { data } = await instance.post('/api/auth/signup/email', {
    email,
  });

  return data;
};

export const signUp = async ({ email, name, password, phone, mainAddress, detailAddress, postcode }) => {
  await instance.post('/api/auth/signup', {
    email,
    name,
    phone,
    password,
    mainAddress,
    detailAddress,
    postcode,
  });
};

export const addCoupon = async id => {
  const { data } = await instance.post(`/api/coupons/${id}`);
  return data;
};

export const addFavorite = async productId => {
  const { data } = await instance.post('/api/favorites/me', { id: productId });
  return data;
};

export const addCart = async ({ id, size }) => {
  const { data } = await instance.post(`/api/carts/me/${id}`, { size });
  return data;
};

export const addAddress = async ({ name, phone, mainAddress, detailAddress, postcode }) => {
  const { data } = await instance.post('/api/users/me/address', {
    recipient: name,
    recipientPhone: phone,
    mainAddress,
    detailAddress,
    postcode,
  });

  return data;
};

export const order = async form => {
  await instance.post('/api/order/pay', form);
};

export const checkCorrespondPassword = async currentPassword => {
  const { data } = await instance.post('/api/users/me/password', currentPassword);

  return data;
};

export const checkCartQuantity = async () => {
  await instance.post(`/api/carts/quantity`);
};

export const changeCartQuantity = async ({ id, size, quantity }) => {
  await instance.patch(`/api/carts/me/${id}`, { size, quantity });
};

export const changeDefaultAddress = async id => {
  await instance.patch(`/api/users/me/address/default/${id}`);
};

export const updateAddress = async ({ id, name, phone, mainAddress, detailAddress, postcode }) => {
  await instance.patch(`/api/users/me/address/${id}`, {
    recipient: name,
    recipientPhone: phone,
    mainAddress,
    detailAddress,
    postcode,
  });
};

export const updatePassword = async newPassword => {
  await instance.patch('/api/users/me/password', newPassword);
};

export const updateName = async newName => {
  await instance.patch('/api/users/me/name', newName);
};

export const updatePhone = async newPhone => {
  await instance.patch('/api/users/me/phone', newPhone);
};

export const removeCart = async id => {
  await instance.delete(`/api/carts/me/${id}`);
};

export const removeAddress = async id => {
  await instance.delete(`/api/users/me/address/${id}`);
};

export const removeUser = async () => {
  await instance.delete('/api/users/me');
};

export const removeFavorite = async favoriteId => {
  await instance.delete(`/api/favorites/me/${favoriteId}`);
};
