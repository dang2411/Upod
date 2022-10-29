import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import useAuth from 'src/hooks/useAuth';
import * as Yup from 'yup';
import { useCallback, useState, useEffect } from 'react';
import axios from 'src/utils/axios';
import { Controller, useForm } from 'react-hook-form';
import { FormProvider, RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import { Autocomplete, Box, Card, Stack, TextField, Typography } from '@mui/material';

type Props = {
  currentContract: any;
  isEdit: boolean;
};

export default function ContractNewEditForm({ currentContract, isEdit }: Props) {
  const ContractSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
  });

  const { user } = useAuth();

  const [services, setServices] = useState([]);

  const isCustomer = user?.account?.roleName === 'Customer';

  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = {
    code: currentContract?.code || '',
    name: currentContract?.name || '',
    customer: currentContract?.customer,
    startDate: currentContract?.startDate || new Date(),
    endDate: currentContract?.endDate || new Date(),
    attachment: currentContract?.attachment || '',
    img: currentContract?.img || '',
    description: currentContract?.description || '',
    frequencyMaintain: currentContract?.frequencyMaintain || '',
    service: currentContract?.service || [],
  };

  const fetchServices = useCallback(async () => {
    try {
      var response;
      if (isCustomer) {
        response = await axios.get('/api/customers/get_services_by_customer_id', {
          params: { id: user?.account?.id },
        });
      } else {
        response = await axios.get('/api/services/get_all_services');
      }
      setServices(response.data.map((x) => ({ id: x.id, name: x.service_name })));
    } catch (error) {
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const methods = useForm({
    resolver: yupResolver(ContractSchema),
    defaultValues,
  });

  const { handleSubmit, getValues, control } = methods;

  const onSubmit = (data: any) => {
    //
  };

  useEffect(() => {
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <FormProvider onSubmit={handleSubmit(onSubmit)} methods={methods}>
      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Box display="grid" sx={{ gap: 2, gridTemplateColumns: { xs: 'auto', md: 'auto auto' } }}>
            {/* <Typography variant="subtitle1">{getValues('code')}</Typography> */}
            <RHFTextField name="code" label="Code" disabled />
            <RHFTextField name="name" label="Name" />
            <RHFTextField name="startDate" label="Start Date" />
            <RHFTextField name="endDate" label="End Date" />
            <RHFTextField name="description" label="Description" />
            <RHFTextField name="frequencyMaintain" label="Frequency Maintain" />
            <Controller
              name="service"
              control={control}
              render={({ field: { value, onChange }, fieldState: { error } }) => (
                <Autocomplete
                  multiple
                  options={services}
                  getOptionLabel={(option: any) => option.name}
                  value={value}
                  onChange={(_: any, newValue: any) => {
                    onChange(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={!!error}
                      helperText={error?.message}
                      label="Service"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: <>{params.InputProps.endAdornment}</>,
                      }}
                    />
                  )}
                />
              )}
            />
          </Box>
        </Stack>
      </Card>
    </FormProvider>
  );
}
