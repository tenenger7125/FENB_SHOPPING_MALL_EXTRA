import { updatePhone } from 'api/fetch';
import { useOptimisticMutation } from 'hooks/mutation';
import { QUERY_KEY } from 'constants';

const useUpdatePhoneMutation = () =>
  useOptimisticMutation({
    queryKey: QUERY_KEY.USER,
    mutationFn: updatePhone,
    onMutate(phone) {
      return user => ({ ...user, ...phone });
    },
  });

export default useUpdatePhoneMutation;
