import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import {
  Title,
  Container,
  Group,
  Card,
  Image,
  Text,
  Badge,
  UnstyledButton,
  Grid,
  useMantineTheme,
} from '@mantine/core';
import { BiTrash } from 'react-icons/bi';

import { NoProduct } from 'components/common';
import { favoritesQuery } from 'api/query';
import { useMediaQuery } from 'hooks';
import { useRemoveWishItemMutation } from 'hooks/mutation';
import { MEDIAQUERY_WIDTH, PATH } from 'constants';

const WishList = () => {
  const matches = useMediaQuery(`(min-width: ${MEDIAQUERY_WIDTH.TABLET}px)`);
  const theme = useMantineTheme();

  const navigate = useNavigate();

  const { data: favorites } = useQuery(favoritesQuery());

  const { mutate: removeFavorite } = useRemoveWishItemMutation();

  const handleRemoveWishItemClick = id => () => {
    removeFavorite(id);
  };

  const handleProductClick = id => () => {
    navigate(`${PATH.PRODUCTS}/${id}`);
  };

  return (
    <Container size="120rem">
      <Title>관심상품 목록</Title>
      {favorites.length ? (
        <Grid p="3.5rem">
          {favorites.map(({ _id: id, productId, imgURL, name, brand, price, feature }) => (
            <Grid.Col
              key={id}
              span={4}
              sx={{
                '@media (max-width: 768px)': {
                  flexBasis: '50%',
                  maxWidth: '50%',
                },
                '@media (max-width: 480px)': {
                  flexBasis: '100%',
                  maxWidth: '100%',
                },
              }}>
              <Card fz="1.6rem" maw={matches ? '35rem' : '20rem'} mx="auto" padding="lg" withBorder>
                <Card.Section>
                  <Image alt={name} src={imgURL} sx={{ cursor: 'pointer' }} onClick={handleProductClick(productId)} />
                </Card.Section>

                <Group mb="xs" mt="md" position="apart" noWrap>
                  <Text sx={{ cursor: 'pointer' }} weight={500} truncate onClick={handleProductClick(productId)}>
                    {name}
                  </Text>
                  <Badge color="skyblue" h="2rem" sx={{ flexShrink: 0 }} variant="light">
                    무료배송
                  </Badge>
                </Group>

                <Text align="left" color="dimmed" size="1.4rem">
                  {brand.kr} / {feature}
                </Text>

                <Group my="md" position="apart">
                  <Text fw="500">{`${price.toLocaleString('ko-KR')} 원`}</Text>
                  <UnstyledButton sx={{ cursor: 'pointer' }} onClick={handleRemoveWishItemClick(id)}>
                    <BiTrash color={theme.colors.gray[6]} size="2.5rem" />
                  </UnstyledButton>
                </Group>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      ) : (
        <NoProduct pageName={'관심상품 목록'} />
      )}
    </Container>
  );
};

export default WishList;
