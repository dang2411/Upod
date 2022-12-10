import { Box } from '@mui/material';

export default function RequestNewEditImageCard({ image, onClick, ...rest }: any) {
  return (
    <Box mt={0} onClick={onClick} display={'flex'} justifyContent="center">
      <Box
        component="img"
        src={
          image ||
          'https://firebasestorage.googleapis.com/v0/b/upod-fa9c5.appspot.com/o/277eca50-39aa-4284-b9ff-e52d7e71b85dimage.png?alt=media&token=96424fc6-b39b-4eda-aa7c-308f74829d62'
        }
        alt="image"
        {...rest}
        maxHeight="180px"
      />
    </Box>
  );
}
