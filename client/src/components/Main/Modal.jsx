import { Button, Modal as MantineModal, Text } from '@mantine/core';

import { useMediaQuery } from 'hooks';
import { MEDIAQUERY_WIDTH } from 'constants';

const Modal = ({ title, modalIsOpen, modalClose }) => {
  const mobileMatches = useMediaQuery(`(min-width: ${MEDIAQUERY_WIDTH.MOBILE}px)`);

  return (
    <MantineModal
      opened={modalIsOpen}
      padding="xl"
      size={mobileMatches ? 'lg' : 'md'}
      ta="center"
      transitionProps={{ transition: 'rotate-left' }}
      styles={() => ({
        close: {
          width: '3rem',
          height: '3rem',

          svg: {
            width: '3rem',
            height: '3rem',
          },
        },
      })}
      centered
      onClose={modalClose}>
      <Text fz="2.4rem" p="5rem 0" weight="bold">
        {title}
      </Text>
      <Button h="5rem" size="2rem" fullWidth onClick={modalClose}>
        확인
      </Button>
    </MantineModal>
  );
};

export default Modal;
