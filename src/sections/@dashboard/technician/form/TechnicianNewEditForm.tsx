import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import useAuth from 'src/hooks/useAuth';
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { FormProvider, RHFAutocomplete, RHFSelect, RHFTextField } from 'src/components/hook-form';
import { Autocomplete, Box, Button, Card, Stack, TextField, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import axios from 'src/utils/axios';
import { LoadingButton } from '@mui/lab';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { useNavigate } from 'react-router-dom';
import { phoneNumber } from 'src/_mock/phoneNumber';

type Props = {
  currentTechnician: any;
  isEdit: boolean;
};

const GENDER_OPTIONS = [
  { text: 'Male', value: '0' },
  { text: 'Female', value: '1' },
  { text: 'Other', value: '2' },
];

export default function TechnicianNewEditForm({ currentTechnician, isEdit }: Props) {
  const navigate = useNavigate();
  const technicianSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
  });

  const [areas, setAreas] = useState([]);

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
    account: currentTechnician?.account,
    phone: currentTechnician?.telephone || '',
    email: currentTechnician?.email || '',
    gender: currentTechnician?.gender || '',
    address: currentTechnician?.address || '',
    rating: currentTechnician?.rating || '',
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

  const [accounts, setAccounts] = useState([]);

  const fetchAccount = useCallback(async () => {
    try {
      const response = await axios.get('/api/accounts/get_all_accounts', {
        params: { pageNumber: 1, pageSize: 1000 },
      });
      setAccounts(response.data.map((x) => ({ id: x.id, name: x.username })));
    } catch (error) {
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createTechnician = useCallback(async (data: any) => {
    try {
      const response = await axios.post('/api/technicians/create_technician', data);
      if (response.status === 200 || response.status === 201) {
        enqueueSnackbar('Create technician successfully', { variant: 'success' });
      }
    } catch (error) {
      enqueueSnackbar('Create technician failed', { variant: 'error' });
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateTechnician = useCallback(async (data: any) => {
    try {
      const response = await axios.put('/api/technicians/update_technician_by_id', data, {
        params: { id: currentTechnician!.id },
      });
      if (response.status === 200 || response.status === 201) {
        enqueueSnackbar('Update technician successfully', { variant: 'success' });
      }
    } catch (error) {
      enqueueSnackbar('Update technician failed', { variant: 'error' });
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteTechnician = useCallback(async () => {
    try {
      const response = await axios.put(
        '/api/technicians/disable_technician_by_id',
        {},
        {
          params: { id: currentTechnician!.id },
        }
      );
      if (response.status === 200 || response.status === 201) {
        enqueueSnackbar('Delete account successfully', { variant: 'success' });
        navigate(PATH_DASHBOARD.admin.technician.root);
      } else {
        enqueueSnackbar('Delete account failed', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Delete technician failed', { variant: 'error' });
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (data: any) => {
    if (isEdit) {
      // update
      const params = {
        area_id: data!.area.id,
        technician_name: data.name,
        account_id: data.account.id,
        telephone: data.phone,
        email: data.email,
        gender: data.gender,
        address: data.address,
        rating_avg: data.rating,
        service_id: data.service.map((x: any) => x.id),
      };
      updateTechnician(params);
    } else {
      const params = {
        area_id: data!.area.id,
        technician_name: data.name,
        account_id: data.account.id,
        telephone: data.phone,
        email: data.email,
        gender: data.gender,
        address: data.address,
        rating_avg: data.rating,
        service_id: data.service.map((x: any) => x.id),
      };
      createTechnician(params);
    }
  };

  const disable = !isEdit && currentTechnician != null;

  const onDeleteClick = () => {
    deleteTechnician();
  };

  useEffect(() => {
    fetchAreas();
    fetchServices();
    fetchAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormProvider onSubmit={handleSubmit(onSubmit)} methods={methods}>
      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Typography variant="subtitle1">{getValues('code')}</Typography>
          <Box display="grid" sx={{ gap: 2, gridTemplateColumns: { xs: 'auto', md: 'auto auto' } }}>
            <RHFTextField name="name" label="Name" disabled={disable} />
            <RHFTextField name="phone" label="Phone" disabled={disable} />
            <RHFSelect disabled={disable} name="gender" label="Gender">
              {GENDER_OPTIONS.map((option) => (
                <option key={option.text} value={option.value}>
                  {option.text}
                </option>
              ))}
            </RHFSelect>
            <RHFTextField name="email" label="Email" disabled={disable} />
            <RHFTextField name="rating" label="Average Rating" disabled={disable} />
            <RHFTextField name="address" label="Address" disabled={disable} />
            <RHFAutocomplete
              name="area"
              label="Area"
              variant="outlined"
              options={areas}
              fullWidth
              InputLabelProps={{ shrink: true }}
              disabled={disable}
            />
            <RHFAutocomplete
              name="account"
              label="Account"
              variant="outlined"
              options={accounts}
              fullWidth
              InputLabelProps={{ shrink: true }}
              disabled={disable}
            />
            <Controller
              name="service"
              control={control}
              render={({ field: { value, onChange }, fieldState: { error } }) => (
                <Autocomplete
                  multiple
                  options={services}
                  getOptionLabel={(option: any) => option.name}
                  isOptionEqualToValue={(option: any, value: any) => {
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
