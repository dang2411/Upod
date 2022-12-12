import { Box } from '@mui/material';

export default function Dashboard() {
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Box
          component="img"
          src={
            'https://firebasestorage.googleapis.com/v0/b/upod-fa9c5.appspot.com/o/5d1107e9-8d8a-4cd4-b061-e83d5c18527dimage.png?alt=media&token=59770cda-57ba-4ebd-be65-7ba4ed5e3ac1'
          }
          alt="image"
          height={'100%'}
        />
      </Box>
    </>
  );
}
