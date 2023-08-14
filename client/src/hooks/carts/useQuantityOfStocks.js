import { useQuery } from '@tanstack/react-query';

import { productsQuery } from '../../api/query';

const useQuantityOfStocks = (productId, size) => {
  const { data: stocks, refetch } = useQuery(
    productsQuery({ select: products => products.find(product => product._id === productId).stocks })
  );

  return { stock: stocks?.find(stock => stock.size === size).quantity, refetch };
};

export default useQuantityOfStocks;
