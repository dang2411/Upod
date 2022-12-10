import { Box, Link } from '@mui/material';

export default function ContractNewEditImageCard({ image, ...rest }: any) {
  return (
    <Link href={image} target="_blank">
      <Box
        p={3}
        sx={{ border: '0.2px solid black' }}
        component="img"
        src={
          image ||
          'https://firebasestorage.googleapis.com/v0/b/upod-fa9c5.appspot.com/o/277eca50-39aa-4284-b9ff-e52d7e71b85dimage.png?alt=media&token=96424fc6-b39b-4eda-aa7c-308f74829d62'
        }
        alt="image"
        minWidth={50}
        width={50}
        height={50}
        {...rest}
      />
    </Link>
  );
}
