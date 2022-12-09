import { Box, Button } from '@mui/material';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { RHFUploadMultiFile } from 'src/components/hook-form';
import useAuth from 'src/hooks/useAuth';
import uploadFirebase from 'src/utils/uploadFirebase';
import { Pagination, Navigation } from 'swiper';
import RequestNewEditImageCard from './ReportNewEditImageCard';
import Iconify from 'src/components/Iconify';
import { indexOf } from 'lodash';
import { fileURLToPath } from 'url';
import ReportNewEditImageCard from './ReportNewEditImageCard';

// eslint-disable-next-line react-hooks/rules-of-hooks

export default function ReportNewEditImageFormField({ listImage, ...rest }: any) {
  return (
    <>
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
              <ReportNewEditImageCard image={img} />
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </>
  );
}
