import { useQuery } from '@tanstack/react-query';

import { cartsQuery } from '../../api/query';

const useQuantityOfStocks = (id, size) => {
  const { data: stocks } = useQuery(
    cartsQuery({
      select(carts) {
        return carts.find(cart => cart._id === id)?.stocks;
      },
    })
  );

  return stocks?.find(stock => stock.size === size).quantity;
};

export default useQuantityOfStocks;
