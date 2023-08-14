import { updateName } from 'api/fetch';
import { useOptimisticMutation } from 'hooks/mutation';
import { QUERY_KEY } from 'constants';

const useUpdateNameMutation = () =>
  useOptimisticMutation({
    queryKey: QUERY_KEY.USER,
    mutationFn: updateName,
    onMutate(name) {
      return user => ({ ...user, ...name });
    },
  });

export default useUpdateNameMutation;
