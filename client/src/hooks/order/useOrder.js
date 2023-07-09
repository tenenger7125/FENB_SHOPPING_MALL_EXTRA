import { useState } from 'react';

import { applyCoupon } from 'api/fetch';

const useOrder = totalPrice => {
  const [discount, setDiscount] = useState({ discountAmount: 0, discountedTotalPrice: totalPrice });

  const updateDiscount = async couponId => {
    const data = await applyCoupon(couponId);

    setDiscount({ ...discount, ...data });
  };

  return { discount, updateDiscount };
};

export default useOrder;
