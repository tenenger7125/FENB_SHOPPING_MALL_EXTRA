import { changeDefaultAddress } from 'api/fetch';
import { useGenericMutation } from 'hooks/mutation';
import { QUERY_KEY } from 'constants';

const useChangeDefaultAddressMutation = () =>
  useGenericMutation({
    queryKey: QUERY_KEY.ADDRESSES,
    mutationFn: changeDefaultAddress,
    onMutate(addressId) {
      return addresses => addresses.map(address => ({ ...address, isDefault: address._id === addressId }));
    },
  });

export default useChangeDefaultAddressMutation;
