import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import useAuth from 'src/hooks/useAuth';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { FormProvider, RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import { Box, Card, Stack, Typography } from '@mui/material';

type Props = {
  currentDevice: any;
  isEdit: boolean;
};

export default function DeviceNewEditForm({ currentDevice, isEdit }: Props) {
  const deviceSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
  });

  const { user } = useAuth();

  const isCustomer = user?.account?.roleName === 'Customer';

  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = {
    code: currentDevice?.code || '',
    name: currentDevice?.name || '',
    type: currentDevice?.type,
    ip: currentDevice?.ip || '',
    port: currentDevice?.port || '',
    agency: currentDevice?.agency,
    deviceAccount: currentDevice?.deviceAccount || '',
    devicePassword: currentDevice?.devicePassword || '',
    settingDate: currentDevice?.settingDate || '',
    gurantyStartDate: currentDevice?.gurantyStartDate || new Date(),
    guarantyEndDate: currentDevice?.guarantyEndDate || new Date(),
  };

  const methods = useForm({
    resolver: yupResolver(deviceSchema),
    defaultValues,
  });

  const { handleSubmit, getValues } = methods;

  const onSubmit = (data: any) => {
    //
  };

  return (
    <FormProvider onSubmit={handleSubmit(onSubmit)} methods={methods}>
      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Box display="grid" sx={{ gap: 2, gridTemplateColumns: { xs: 'auto', md: 'auto auto' } }}>
            {/* <Typography variant="subtitle1">{getValues('code')}</Typography> */}
            <RHFTextField name="code" label="Code" disabled />
            <RHFTextField name="name" label="Name" />
            <RHFAutocomplete
              name="type"
              label="Type"
              variant="outlined"
              options={[]}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <RHFAutocomplete
              name="agency"
              label="Agency"
              variant="outlined"
              options={[]}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <RHFTextField name="ip" label="Ip" />
            <RHFTextField name="port" label="port" />
            <RHFTextField name="deviceAccount" label="Device Account" />
            <RHFTextField name="devicePassword" label="Device Password" />
            <RHFTextField name="settingDate" label="Setting Date" />
            <RHFTextField name="gurantyStartDate" label="Guranty Start Date" />
            <RHFTextField name="guarantyEndDate" label="Guaranty End Date" />
          </Box>
        </Stack>
      </Card>
    </FormProvider>
  );
}
