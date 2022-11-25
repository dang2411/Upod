import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Button, Card, Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from 'src/components/dialog/ConfirmDialog';
import { FormProvider, RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import useAuth from 'src/hooks/useAuth';
import useToggle from 'src/hooks/useToggle';
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
    name: Yup.string().required('Name is required'),
    address: Yup.string().required('Address is required'),
    phone: Yup.string()
      .matches(
        /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
        {
          message: 'Please enter valid number.',
          excludeEmptyString: false,
        }
      )
      .required('Phone is required'),
    area: Yup.object().required('Area is required'),
    manager: Yup.string().required('Manager name is required'),
    customer: Yup.object().required('Customer is required'),
    technician: Yup.object().required('Technician is required'),
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
    phone: currentAgency?.telephone || '',
    manager: currentAgency?.manager || '',
    technician: currentAgency?.technician,
  };

  const methods = useForm({
    resolver: yupResolver(AgencySchema),
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    getValues,
    formState: { isSubmitting },
  } = methods;

  const fetchTechnician = useCallback(async (data: any, customer: any) => {
    try {
      const response = await axios.get('/api/areas/get_list_technicians_by_area_id', {
        params: { pageNumber: 1, pageSize: 1000, id: data?.id , cus_id: customer.id},
      });

      setTechnicians(response.data.map((x) => ({ id: x.id, name: x.tech_name })));
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
      const response:any = await axios.post('/api/agencies/create_agency', data);
      if (response.status === 200 || response.status === 201) {
        navigate(PATH_DASHBOARD.admin.agency.root);
        enqueueSnackbar('Create agenycy successfully', { variant: 'success' });
      } else {
        enqueueSnackbar(response.message, { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Create agenycy failed', { variant: 'error' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateAgency = useCallback(async (data: any) => {
    try {
      const response:any = await axios.put('/api/agencies/update_agency_by_id', data, {
        params: { id: currentAgency!.id },
      });
      if (response.status === 200 || response.status === 201) {
        if (isCustomer) {
          navigate(PATH_DASHBOARD.customer.agency.root);
        } else {
          navigate(PATH_DASHBOARD.admin.agency.root);
        }
        enqueueSnackbar('Update agencies successfully', { variant: 'success' });
      } else {
        enqueueSnackbar(response.message, { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Update agencies failed', { variant: 'error' });
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteAgency = useCallback(async () => {
    try {
      const response = await axios.put(
        '/api/agencies/disable_agency_by_id',
        {},
        {
          params: { id: currentAgency!.id },
        }
      );
      if (response.status === 200 || response.status === 201) {
        enqueueSnackbar('Delete account successfully', { variant: 'success' });
        navigate(PATH_DASHBOARD.admin.agency.root);
      } else {
        enqueueSnackbar('Delete agency successfully', { variant: 'success' });
      }
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
        telephone: data.phone,
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
        telephone: data.phone,
        area_id: data.area.id,
        manager_name: data.manager,
      };
      createAgency(params);
    }
    //
  };

  const { toggle: openDialog, onClose: onCloseDialog, setToggle: setOpenDialog } = useToggle(false);

  const {
    toggle: openDeleteDialog,
    onClose: onCloseDeleteDialog,
    setToggle: setOpenDeleteDialog,
  } = useToggle(false);

  const disable = (!isEdit && currentAgency != null) || isCustomer;

  const onDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const onConfirmDelete = () => {
    deleteAgency();
  };

  useEffect(() => {
    fetchAreas();
    fetchCustomer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (getValues('area')) {
      fetchTechnician(getValues('area'), getValues('customer'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch('area'), watch('customer')]);

  const editPage = isEdit && currentAgency;

  // const newPage = !isEdit && !currentAgency;

  // const detailPage = !isEdit && currentAgency;

  return (
    <>
      <FormProvider onSubmit={handleSubmit(onSubmit)} methods={methods}>
        <Card sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Typography variant="subtitle1">{getValues('code')}</Typography>
            <Box
              display="grid"
              sx={{ gap: 2, gridTemplateColumns: { xs: 'auto', md: 'auto auto' } }}
            >
              {/* {isEdit && <RHFTextField name="code" label="Code" disabled />} */}
              <RHFTextField name="name" label="Name" disabled={disable} />
              <RHFTextField name="address" label="Address" disabled={disable} />
              <RHFTextField name="phone" label="Phone" disabled={disable} />
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
              {watch('area') && technicians != null && (
                <RHFAutocomplete
                  name="technician"
                  label="Technician"
                  variant="outlined"
                  options={technicians}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  disabled={disable}
                />
              )}
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
          {!isCustomer && (
            <Stack mt={3} direction="row" justifyContent="end" textAlign="end" spacing={2}>
              <Button variant="outlined" color="error" onClick={onDeleteClick}>
                Delete
              </Button>
              <LoadingButton loading={isSubmitting} variant="contained" type="submit">
                {editPage ? 'Save' : 'Create'}
              </LoadingButton>
            </Stack>
          )}
        </Card>
      </FormProvider>
      <ConfirmDialog
        open={openDeleteDialog}
        onClose={onCloseDeleteDialog}
        onConfirm={onConfirmDelete}
        title="Delete Agency"
        text="Are you sure you want to delete?"
      />
    </>
  );
}
