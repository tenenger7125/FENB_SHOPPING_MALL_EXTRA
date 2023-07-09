import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { favoritesQuery } from '../../api/query';

const useFavoriteProduct = () => {
  const { pathname } = useLocation();
  const productId = pathname.split('/').at(-1);

  const { data } = useQuery(
    favoritesQuery({
      select: favorites => favorites.find(favorite => favorite.productId === productId),
    })
  );
  return data;
};

export default useFavoriteProduct;
