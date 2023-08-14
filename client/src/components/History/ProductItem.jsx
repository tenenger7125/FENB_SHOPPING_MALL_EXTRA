import { Link } from 'react-router-dom';

import { Stack, Text, Image, Flex } from '@mantine/core';

import { useMediaQuery } from 'hooks';
import { PATH, MEDIAQUERY_WIDTH } from 'constants';

const ProductItem = ({ product: { productId, imgURL, name, color, size } }) => {
  const mobileMatches = useMediaQuery(`(min-width: ${MEDIAQUERY_WIDTH.MOBILE}px)`);

  return (
    <Flex
      direction={mobileMatches ? 'row' : 'column'}
      mx={!mobileMatches && 'auto'}
      spacing="2.8rem"
      sx={{ flexWrap: 'nowrap' }}>
      <Link to={`${PATH.PRODUCTS}/${productId}`}>
        <Image height="24rem" src={imgURL} sx={{ minWidth: '24rem' }} width="24rem" />
      </Link>
      <Stack spacing={0} w={mobileMatches ? '100%' : '28rem'}>
        <Text c="green.8" fw="bold">
          주문완료
        </Text>
        <Link to={`${PATH.PRODUCTS}/${productId}`}>
          <Text fw="bold" my="1.6rem">
            상품이름 {name}
          </Text>
        </Link>
        <Text>색상: {color.kr}</Text>
        <Text>사이즈: {size}</Text>
      </Stack>
    </Flex>
  );
};

export default ProductItem;
