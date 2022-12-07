import { Link as RouterLink } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, BoxProps } from '@mui/material';

// ----------------------------------------------------------------------

interface Props extends BoxProps {
  disabledLink?: boolean;
}

export default function Logo({ disabledLink = false, sx, ...rest }: Props) {
  const theme = useTheme();

  const PRIMARY_LIGHT = theme.palette.primary.light;

  const PRIMARY_MAIN = theme.palette.primary.main;

  const PRIMARY_DARK = theme.palette.primary.dark;

  // OR
  // const logo = '/logo/logo_single.svg';

  const logo = (
    <Box sx={{ width: 80, height: 80, ...sx }}>
      <img
        src={
          'https://firebasestorage.googleapis.com/v0/b/upod-fa9c5.appspot.com/o/1ec4985b-b459-487c-a1b1-d9570d44a736image.png?alt=media&token=0126655e-a2d6-421a-b3da-2b46648fda1f'
        }
        alt="My logo"
      />
    </Box>
  );

  if (disabledLink) {
    return <>{logo}</>;
  }

  return <RouterLink to="/dashboard/admin/request/list">{logo}</RouterLink>;
}
