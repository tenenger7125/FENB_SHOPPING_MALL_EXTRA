import { changeCartQuantity } from 'api/fetch';
import { useOptimisticMutation } from 'hooks/mutation';
import { QUERY_KEY } from 'constants';

const useChangeCartQuantityMutation = () =>
  useOptimisticMutation({
    queryKey: QUERY_KEY.CARTS,
    mutationFn: changeCartQuantity,
    onMutate({ id: cartId, size, quantity }) {
      return carts => carts.map(cart => (cart._id === cartId && cart.size === size ? { ...cart, quantity } : cart));
    },
  });

export default useChangeCartQuantityMutation;
