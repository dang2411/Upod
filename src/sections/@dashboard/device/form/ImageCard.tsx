import { Box } from '@mui/material';

export default function ImageCard({ image, onClick, ...rest }: any) {
  return (
    <Box onClick={onClick}>
      <Box component="img" src={image.link} alt="image" width="100px" height="100px" {...rest} />
    </Box>
  );
}
