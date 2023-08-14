import { Button, CloseButton, Group, Stack, Text, useMantineTheme } from '@mantine/core';
import { FaHome, FaEdit } from 'react-icons/fa';
import { MdPublishedWithChanges } from 'react-icons/md';

const AddressItem = ({
  address: { _id: id, recipient, mainAddress, detailAddress, postcode, recipientPhone, isDefault },
  addressId,
  handleRemoveAddressClick,
  handleSelectAddressClick,
  handleUpdateDefaultAddressClick,
  handleUpdateClick,
}) => {
  const { colors, colorScheme } = useMantineTheme();

  return (
    <Stack
      p="0.8rem"
      size="content-fit"
      spacing={0}
      sx={{
        width: '100%',
        border: `1px solid ${id === addressId ? colors.blue[6] : colors.gray[6]}`,
        borderRadius: '5px',
        cursor: 'pointer',
        ':hover': { borderColor: colors.blue[6] },
      }}
      onClick={handleSelectAddressClick && handleSelectAddressClick(id)}>
      <Group align="flex-start" position="apart" sx={{ flexWrap: 'nowrap' }}>
        <Stack spacing={0}>
          <Group align="center" justify="center" spacing="0.4rem">
            <Text>{recipient}</Text>
            {isDefault && <FaHome />}
          </Group>
          <Text>{mainAddress}</Text>
          <Text>{detailAddress}</Text>
          <Text>{postcode}</Text>
          <Text>{recipientPhone}</Text>
        </Stack>
        <CloseButton
          color="dark"
          h="3.2rem"
          iconSize="1.6rem"
          p="0.4rem"
          sx={{ ':hover': { background: 'transparent', border: `1px solid ${colors.blue[6]}` } }}
          w="3.2rem"
          onClick={handleRemoveAddressClick(id)}
        />
      </Group>
      <Group position="right" pt="0.8rem">
        <Button
          color="dark"
          h="3.2rem"
          ml="auto"
          mr={0}
          py="0.8rem"
          variant="subtle"
          sx={{
            border: `1px solid ${colorScheme === 'dark' ? colors.gray[8] : colors.gray[3]}`,
            ':hover': { background: 'transparent', borderColor: colors.blue[6] },
          }}
          onClick={handleUpdateDefaultAddressClick(id)}>
          <Group spacing="0.4rem">
            <MdPublishedWithChanges color={colorScheme === 'dark' ? colors.gray[3] : colors.gray[7]} size="1.8rem" />
            <Text fw="normal" fz="1.3rem">
              기본 배송지로 변경
            </Text>
          </Group>
        </Button>
        {handleUpdateClick && (
          <Button
            color="dark"
            h="3.2rem"
            py="0.8rem"
            variant="subtle"
            sx={{
              border: `1px solid ${colorScheme === 'dark' ? colors.gray[8] : colors.gray[3]}`,
              ':hover': { background: 'transparent', borderColor: colors.blue[6] },
            }}
            onClick={handleUpdateClick(id)}>
            <Group spacing="0.4rem">
              <FaEdit color={colorScheme === 'dark' ? colors.gray[3] : colors.gray[7]} size="1.8rem" />
              <Text fw="normal" fz="1.3rem">
                수정
              </Text>
            </Group>
          </Button>
        )}
      </Group>
    </Stack>
  );
};

export default AddressItem;
