import { Box, Link } from '@mui/material';

export default function ContractNewEditImageCard({ image, ...rest }: any) {
  return (
    <Link href={image} target="_blank">
      <Box
        p={3}
        sx={{ border: '0.2px solid black' }}
        component="img"
        src={image}
        alt="image"
        minWidth={50}
        width={50}
        height={50}
        {...rest}
      />
    </Link>
  );
}
