import { Box, CircularProgress } from '@mui/material';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import { Pagination } from 'swiper';
import DeviceNewEditImageCard from './DeviceNewEditImageCard';

export default function DeviceNewEditImageContainer({ listImage, ...rest }: any) {
  return (
    <Box p={3}>
      <Swiper
        pagination={{
          dynamicBullets: true,
        }}
        modules={[Pagination]}
        className="mySwiper"
      >
        {Array.from(listImage).map((img: any, index) => (
          <SwiperSlide key={index}>
            <DeviceNewEditImageCard image={img} />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}
