import { Box } from '@mui/material';

export default function RequestNewEditImageCard({ image, onClick, ...rest }: any) {
  return (
    <Box onClick={onClick}>
      <Box component="img" src={image} alt="image" {...rest} />
    </Box>
  );
}
