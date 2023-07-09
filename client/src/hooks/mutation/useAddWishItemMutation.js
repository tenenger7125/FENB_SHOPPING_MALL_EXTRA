import { addFavorite } from 'api/fetch';
import { usePessimisticMutation } from 'hooks/mutation';
import { QUERY_KEY } from 'constants';

const useAddWishItemMutation = () =>
  usePessimisticMutation({
    queryKey: QUERY_KEY.WISHLIST,
    mutationFn: addFavorite,
    onSuccess(favorite) {
      return wishList => [...wishList, favorite];
    },
  });

export default useAddWishItemMutation;
