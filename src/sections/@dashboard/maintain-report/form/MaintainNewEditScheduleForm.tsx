import { Card, Stack, TextField, Typography } from '@mui/material';
import { format } from 'date-fns';

export default function MaintainNewEditScheduleForm({ currentMaintain, sx, rest }: any) {
  return (
    <Card {...rest} sx={{ p: 3, ...sx }}>
      <Stack spacing={2}>
        <Typography variant="h5">Maintenance Schedule</Typography>
        <TextField
          name="maintenance_schedule"
          label="Code"
          value={currentMaintain?.maintenance_schedule?.code}
          variant="outlined"
          fullWidth
          disabled
        />
        <TextField
          name="maintenance_schedule"
          label="Name"
          value={currentMaintain?.maintenance_schedule?.sche_name}
          variant="outlined"
          fullWidth
          disabled
        />
        <TextField
          name="maintenance_schedule"
          label="Description"
          value={currentMaintain?.maintenance_schedule?.description}
          variant="outlined"
          fullWidth
          disabled
        />
        <TextField
          name="maintenance_schedule"
          label="Maintain Time"
          value={format(
            new Date(currentMaintain?.maintenance_schedule?.maintain_time),
            'dd/MM/yyyy HH:mm'
          )}
          variant="outlined"
          fullWidth
          disabled
        />
      </Stack>
    </Card>
  );
}
