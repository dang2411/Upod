import { Card, Stack, TextField } from '@mui/material';

import { format } from 'date-fns';
import { useFormContext } from 'react-hook-form';
import { RHFTextField } from 'src/components/hook-form';
import { TitleSection } from './MaintainTitleSection';

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
            value={format(new Date(currentMaintain?.create_date), 'dd/MM/yyyy')}
            fullWidth
            disabled
          />
          <TextField
            label="Update Date"
            variant="outlined"
            value={format(new Date(currentMaintain?.update_date), 'dd/MM/yyyy')}
            fullWidth
            disabled
          />
          <RHFTextField
            name="description"
            label="Description"
            variant="outlined"
            fullWidth
            disabled
          />
        </Stack>
      </Card>
    </>
  );
}
