import { addAddress } from 'api/fetch';
import { usePessimisticMutation } from 'hooks/mutation';
import { QUERY_KEY } from 'constants';

const useAddAddressMutation = () =>
  usePessimisticMutation({
    queryKey: QUERY_KEY.ADDRESSES,
    mutationFn: addAddress,
    onSuccess(newAddress) {
      return addresses => [...addresses, newAddress];
    },
  });

export default useAddAddressMutation;
