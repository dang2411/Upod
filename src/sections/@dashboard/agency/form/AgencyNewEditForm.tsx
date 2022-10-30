import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Button, Card, Stack } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { FormProvider, RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import useAuth from 'src/hooks/useAuth';
import { PATH_DASHBOARD } from 'src/routes/paths';
import axios from 'src/utils/axios';
import * as Yup from 'yup';

type Props = {
  currentAgency: any;
  isEdit: boolean;
};

export default function AgencyNewEditForm({ currentAgency, isEdit }: Props) {
  const navigate = useNavigate();

  const AgencySchema = Yup.object().shape({
    // name: Yup.string().required('Name is required'),
  });

  const { user } = useAuth();

  const isCustomer = user?.account?.roleName === 'Customer';

  const { enqueueSnackbar } = useSnackbar();

  const [areas, setAreas] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [technicians, setTechnicians] = useState([]);

  const defaultValues = {
    code: currentAgency?.code || '',
    name: currentAgency?.name || '',
    customer: currentAgency?.customer,
    area: currentAgency?.area,
    address: currentAgency?.address || '',
    telephone: currentAgency?.telephone || '',
    manager: currentAgency?.manager || '',
    technician: currentAgency?.technician,
  };

  const methods = useForm({
    resolver: yupResolver(AgencySchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const fetchTechnician = useCallback(async () => {
    try {
      const response = await axios.get('/api/technicians/get_list_technicians', {
        params: { pageNumber: 1, pageSize: 1000 },
      });

      setTechnicians(response.data.map((x) => ({ id: x.id, name: x.technician_name })));
    } catch (error) {
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCustomer = useCallback(async () => {
    try {
      const response = await axios.get('/api/customers/get_all_customers', {
        params: { pageNumber: 1, pageSize: 1000 },
      });

      setCustomers(response.data.map((x) => ({ id: x.id, name: x.name })));
    } catch (error) {
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const createAgency = useCallback(async (data: any) => {
    try {
      await axios.post('/api/agencies/create_agency', data);
      enqueueSnackbar('Create agenycies successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Create agencies failed', { variant: 'error' });
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateAgency = useCallback(async (data: any) => {
    try {
      await axios.put(
        '/api/agencies/update_agency_by_id',
        {
          agency_name: data!.agency_name,
          address: data!.address,
          telephone: data!.telephone,
          area_id: data!.area_id,
          technician_id: data!.technician_id,
          manager_name: data!.manager_name,
        },
        {
          params: { id: currentAgency!.id },
        }
      );
      enqueueSnackbar('Update agencies successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Update agencies failed', { variant: 'error' });
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteAgency = useCallback(async () => {
    try {
      await axios.put(
        '/api/agencies/disable_agency_by_id',
        {},
        {
          params: { id: currentAgency!.id },
        }
      );
      enqueueSnackbar('Delete agency successfully', { variant: 'success' });
      navigate(PATH_DASHBOARD.admin.agency.root);
    } catch (error) {
      enqueueSnackbar('Delete agency failed', { variant: 'error' });
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (data: any) => {
    if (isEdit) {
      const params = {
        id: currentAgency!.id,
        agency_name: data.name,
        address: data.address,
        telephone: data.telephone,
        area_id: data.area.id,
        technician_id: data.technician.id,
        manager_name: data.manager,
      };
      updateAgency(params);
    } else {
      const params = {
        customer_id: data.customer.id,
        technician_id: data.technician.id,
        agency_name: data.name,
        address: data.address,
        telephone: data.telephone,
        area_id: data.area.id,
        manager_name: data.manager,
      };
      createAgency(params);
    }
    //
  };

  const disable = !isEdit && currentAgency != null;

  const onDeleteClick = () => {
    deleteAgency();
  };

  useEffect(() => {
    fetchAreas();
    fetchCustomer();
    fetchTechnician();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormProvider onSubmit={handleSubmit(onSubmit)} methods={methods}>
      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* <Typography variant="subtitle1">{getValues('code')}</Typography> */}
          <Box display="grid" sx={{ gap: 2, gridTemplateColumns: { xs: 'auto', md: 'auto auto' } }}>
            {isEdit && <RHFTextField name="code" label="Code" disabled />}
            <RHFTextField name="name" label="Name" disabled={disable} />
            <RHFTextField name="address" label="Address" disabled={disable} />
            <RHFTextField name="telephone" label="Phone" disabled={disable} />
            <RHFTextField name="manager" label="Manager" disabled={disable} />
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
              name="technician"
              label="Technician"
              variant="outlined"
              options={technicians}
              fullWidth
              InputLabelProps={{ shrink: true }}
              disabled={disable}
            />
            <RHFAutocomplete
              name="customer"
              label="Customer"
              variant="outlined"
              options={customers}
              fullWidth
              InputLabelProps={{ shrink: true }}
              disabled={disable || isEdit}
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