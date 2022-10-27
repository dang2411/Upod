import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import useAuth from 'src/hooks/useAuth';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { FormProvider, RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import { Box, Card, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import axios from 'src/utils/axios';

type Props = {
  currentTechnician: any;
  isEdit: boolean;
};

export default function TechnicianNewEditForm({ currentTechnician, isEdit }: Props) {
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
      var response;
      response = await axios.get('/api/areas/get_list_area', {
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
    busy: currentTechnician?.Busy || '',
    service: currentTechnician?.service,
  };
  const methods = useForm({
    resolver: yupResolver(technicianSchema),
    defaultValues,
  });
  const { handleSubmit, getValues } = methods;

  const onSubmit = (data: any) => {
    //
  };

  useEffect(() => {
    fetchAreas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormProvider onSubmit={handleSubmit(onSubmit)} methods={methods}>
      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Typography variant="subtitle1">{getValues('code')}</Typography>

          <Box display="grid" sx={{ gap: 2, gridTemplateColumns: { xs: 'auto', md: 'auto auto' } }}>
            <RHFTextField name="name" label="Name" />
            <RHFTextField name="telephone" label="Telephone" />
            <RHFTextField name="email" label="Email" />
            <RHFTextField name="rating" label="Average Rating" />
            <RHFTextField name="address" label="Address" />
            <RHFTextField name="busy" label="Busy" />
            <RHFAutocomplete
              name="area"
              label="Area"
              variant="outlined"
              options={areas}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            <RHFTextField name="account" label="Account" disabled />
            {/* <RHFAutocomplete
              name="service"
              label="Service"
              variant="outlined"
              options={services}
              fullWidth
              InputLabelProps={{ shrink: true }}
            /> */}
          </Box>
        </Stack>
      </Card>
    </FormProvider>
  );
}
