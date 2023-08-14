import { Stack, Title, useMantineTheme } from '@mantine/core';

import { Filter, Product } from 'components/History';
import { useMediaQuery } from 'hooks';
import { useFilteredHistories } from 'hooks/history';
import { MEDIAQUERY_WIDTH } from 'constants';

const History = () => {
  const matches = useMediaQuery(`(min-width: ${MEDIAQUERY_WIDTH.TABLET}px)`);
  const { colors, colorScheme } = useMantineTheme();

  const { filteredHistories, setMonth } = useFilteredHistories();

  const handleMonthClick = selectedMonth => () => {
    setMonth(selectedMonth);
  };

  return (
    <Stack pb="2rem" px="0.8rem" spacing="3.2rem" w="100%">
      <Title
        fz={matches ? '2.4rem' : '2.1rem'}
        mb="3.2rem"
        pb="2rem"
        sx={{ borderBottom: `2px solid ${colorScheme === 'dark' ? colors.gray[6] : colors.gray[8]}` }}>
        구매내역
      </Title>
      <Filter handleMonthClick={handleMonthClick} />
      {filteredHistories.map(history => (
        <Product key={history._id} history={history} />
      ))}
    </Stack>
  );
};

export default History;
