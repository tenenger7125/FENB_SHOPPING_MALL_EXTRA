import { order } from 'api/fetch';
import { useOptimisticMutation } from 'hooks/mutation';
import { QUERY_KEY } from 'constants';

const useOrderMutation = () =>
  useOptimisticMutation({
    queryKey: QUERY_KEY.CARTS,
    mutationFn: order,
    onMutate() {
      return () => [];
    },
  });

export default useOrderMutation;
