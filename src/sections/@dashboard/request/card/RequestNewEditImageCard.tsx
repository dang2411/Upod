import { Box } from '@mui/material';

export default function RequestNewEditImageCard({ image, onClick, ...rest }: any) {
  return (
    <Box mt={0} onClick={onClick} display={'flex'} justifyContent="center">
      <Box component="img" src={image} alt="image" {...rest} maxHeight="200px" />
    </Box>
  );
}
