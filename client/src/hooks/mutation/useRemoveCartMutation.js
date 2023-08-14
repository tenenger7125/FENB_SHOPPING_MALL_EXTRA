import { removeCart } from 'api/fetch';
import { useOptimisticMutation } from 'hooks/mutation';
import { QUERY_KEY } from 'constants';

const useRemoveCartMutation = () =>
  useOptimisticMutation({
    queryKey: QUERY_KEY.CARTS,
    mutationFn: removeCart,
    onMutate(id) {
      return carts => carts.filter(cart => cart._id !== id);
    },
  });

export default useRemoveCartMutation;
