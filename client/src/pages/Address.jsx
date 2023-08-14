import { useRef } from 'react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button, Modal, Stack, Title, useMantineTheme, Center, Container } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';

import { AddressItem } from 'components/Order';
import { FormAddressInput, FormInput, FormPhoneInput } from 'components/Sign';
import { useAddresses } from 'hooks/address';
import {
  useAddAddressMutation,
  useChangeDefaultAddressMutation,
  useRemoveAddressMutation,
  useUpdateAddressMutation,
} from 'hooks/mutation';
import { addressSchema } from 'schema';
import { MEDIAQUERY_WIDTH } from 'constants';

const Address = () => {
  const matches = useMediaQuery(`(min-width: ${MEDIAQUERY_WIDTH.TABLET}px)`);
  const { colors, colorScheme } = useMantineTheme();

  const [opened, { open, close }] = useDisclosure(false);

  const addressId = useRef();

  const addresses = useAddresses();
  const { mutate: changeDefaultAddress } = useChangeDefaultAddressMutation();
  const { mutate: removeAddress } = useRemoveAddressMutation();

  const resetAddressId = () => {
    addressId.current = null;
  };

  const handleUpdateDefaultAddressClick = _addressId => e => {
    e.stopPropagation();
    changeDefaultAddress(_addressId);
  };

  const handleRemoveAddressClick = _addressId => e => {
    e.stopPropagation();
    removeAddress(_addressId);
  };

  const handleUpdateClick = _addressId => e => {
    e.stopPropagation();
    addressId.current = _addressId;
    open();
  };

  const handleCloseClick = () => {
    resetAddressId();
    close();
  };

  return (
    <>
      <Stack pb="2rem" px="0.8rem" spacing="3.2rem" w="100%">
        <Title
          fz={matches ? '2.4rem' : '2.1rem'}
          mb="3.2rem"
          pb="2rem"
          sx={{ borderBottom: `2px solid ${colorScheme === 'dark' ? colors.gray[6] : colors.gray[8]}` }}>
          배송지
        </Title>

        <Stack maw="70rem" px="2rem" w="100%">
          {addresses.map(address => (
            <AddressItem
              key={address._id}
              address={address}
              handleRemoveAddressClick={handleRemoveAddressClick}
              handleUpdateClick={handleUpdateClick}
              handleUpdateDefaultAddressClick={handleUpdateDefaultAddressClick}
            />
          ))}
          <Center>
            <Button
              color="gray"
              fz="1.6rem"
              h="6rem"
              hw="bold"
              mt="2rem"
              p="1.8rem 2.4rem"
              variant="outline"
              w="20rem"
              sx={{
                borderRadius: '30px',
                width: '20rem',
                ':hover': { backgroundColor: 'transparent', borderColor: colors.blue[6], color: colors.blue[6] },
              }}
              onClick={() => open()}>
              새 배송지 추가
            </Button>
          </Center>
        </Stack>
      </Stack>

      <Modal.Root fz="1.6rem" opened={opened} size="50rem" onClose={handleCloseClick}>
        <Modal.Overlay />
        <Modal.Content px="1.2rem" py="2rem" sx={{ borderRadius: '10px' }}>
          <Modal.Header>
            <Modal.Title fw="bold" fz="2rem" pl="1.2rem">
              {addressId.current ? '배송지 수정' : '배송지 입력'}
            </Modal.Title>
            <Modal.CloseButton size="2.8rem" />
          </Modal.Header>
          <Modal.Body>
            <InputAddress addressId={addressId} close={close} resetAddressId={resetAddressId} />
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  );
};

// Order page의 Address component와 유사함
const InputAddress = ({ close, addressId, resetAddressId }) => {
  const { colors } = useMantineTheme();
  const matches = useMediaQuery(`(min-width: ${MEDIAQUERY_WIDTH.TABLET}px)`);

  const currentAddress =
    useAddresses({ select: addresses => addresses.find(({ _id }) => _id === addressId.current) }) ?? {};

  const { handleSubmit, register, formState, trigger, setValue, reset } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: currentAddress.recipient || '',
      phone: currentAddress.recipientPhone || '',
      postcode: currentAddress.postcode || '',
      mainAddress: currentAddress.mainAddress || '',
      detailAddress: currentAddress.detailAddress || '',
    },
  });

  const { mutate: addAddress } = useAddAddressMutation();
  const { mutate: updateAddress } = useUpdateAddressMutation();

  const handleAddressSubmit = data => {
    if (addressId.current === null) addAddress(data);
    else updateAddress({ id: addressId.current, isDefault: currentAddress.isDefault, ...data });

    reset();
    resetAddressId();
    close();
  };

  return (
    <Container miw={matches ? '45rem' : '32rem'}>
      <form noValidate onSubmit={handleSubmit(handleAddressSubmit)}>
        <FormInput
          formState={formState}
          id="name"
          label="이름"
          placeholder="김펜비"
          register={register}
          type="text"
          withAsterisk
        />
        <FormPhoneInput
          formState={formState}
          id="phone"
          label="휴대전화번호"
          placeholder="'-' 없이 입력"
          register={register}
          setValue={setValue}
          trigger={trigger}
          type="tel"
          withAsterisk
        />
        <FormAddressInput
          formState={formState}
          id="postcode"
          label="우편번호"
          placeholder="주소찾기 버튼을 클릭주세요."
          register={register}
          setValue={setValue}
          type="text"
          readOnly
          withAsterisk
        />
        <FormInput
          formState={formState}
          id="mainAddress"
          label="주소"
          placeholder="주소를 선택하시면 자동으로 입력됩니다."
          register={register}
          type="text"
          readOnly
          withAsterisk
        />
        <FormInput
          formState={formState}
          id="detailAddress"
          label="상세주소"
          placeholder="상세 주소를 입력하세요."
          register={register}
          type="text"
        />
        <Center>
          <Button
            color="gray"
            fz="1.6rem"
            h="6rem"
            hw="bold"
            mt="2rem"
            p="1.8rem 2.4rem"
            type="submit"
            variant="outline"
            w="20rem"
            sx={{
              width: '20rem',
              ':hover': {
                backgroundColor: 'transparent',
                borderColor: colors.blue[6],
                color: colors.blue[6],
              },
              borderRadius: '30px',
            }}>
            {addressId.current ? '배송지 수정' : '배송지 추가'}
          </Button>
        </Center>
      </form>
    </Container>
  );
};

export default Address;
