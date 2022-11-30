import { Box, Button } from '@mui/material';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { RHFUploadMultiFile } from 'src/components/hook-form';
import useAuth from 'src/hooks/useAuth';
import uploadFirebase from 'src/utils/uploadFirebase';
import { Pagination } from 'swiper';
import RequestNewEditImageCard from './RequestNewEditImageCard';
import Iconify from 'src/components/Iconify';

// eslint-disable-next-line react-hooks/rules-of-hooks

export default function RequestNewEditImageFormField({ image, name, currentStatus, ...rest }: any) {
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

  const handleCloseClick = () => {
    console.log(getValues(image));
    // setValue(name, getValues(image));
  };

  const handleRemove = (file: File | string) => {
    const filteredItems = files?.filter((_file) => _file !== file);
    setValue(name, filteredItems);
  };

  return (
    <Box p={3}>
      <Swiper
        pagination={{
          dynamicBullets: true,
        }}
        modules={[Pagination]}
        className="mySwiper"
      >
        {Array.from(swipers).map((img: any, index) => (
          <SwiperSlide key={index}>
            {currentStatus === 'editing' && (
              <Button onClick={handleCloseClick} sx={{ float: 'right' }}>
                <Iconify icon="charm:circle-cross" sx={{ width: 20, height: 20 }} />
              </Button>
            )}

            <RequestNewEditImageCard image={img} />
          </SwiperSlide>
        ))}
        {currentStatus === 'editing' && (
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
