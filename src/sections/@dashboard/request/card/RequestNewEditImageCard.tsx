import { Box } from '@mui/material';

export default function RequestNewEditImageCard({ image, onClick, ...rest }: any) {
  return (
    <Box onClick={onClick} display={"flex"} justifyContent = "center" alignItems={"center"} >
      <Box component="img" src={image} alt="image" {...rest} maxHeight="250px" />
    </Box>
  );
}
