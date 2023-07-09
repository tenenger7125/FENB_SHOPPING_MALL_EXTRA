import { useQuery } from '@tanstack/react-query';

import { cartsQuery } from 'api/query';

const useTotalPrice = () => {
  const { data: totalPrice } = useQuery(
    cartsQuery({
      select(carts) {
        return carts.reduce((acc, cart) => acc + cart.quantity * cart.price, 0);
      },
    })
  );

  return totalPrice;
};

export default useTotalPrice;
