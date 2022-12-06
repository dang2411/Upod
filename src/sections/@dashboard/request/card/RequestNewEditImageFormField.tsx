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
import RequestNewEditImageCard from './RequestNewEditImageCard';
import Iconify from 'src/components/Iconify';
import { indexOf } from 'lodash';
import { fileURLToPath } from 'url';

// eslint-disable-next-line react-hooks/rules-of-hooks

export default function RequestNewEditImageFormField({
  image,
  name,
  currentStatus,
  isCustomer,
  ...rest
}: any) {
  const [swipers, setSwipers] = useState([]);

  useEffect(() => {
    setSwipers(getValues(image) || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  const { user } = useAuth();

  const { watch, setValue, getValues } = useFormContext();

  const files = watch(name);

  const onUploadClick = async () => {
    //
    const urlList = await Promise.all(
      files.map(async (item) => uploadFirebase(item, user?.account?.id ?? 'other'))
    );
    console.log(urlList);
  };

  // input cua ham la files
  const handleDropMultiple = useCallback(
    (acceptedFiles) => {
      setValue(name, [
        ...files,
        ...acceptedFiles.map((file: Blob | MediaSource) =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        ),
      ]);
    },
    [setValue, name, files]
  );

  const handleRemoveAll = () => {
    setValue(name, []);
  };

  const handleCloseClick = (img: File | string) => {
    const filteredItems = getValues(image)?.filter((_file) => _file !== img);
    setSwipers(filteredItems);
    setValue(image, filteredItems);
  };

  const handleRemove = (file: File | string) => {
    const filteredItems = files?.filter((_file) => _file !== file);
    setValue(name, filteredItems);
  };

  return (
    <Box p={3}>
      <Swiper
        pagination={{
          type: 'fraction',
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
        {Array.from(swipers).map((img: any, index) => (
          <SwiperSlide key={index}>
            <RequestNewEditImageCard image={img} />
            {currentStatus === 'resolved' && !isCustomer && (
              <Button
                key={img}
                variant="outlined"
                sx={{
                  float: 'right',
                  '&:hover': {
                    backgroundColor: 'secondary',
                    opacity: [0.5, 0.5, 0.5],
                  },
                }}
                onClick={() => handleCloseClick(img)}
                color="error"
              >
                <Iconify
                  icon="fluent:delete-12-regular"
                  sx={{ width: 25, height: 25, color: 'error.main', cursor: 'pointer' }}
                />
              </Button>
            )}
          </SwiperSlide>
        ))}
        {currentStatus === 'resolved' && !isCustomer && (
          <SwiperSlide key={'Add'}>
            <RHFUploadMultiFile
              showPreview
              showButton={false}
              name={name}
              maxSize={3145728}
              onDrop={handleDropMultiple}
              onRemove={handleRemove}
              onRemoveAll={handleRemoveAll}
              onUpload={onUploadClick}
            />
          </SwiperSlide>
        )}
      </Swiper>
    </Box>
  );
}
