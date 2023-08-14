import { useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { Container, Image } from '@mantine/core';
import { Carousel as MantineCarousel } from '@mantine/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';

import { addCoupon } from 'api/fetch';
import { slidesQuery, verifyQuery } from 'api/query';
import { useMediaQuery } from 'hooks';
import { PATH, MEDIAQUERY_WIDTH } from 'constants';

const Carousel = ({ modalOpen, setModalTitle }) => {
  const mobileMatches = useMediaQuery(`(min-width: ${MEDIAQUERY_WIDTH.MOBILE}px)`);

  const navigate = useNavigate();

  const { data: slides } = useQuery(slidesQuery());
  const { data: verify } = useQuery(verifyQuery());

  const [carouselIdx, setCarouselIdx] = useState(0);
  const autoplay = useRef(Autoplay({ delay: 2000 }));

  const currentBackgroundColor = slides.find((_, idx) => idx === carouselIdx).sideBackgroundColor;

  const handleCarouselClick = couponId => async () => {
    if (!verify) navigate(PATH.SIGNIN);

    try {
      const { message } = await addCoupon(couponId);
      setModalTitle(message);
    } catch (e) {
      const { message } = e.response.data;
      setModalTitle(message);
    } finally {
      modalOpen();
    }
  };

  return (
    <Container
      bg={currentBackgroundColor}
      maw="100%"
      pos="relative"
      w="100%"
      sx={{
        transition: 'all .1s ',
      }}>
      <MantineCarousel
        maw="120rem"
        mx="auto"
        nextControlIcon={<SlArrowRight color="white" size={mobileMatches ? '5rem' : '2rem'} />}
        plugins={[autoplay.current]}
        pos="static"
        previousControlIcon={<SlArrowLeft color="white" size={mobileMatches ? '5rem' : '2rem'} />}
        styles={() => ({
          control: {
            border: 'none',
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
          indicator: {
            width: '1rem',
            height: '1rem',
          },
        })}
        loop
        withIndicators
        onMouseEnter={autoplay.current.stop}
        onMouseLeave={autoplay.current.reset}
        onSlideChange={setCarouselIdx}>
        {slides.map(({ _id: id, couponId, imgURL, alt }) => (
          <MantineCarousel.Slide key={id} sx={{ cursor: 'pointer' }} onClick={handleCarouselClick(couponId)}>
            <Image alt={alt} fit="contain" height={mobileMatches ? '45rem' : '30rem'} src={imgURL} withPlaceholder />
          </MantineCarousel.Slide>
        ))}
      </MantineCarousel>
    </Container>
  );
};

export default Carousel;
