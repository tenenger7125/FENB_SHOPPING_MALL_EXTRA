import { removeAddress } from 'api/fetch';
import { useOptimisticMutation } from 'hooks/mutation';
import { QUERY_KEY } from 'constants';

const useRemoveAddressMutation = () =>
  useOptimisticMutation({
    queryKey: QUERY_KEY.ADDRESSES,
    mutationFn: removeAddress,
    onMutate(addressId) {
      return addresses => addresses.filter(address => address._id !== addressId);
    },
  });

export default useRemoveAddressMutation;
