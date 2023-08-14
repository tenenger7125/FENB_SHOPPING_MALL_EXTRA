import { updateAddress } from 'api/fetch';
import { useOptimisticMutation } from 'hooks/mutation';
import { QUERY_KEY } from 'constants';

const useUpdateAddressMutation = () =>
  useOptimisticMutation({
    queryKey: QUERY_KEY.ADDRESSES,
    mutationFn: updateAddress,
    onMutate({ id, name, phone, mainAddress, detailAddress, postcode }) {
      return addresses =>
        addresses.map(address =>
          address._id === id
            ? {
                _id: id,
                recipient: name,
                recipientPhone: phone,
                mainAddress,
                detailAddress,
                postcode,
              }
            : address
        );
    },
  });

export default useUpdateAddressMutation;
