import { Link, Outlet, useLocation } from 'react-router-dom';

import { Container, Stack, Title, Text, Flex, Button, useMantineTheme, Drawer } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { BiFilter } from 'react-icons/bi';

import { useMediaQuery } from 'hooks';
import { PATH, MEDIAQUERY_WIDTH } from 'constants';

const MyPage = () => {
  const match = useMediaQuery(`(min-width: ${MEDIAQUERY_WIDTH.TABLET}px)`);
  const { colorScheme } = useMantineTheme();

  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Container c={colorScheme === 'dark' ? 'gray.5' : 'gray.8'} fz="1.6rem" size="140rem" w="100%">
      <Flex align="flex-start" direction={match ? 'row' : 'column'} justify="center" spacing="1.6rem">
        {match ? (
          <NavList />
        ) : (
          <>
            <Drawer.Root opened={opened} onClose={close}>
              <Drawer.Overlay />
              <Drawer.Content>
                <Drawer.Header m="1rem 0 0 1rem">
                  <Drawer.CloseButton size="2.8rem" />
                </Drawer.Header>
                <Drawer.Body>
                  <NavList />
                </Drawer.Body>
              </Drawer.Content>
            </Drawer.Root>

            <Button
              color="gray"
              fz="1.6rem"
              h="4rem"
              mb="3.2rem"
              mt="1.6rem"
              radius="md"
              variant={colorScheme === 'dark' ? 'outline' : 'default'}
              w="100%"
              onClick={open}>
              마이페이지
              <BiFilter size="2.5rem" />
            </Button>
          </>
        )}

        <Outlet />
      </Flex>
    </Container>
  );
};

const NavList = () => {
  const { colorScheme } = useMantineTheme();

  const { pathname } = useLocation();

  return (
    <Stack maw="25rem" pl="2rem" spacing="2rem" w="100%">
      <Title fz="2.4rem" mb="4.4rem" pb="2rem">
        마이 페이지
      </Title>
      <Link to={PATH.ACCOUNT}>
        <Text
          fw="bold"
          fz="2rem"
          c={
            pathname === PATH.ACCOUNT
              ? colorScheme === 'dark'
                ? 'gray.5'
                : 'gray.9'
              : colorScheme === 'dark'
              ? 'gray.7'
              : 'gray.6'
          }>
          계정 정보
        </Text>
      </Link>
      <Link to={PATH.HISTORY}>
        <Text
          fw="bold"
          fz="2rem"
          c={
            pathname === PATH.HISTORY
              ? colorScheme === 'dark'
                ? 'gray.5'
                : 'gray.9'
              : colorScheme === 'dark'
              ? 'gray.7'
              : 'gray.6'
          }>
          구매 내역
        </Text>
      </Link>
      <Link to={PATH.ADDRESS}>
        <Text
          fw="bold"
          fz="2rem"
          c={
            pathname === PATH.ADDRESS
              ? colorScheme === 'dark'
                ? 'gray.5'
                : 'gray.9'
              : colorScheme === 'dark'
              ? 'gray.7'
              : 'gray.6'
          }>
          배송지
        </Text>
      </Link>
    </Stack>
  );
};

export default MyPage;
