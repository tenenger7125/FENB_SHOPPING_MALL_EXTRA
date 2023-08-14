import { updatePassword } from 'api/fetch';
import { usePessimisticMutation } from 'hooks/mutation';
import { QUERY_KEY } from 'constants';

const useUpdatePasswordMutation = () =>
  usePessimisticMutation({
    queryKey: QUERY_KEY.USER,
    mutationFn: updatePassword,
    onSuccess(password) {
      return user => ({ ...user, ...password });
    },
  });

export default useUpdatePasswordMutation;
