import { Box } from '@mui/material';

export default function DeviceNewEditImageCard({ image, onClick, ...rest }: any) {
  return (
    <Box onClick={onClick}>
      <Box component="img" src={image.link} alt="image" {...rest} />
    </Box>
  );
}
