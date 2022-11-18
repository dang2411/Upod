import { Card, Stack, TextField, Typography } from '@mui/material';

export default function MaintainNewEditAgencyForm({ currentMaintain, sx, rest }: any) {
  return (
    <Card {...rest} sx={{ p: 3, ...sx }}>
      <Stack spacing={2}>
        <Typography variant="h5">Agency</Typography>
        <TextField
          label="Code"
          value={currentMaintain?.agency?.code}
          variant="outlined"
          fullWidth
          disabled
        />
        <TextField
          label="Name"
          value={currentMaintain?.agency?.agency_name}
          variant="outlined"
          fullWidth
          disabled
        />
        <TextField
          label="Phone"
          value={currentMaintain?.agency?.phone}
          variant="outlined"
          fullWidth
          disabled
        />
        <TextField
          label="Address"
          value={currentMaintain?.agency?.address}
          variant="outlined"
          fullWidth
          disabled
        />
      </Stack>
    </Card>
  );
}
