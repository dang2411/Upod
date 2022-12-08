import { Box } from '@mui/material';

export default function ReportNewEditImageCard({ image, ...rest }: any) {
  return (
    <Box mt={0} display={'flex'} justifyContent="center">
      <Box component="img" src={image} alt="image" {...rest} maxHeight="250px" />
    </Box>
  );
}
