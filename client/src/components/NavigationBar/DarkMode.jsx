import { ActionIcon, Tooltip, useMantineColorScheme } from '@mantine/core';
import { TbMoonFilled, TbSunFilled } from 'react-icons/tb';

import { useMediaQuery } from 'hooks';
import { MEDIAQUERY_WIDTH } from 'constants';

const DarkMode = () => {
  const mobileMatches = useMediaQuery(`(min-width: ${MEDIAQUERY_WIDTH.MOBILE}px)`);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <Tooltip label="다크모드">
      <ActionIcon
        color={colorScheme === 'dark' ? 'yellow.4' : 'gray.9'}
        size={mobileMatches ? 'xl' : 'lg'}
        sx={{
          ':hover': { backgroundColor: 'transparent' },
        }}
        onClick={toggleColorScheme}>
        {colorScheme === 'dark' ? <TbSunFilled size="2.8rem" /> : <TbMoonFilled size="2.8rem" />}
      </ActionIcon>
    </Tooltip>
  );
};

export default DarkMode;
