import { Link } from 'react-router-dom';

import { Grid, Image, Text, Card, Group, Badge } from '@mantine/core';

import { SadIcon } from 'components/common';
import { PATH } from 'constants';

const ResultProducts = ({ products }) =>
  products.length ? (
    <Grid>
      {products.map(({ _id: id, imgURL, name, price, brand, feature }) => (
        <Grid.Col
          key={id}
          span={4}
          sx={{
            '@media (max-width: 1200px)': {
              flexBasis: 'calc(100% / 3)',
              maxWidth: 'calc(100% / 3)',
            },
            '@media (max-width: 950px)': {
              flexBasis: '50%',
              maxWidth: '50%',
            },
            '@media (max-width: 480px)': {
              flexBasis: '100%',
              maxWidth: '100%',
            },
          }}>
          <Link to={`${PATH.PRODUCTS}/${id}`}>
            <Card fz="1.6rem" padding="lg" withBorder>
              <Card.Section pos="relative">
                <Image alt={name} src={imgURL} />
              </Card.Section>

              <Group mb="xs" mt="md" position="apart" noWrap>
                <Text weight={500} truncate>
                  {name}
                </Text>
                <Badge color="skyblue" size="xl" sx={{ flexShrink: 0 }} variant="light">
                  무료배송
                </Badge>
              </Group>

              <Text align="left" color="dimmed" size="1.4rem">
                {brand.kr} / {feature}
              </Text>
              <Text fw={500} m="1rem 0" size="1.5rem">
                {`${price.toLocaleString('ko-KR')} 원`}
              </Text>
            </Card>
          </Link>
        </Grid.Col>
      ))}
    </Grid>
  ) : (
    <SadIcon>등록된 상품이 없습니다.</SadIcon>
  );

export default ResultProducts;
