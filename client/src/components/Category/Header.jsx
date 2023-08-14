import { Container, Select, Flex, useMantineColorScheme } from '@mantine/core';

import { useMediaQuery } from 'hooks';
import { useCategory } from 'hooks/products';
import { MEDIAQUERY_WIDTH } from 'constants';

const SORT_OPTIONS = [
  { value: 'favorite', label: '추천순' },
  { value: 'new', label: '최신순' },
  { value: 'high', label: '높은 가격순' },
  { value: 'low', label: '낮은 가격순' },
];

const Header = ({ sortOption, searchValue, productCount, handleSelectSortOptionClick }) => {
  const matches = useMediaQuery(`(min-width: ${MEDIAQUERY_WIDTH.TABLET}px)`);
  const { colorScheme } = useMantineColorScheme();

  const categories = useCategory();

  const filteredCategories = categories.reduce((acc, cur) => {
    acc[cur.en] = cur.kr;
    return acc;
  }, {});

  return (
    <Flex
      align={matches && 'center'}
      bg={colorScheme === 'dark' ? 'dark.7' : 'white'}
      direction={matches ? 'row' : 'column'}
      justify="space-between"
      pos="sticky"
      sx={{ zIndex: 99 }}
      top={-1}>
      <Container fw="600" fz="2.4rem" m="0" p="1.5rem 1rem">
        {filteredCategories[searchValue] ? `${filteredCategories[searchValue]}` : `${searchValue}`}
        {` (${productCount})`}
      </Container>
      <Select
        data={SORT_OPTIONS}
        maxDropdownHeight={500}
        size={matches ? 'xl' : 'md'}
        value={sortOption}
        styles={theme => ({
          input: {
            fontSize: '1.4rem',
            '&:focus': {
              borderColor: theme.colors.gray[4],
            },
          },
          item: {
            '&[data-selected]': {
              '&, &:hover': {
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[7] : theme.colors.gray[1],
                color: theme.colorScheme === 'dark' ? theme.white : 'black',
              },
            },
          },
        })}
        onChange={handleSelectSortOptionClick}
      />
    </Flex>
  );
};

export default Header;
