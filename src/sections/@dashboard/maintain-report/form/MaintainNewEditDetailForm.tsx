import { Card, Chip, Stack, TextField, Typography, SxProps } from '@mui/material';
import { capitalCase } from 'change-case';
import { Console } from 'console';

import { format } from 'date-fns';
import { useFormContext } from 'react-hook-form';
import { MaintainStatus } from 'src/@types/maintain';
import { RHFTextField } from 'src/components/hook-form';

const parseStatus = (status: MaintainStatus) => {
  if (status === 'pending') {
    return <Chip label="Pending" color="warning" />;
  } else if (status === 'completed') {
    return <Chip label="Completed" color="success" />;
  } else if (status === 'processing') {
    return <Chip label="Processing" color="info" />;
  }
  return <Chip label="Default" />;
};

type TitleSectionProps = {
  label: string;
  status: MaintainStatus;
  sx?: SxProps;
};

export function TitleSection({ label, status, sx }: TitleSectionProps) {
  return (
    <Stack direction="row" spacing={2} sx={sx} alignItems="center">
      <Typography variant="subtitle1">{capitalCase(label)}</Typography>
      {parseStatus(status)}
    </Stack>
  );
}

export default function MaintainNewEditDetailForm({ currentMaintain }: any) {
  const { getValues, watch } = useFormContext();
  return (
    <>
      <Card sx={{ p: 3 }}>
        <TitleSection sx={{ ml: -2 }} label={getValues('name')} status={watch('status')} />
        <Stack spacing={2} mt={3}>
          <RHFTextField name="code" label="Code" variant="outlined" fullWidth disabled />
          <TextField
            label="Created Date"
            variant="outlined"
            value={format(new Date(currentMaintain?.create_date), 'HH:mm dd/MM/yyyy')}
            fullWidth
            disabled
          />
          <TextField
            label="Update Date"
            variant="outlined"
            value={format(new Date(currentMaintain?.update_date), 'HH:mm dd/MM/yyyy')}
            fullWidth
            disabled
          />
          {/* <RHFTextField
            name="description"
            label="Description"
            variant="outlined"
            fullWidth
            disabled
          /> */}
        </Stack>
      </Card>
    </>
  );
}
