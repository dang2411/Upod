import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import useAuth from 'src/hooks/useAuth';
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { FormProvider, RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import { Box, Button, Card, Stack, TextField, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useCallback, useEffect, useState } from 'react';
import axios from 'src/utils/axios';
import { DatePicker } from '@mui/x-date-pickers';

type Props = {
  currentDevice: any;
  isEdit: boolean;
};

export default function DeviceNewEditForm({ currentDevice, isEdit }: Props) {
  const deviceSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
  });

  const [deviceTypes, setDeviceTypes] = useState([]);
  const [agencies, setAgencies] = useState([]);

  const { user } = useAuth();

  const isCustomer = user?.account?.roleName === 'Customer';

  const { enqueueSnackbar } = useSnackbar();

  const fetchDeviceType = useCallback(async () => {
    try {
      const response = await axios.get('/api/device_types/get_list_device_type');

      setAgencies(response.data.map((x) => ({ id: x.id, name: x.agency_name })));
    } catch (error) {
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAgencies = useCallback(async () => {
    try {
      const response = await axios.get('/api/agencies/get_list_agencies');

      setDeviceTypes(response.data.map((x) => ({ id: x.id, name: x.device_type_name })));
    } catch (error) {
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const defaultValues = {
    code: currentDevice?.code || '',
    name: currentDevice?.name || '',
    type: currentDevice?.type,
    ip: currentDevice?.ip || '',
    port: currentDevice?.port || '',
    agency: currentDevice?.agency,
    deviceAccount: currentDevice?.deviceAccount || '',
    devicePassword: currentDevice?.devicePassword || '',
    settingDate: currentDevice?.settingDate,
    guarantyStartDate: currentDevice?.guarantyStartDate,
    guarantyEndDate: currentDevice?.guarantyEndDate,
  };

  const methods = useForm({
    resolver: yupResolver(deviceSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = (data: any) => {
    //
  };
  const disable = !isEdit && currentDevice != null;
  const onDeleteClick = () => {
    // deleteAccount();
  };

  useEffect(() => {
    fetchDeviceType();
    fetchAgencies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormProvider onSubmit={handleSubmit(onSubmit)} methods={methods}>
      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Box display="grid" sx={{ gap: 2, gridTemplateColumns: { xs: 'auto', md: 'auto auto' } }}>
            {/* <Typography variant="subtitle1">{getValues('code')}</Typography> */}
            <RHFTextField name="code" label="Code" disabled />
            <RHFTextField name="name" label="Name" disabled={disable} />
            <RHFAutocomplete
              name="type"
              label="Type"
              variant="outlined"
              options={deviceTypes}
              fullWidth
              InputLabelProps={{ shrink: true }}
              disabled={disable}
            />
            <RHFAutocomplete
              name="agency"
              label="Agency"
              variant="outlined"
              options={agencies}
              fullWidth
              InputLabelProps={{ shrink: true }}
              disabled={disable}
            />
            <RHFTextField name="ip" label="Ip" disabled={disable} />
            <RHFTextField name="port" label="port" disabled={disable} />
            <RHFTextField name="deviceAccount" label="Device Account" disabled={disable} />
            <RHFTextField name="devicePassword" label="Device Password" disabled={disable} />
            <Controller
              name="settingDate"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  label="Setting Date"
                  inputFormat="dd/MM/yyyy"
                  value={field.value}
                  onChange={(newValue) => {
                    field.onChange(newValue);
                  }}
                  disabled={disable}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth error={!!error} helperText={error?.message} />
                  )}
                />
              )}
            />
            <Controller
              name="guarantyStartDate"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  label="Guaranty Start Date"
                  inputFormat="dd/MM/yyyy"
                  value={field.value}
                  onChange={(newValue) => {
                    field.onChange(newValue);
                  }}
                  disabled={disable}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth error={!!error} helperText={error?.message} />
                  )}
                />
              )}
            />
            <Controller
              name="guarantyEndDate"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  label="Guaranty End Date"
                  inputFormat="dd/MM/yyyy"
                  value={field.value}
                  onChange={(newValue) => {
                    field.onChange(newValue);
                  }}
                  disabled={disable}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth error={!!error} helperText={error?.message} />
                  )}
                />
              )}
            />
          </Box>
        </Stack>
        {!disable && (
          <Stack mt={3} direction="row" justifyContent="end" textAlign="end" spacing={2}>
            <Button variant="outlined" color="error" onClick={onDeleteClick}>
              Delete
            </Button>
            <LoadingButton loading={isSubmitting} variant="contained" type="submit">
              {isEdit ? 'Save' : 'Create'}
            </LoadingButton>
          </Stack>
        )}
      </Card>
    </FormProvider>
  );
}
