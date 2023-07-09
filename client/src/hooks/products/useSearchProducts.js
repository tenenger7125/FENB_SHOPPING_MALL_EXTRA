import { useQuery } from '@tanstack/react-query';

import { productsQuery } from 'api/query';

const useSearchProducts = () => {
  const { data: searchProducts } = useQuery(
    productsQuery({
      select: products => products.map(({ _id: id, name, brand, category }) => ({ id, value: name, brand, category })),
    })
  );

  return searchProducts;
};

export default useSearchProducts;
