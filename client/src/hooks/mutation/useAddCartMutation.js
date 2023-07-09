import { addCart } from 'api/fetch';
import { usePessimisticMutation } from 'hooks/mutation';
import { QUERY_KEY } from 'constants';

const useAddCartMutation = () =>
  usePessimisticMutation({
    queryKey: QUERY_KEY.CARTS,
    mutationFn: addCart,
    onSuccess(cart) {
      return carts => [...(carts ?? []), cart];
    },
  });

export default useAddCartMutation;
