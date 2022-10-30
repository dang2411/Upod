import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import useAuth from 'src/hooks/useAuth';
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { FormProvider, RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import { Autocomplete, Box, Button, Card, Stack, TextField, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import axios from 'src/utils/axios';
import { LoadingButton } from '@mui/lab';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { useNavigate } from 'react-router-dom';

type Props = {
  currentTechnician: any;
  isEdit: boolean;
};

export default function TechnicianNewEditForm({ currentTechnician, isEdit }: Props) {
  const navigate = useNavigate();
  const technicianSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
  });

  const [areas, setAreas] = useState([]);

  const [accounts, setAccounts] = useState([]);

  const [services, setServices] = useState([]);

  const { user } = useAuth();

  const isCustomer = user?.account?.roleName === 'Customer';

  const { enqueueSnackbar } = useSnackbar();

  const fetchAreas = useCallback(async () => {
    try {
      const response = await axios.get('/api/areas/get_list_area', {
        params: { pageNumber: 1, pageSize: 1000 },
      });
      setAreas(response.data.map((x) => ({ id: x.id, name: x.area_name })));
    } catch (error) {
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const defaultValues = {
    code: currentTechnician?.code || '',
    name: currentTechnician?.name || '',
    area: currentTechnician?.area,
    account: currentTechnician?.account?.name,
    telephone: currentTechnician?.telephone || '',
    email: currentTechnician?.email || '',
    gender: currentTechnician?.gender || '',
    address: currentTechnician?.address || '',
    rating: currentTechnician?.rating_avg || '',
    busy: currentTechnician?.busy || '',
    service: currentTechnician?.service || [],
  };

  const methods = useForm({
    resolver: yupResolver(technicianSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    getValues,
    control,
    formState: { isSubmitting },
  } = methods;

  const deleteTechnician = useCallback(async () => {
    try {
      await axios.put(
        '/api/technicians/disable_technician_by_id',
        {},
        {
          params: { id: currentTechnician!.id },
        }
      );
      enqueueSnackbar('Delete technician successfully', { variant: 'success' });
      navigate(PATH_DASHBOARD.admin.technician.root);
    } catch (error) {
      enqueueSnackbar('Delete technician failed', { variant: 'error' });
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (data: any) => {
    //
  };

  const disable = !isEdit && currentTechnician != null;

  const onDeleteClick = () => {
    deleteTechnician();
  };

  useEffect(() => {
    fetchAreas();
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormProvider onSubmit={handleSubmit(onSubmit)} methods={methods}>
      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Typography variant="subtitle1">{getValues('code')}</Typography>
          <Box display="grid" sx={{ gap: 2, gridTemplateColumns: { xs: 'auto', md: 'auto auto' } }}>
            <RHFTextField name="name" label="Name" disabled={disable} />
            <RHFTextField name="telephone" label="Telephone" disabled={disable} />
            <RHFTextField name="email" label="Email" disabled={disable} />
            <RHFTextField name="rating" label="Average Rating" disabled={disable} />
            <RHFTextField name="address" label="Address" disabled={disable} />
            <RHFTextField name="busy" label="Busy" disabled={disable} />
            <RHFAutocomplete
              name="area"
              label="Area"
              variant="outlined"
              options={areas}
              fullWidth
              InputLabelProps={{ shrink: true }}
              disabled={disable}
            />

            <RHFTextField name="account" label="Account" disabled />
            <Controller
              name="service"
              control={control}
              render={({ field: { value, onChange }, fieldState: { error } }) => (
                <Autocomplete
                  multiple
                  options={services}
                  getOptionLabel={(option: any) => option.name}
                  isOptionEqualToValue={(option: any, value: any) => {
                    console.log({ option, value });
                    return option.id === value.id;
                  }}
                  value={value}
                  filterSelectedOptions
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
