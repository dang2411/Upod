import { Card, Stack, TextField, Typography } from '@mui/material';

export default function MaintainNewEditTechnicianForm({ currentMaintain, sx, rest }: any) {
  return (
    <Card {...rest} sx={{ p: 3,...sx }}>
      <Stack spacing={2}>
        <Typography variant="h5">Technician</Typography>
        <TextField
          name="create_by"
          label="Code"
          value={currentMaintain?.create_by?.code}
          variant="outlined"
          fullWidth
          disabled
        />
        <TextField
          name="create_by"
          label="Name"
          value={currentMaintain?.create_by?.tech_name}
          variant="outlined"
          fullWidth
          disabled
        />
        <TextField
          name="create_by"
          label="Email"
          value={currentMaintain?.create_by?.email}
          variant="outlined"
          fullWidth
          disabled
        />
        <TextField
          name="create_by"
          label="Phone"
          value={currentMaintain?.create_by?.phone}
          variant="outlined"
          fullWidth
          disabled
        />
      </Stack>
    </Card>
  );
}
