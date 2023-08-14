import { removeFavorite } from 'api/fetch';
import { useOptimisticMutation } from 'hooks/mutation';
import { QUERY_KEY } from 'constants';

const useRemoveWishItemMutation = () =>
  useOptimisticMutation({
    queryKey: QUERY_KEY.WISHLIST,
    mutationFn: removeFavorite,
    onMutate(favoriteId) {
      return favorites => favorites.filter(favorite => favorite._id !== favoriteId);
    },
  });

export default useRemoveWishItemMutation;
