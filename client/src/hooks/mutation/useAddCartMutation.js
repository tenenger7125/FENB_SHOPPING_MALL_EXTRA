import { addCart } from 'api/fetch';
import { usePessimisticMutation } from 'hooks/mutation';
import { QUERY_KEY } from 'constants';

const useAddCartMutation = () =>
  usePessimisticMutation({
    queryKey: QUERY_KEY.CARTS,
    mutationFn: addCart,
    onSuccess(newCart) {
      // 같은 상품 같은 사이즈면, 해당 cart 아이템의 qunatity를 1만 더하고 아니라면 새로운 cart 아이템을 추가한다
      return (carts = []) => {
        const existingCart = carts.find(cart => cart.productId === newCart.productId && cart.size === newCart.size);

        return existingCart
          ? carts.map(cart => (cart._id === existingCart._id ? { ...cart, quantity: cart.quantity + 1 } : cart))
          : [...carts, newCart];
      };
    },
  });

export default useAddCartMutation;
