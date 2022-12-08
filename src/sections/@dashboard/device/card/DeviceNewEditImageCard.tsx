import { Box, CircularProgress } from '@mui/material';

export default function DeviceNewEditImageCard({ image, onClick, ...rest }: any) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onClick={onClick}
    >
      <Box component="img" src={image} alt="image" height={350} maxWidth={500} {...rest} />
    </Box>
  );
}
