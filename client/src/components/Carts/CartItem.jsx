import { useRef, useState } from 'react';

import { Link } from 'react-router-dom';

import { Stack, Group, Image, Title, Text, ActionIcon, NumberInput, useMantineTheme } from '@mantine/core';
import { BiTrash } from 'react-icons/bi';

import { useMediaQuery } from 'hooks';
import { useQuantityOfStocks } from 'hooks/carts';
import { useChangeCartQuantityMutation, useRemoveCartMutation } from 'hooks/mutation';
import { PATH, MEDIAQUERY_WIDTH } from 'constants';

const CartItem = ({ cart: { _id: id, productId, category, color, name, price, imgURL, size, quantity } }) => {
  const matches = useMediaQuery(`(min-width: ${MEDIAQUERY_WIDTH.TABLET}px)`);
  const { colors, colorScheme } = useMantineTheme();

  const { mutate: changeCartQuantity } = useChangeCartQuantityMutation();
  const { mutate: removeCart } = useRemoveCartMutation();
  const { stock: maxQuantity, refetch } = useQuantityOfStocks(productId, size);

  // ❗ 수량 변경했을 때, 재고보다 더 담을 경우, 더 담을 수 없다고 UI 적으로 표현하기 toast?
  const [isStockLack, setIsStockLack] = useState(quantity > maxQuantity);
  const handlers = useRef(null);

  const handleUpdateCartQuantityChange = quantity => {
    try {
      changeCartQuantity({ id, size, quantity });
      setIsStockLack(false);
    } catch {
      setIsStockLack(true);
      refetch(); // 잘 작동하는지 확인 필요
    }
  };
  const handleRemoveCartClick = () => removeCart(id);
  const handleIncreaseCartQuantityClick = () => {
    handlers.current.increment();
    if (quantity >= maxQuantity) setIsStockLack(true);
  };
  const handleDecreaseCartQuantityClick = () => {
    handlers.current.decrement();
    if (quantity <= 1) setIsStockLack(true);
  };

  return (
    <Stack
      c="gray.6"
      mb="0.8rem"
      py="2.4rem"
      sx={{ borderBottom: `1px solid ${colorScheme === 'dark' ? colors.gray[8] : colors.gray[3]}` }}>
      <Group spacing="1.6rem" sx={{ flexWrap: 'nowrap' }}>
        <Link to={`${PATH.PRODUCTS}/${productId}`}>
          <Image alt={name} height="18rem" src={imgURL} width={matches ? '18rem' : '15rem'} withPlaceholder />
        </Link>

        <Stack justify="space-between" spacing="1.6rem" sx={{ flexGrow: 1 }}>
          <Group align="flex-start" position="apart">
            <Stack spacing="0.2rem">
              <Title
                c={colorScheme === 'dark' ? 'gray.6' : colors.gray[9]}
                fw="bold"
                fz="1.6rem"
                mb="0.8rem"
                sx={{ cursor: 'pointer' }}>
                <Link to={`${PATH.PRODUCTS}/${productId}`}>{name}</Link>
              </Title>
              <Text>{category.kr}</Text>
              <Text>{color.kr}</Text>
              <Text>사이즈 {size}</Text>
              <Group spacing={0}>
                <Text>수량</Text>
                <ActionIcon
                  fw="bold"
                  fz="1.5rem"
                  size="3rem"
                  variant="transparent"
                  onClick={handleDecreaseCartQuantityClick}>
                  –
                </ActionIcon>
                <NumberInput
                  handlersRef={handlers}
                  max={maxQuantity}
                  min={1}
                  size="lg"
                  value={quantity}
                  w="4rem"
                  styles={{
                    input: {
                      textAlign: 'center',
                      borderColor: `${colorScheme === 'dark' && colors.gray[7]}`,
                      '&:disabled': {
                        backgroundColor: 'transparent',
                        color: `${colorScheme === 'dark' ? colors.gray[2] : colors.gray[9]}`,
                        cursor: 'default',
                      },
                    },
                  }}
                  disabled
                  hideControls
                  onChange={handleUpdateCartQuantityChange}
                />
                <ActionIcon
                  fw="bold"
                  fz="1.5rem"
                  size="3rem"
                  variant="transparent"
                  onClick={handleIncreaseCartQuantityClick}>
                  +
                </ActionIcon>
              </Group>
              {isStockLack && (
                <Text c={colorScheme === 'dark' ? 'red.9' : 'red.5'} fz="1.4rem">
                  상품의 재고가 부족합니다
                </Text>
              )}
            </Stack>
            <Stack c={colorScheme === 'dark' ? 'gray.6' : colors.gray[1]} spacing={0}>
              <Title c={colorScheme === 'dark' ? 'gray.6' : 'dark'} fz="1.6rem">
                {(price * quantity).toLocaleString('ko-KR')} 원
              </Title>
            </Stack>
          </Group>
          <BiTrash size="2.4rem" style={{ cursor: 'pointer' }} onClick={handleRemoveCartClick} />
        </Stack>
      </Group>
      <Text color={colorScheme === 'dark' ? 'gray.6' : 'dark'}>무료 배송</Text>
    </Stack>
  );
};

export default CartItem;
