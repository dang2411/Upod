import { Card, Stack, TextField, Typography } from '@mui/material';

export default function MaintainNewEditCustomerForm({ currentMaintain, sx, rest }: any) {
  return (
    <Card {...rest} sx={{ p: 3, ...sx }}>
      <Stack spacing={2}>
        <Typography variant="h5">Customer</Typography>
        <TextField
          label="Name"
          value={currentMaintain?.customer?.cus_name}
          variant="outlined"
          fullWidth
          disabled
        />
        <TextField
          label="Address"
          value={currentMaintain?.customer?.address}
          variant="outlined"
          fullWidth
          disabled
        />
        <TextField
          label="Mail"
          value={currentMaintain?.customer?.mail}
          variant="outlined"
          fullWidth
          disabled
        />
        <TextField
          label="Phone"
          value={currentMaintain?.customer?.phone}
          variant="outlined"
          fullWidth
          disabled
        />
      </Stack>
    </Card>
  );
}
