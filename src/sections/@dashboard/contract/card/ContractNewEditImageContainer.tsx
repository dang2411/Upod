import { Stack } from '@mui/material';
import 'swiper/css';
import 'swiper/css/pagination';
import Contractneweditimagecard from './ContractNewEditImageCard';

export default function DeviceNewEditImageContainer({ listImage, ...rest }: any) {
  return (
    <Stack p={3} spacing={2} direction="row" overflow={'auto'} sx={{width: "1000%"}}>
      {Array.from(listImage).map((img: any, index) => (
        // eslint-disable-next-line react/jsx-key
        <Contractneweditimagecard image={img} />
      ))}
    </Stack>
  );
}
