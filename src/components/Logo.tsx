import { Link as RouterLink } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, BoxProps } from '@mui/material';
import useAuth from 'src/hooks/useAuth';

// ----------------------------------------------------------------------

interface Props extends BoxProps {
  disabledLink?: boolean;
}

export default function Logo({ disabledLink = false, sx, ...rest }: Props) {
  const theme = useTheme();

  const { user } = useAuth();

  const PRIMARY_LIGHT = theme.palette.primary.light;

  const PRIMARY_MAIN = theme.palette.primary.main;

  const PRIMARY_DARK = theme.palette.primary.dark;

  const isCustomer = user?.account?.roleName === 'Customer';

  // OR
  // const logo = '/logo/logo_single.svg';

  const logo = (
    <Box sx={{ width: 50, height: 50, ...sx }}>
      <img
        src={
          'https://firebasestorage.googleapis.com/v0/b/upod-fa9c5.appspot.com/o/d6dac81c-41a5-4bda-b412-220f976d775eimage.png?alt=media&token=316aaf78-8aa5-4889-a59b-82880f4f4cc0'
        }
        alt="My logo"
        height={50}
      />
    </Box>
  );

  if (disabledLink) {
    return <>{logo}</>;
  }

  if (!user) return <>{logo}</>;

  if (!isCustomer) return <RouterLink to="/dashboard/admin/request/list">{logo}</RouterLink>;
  else return <RouterLink to="/dashboard/customer/request/list">{logo}</RouterLink>;
}
