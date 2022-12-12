import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Button, Card, CircularProgress, Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Technician } from 'src/@types/user';
import ConfirmDialog from 'src/components/dialog/ConfirmDialog';
import { FormProvider, RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import useAuth from 'src/hooks/useAuth';
import useToggle from 'src/hooks/useToggle';
import { PATH_DASHBOARD } from 'src/routes/paths';
import axios from 'src/utils/axios';
import * as Yup from 'yup';
import TechnicianDialog from '../../request/dialog/TechnicianDialog';

type Props = {
  currentAgency: any;
  isEdit: boolean;
};

export default function AgencyNewEditForm({ currentAgency, isEdit }: Props) {
  const navigate = useNavigate();

  const AgencySchema = Yup.object().shape({
    name: Yup.string().trim().required('Name is required'),
    address: Yup.string().trim().required('Address is required'),
    phone: Yup.string()
      .trim()
      .matches(
        /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
        {
          message: 'Please enter valid number.',
          excludeEmptyString: false,
        }
      )
      .required('Phone is required'),
    area: Yup.object().required('Area is required'),
    manager: Yup.string().trim().required('Manager name is required'),
    customer: Yup.object().required('Customer is required'),
    technician: Yup.object().required('Technician is required'),
  });

  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  const isCustomer = user?.account?.roleName === 'Customer';

  const { enqueueSnackbar } = useSnackbar();

  const [areas, setAreas] = useState([]);

  const [customers, setCustomers] = useState([]);

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
    setValue,
    getValues,
    formState: { isSubmitting },
  } = methods;

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
      const response: any = await axios.post('/api/agencies/create_agency', data);
      if (response.status === 200 || response.status === 201) {
        setIsLoading(false);
        navigate(PATH_DASHBOARD.admin.agency.root);
        enqueueSnackbar('Create agency successfully', { variant: 'success' });
      } else {
        setIsLoading(false);
        enqueueSnackbar(response.message, { variant: 'error' });
      }
    } catch (error) {
      setIsLoading(false);
      enqueueSnackbar('Create agency failed', { variant: 'error' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateAgency = useCallback(async (data: any) => {
    try {
      const response: any = await axios.put('/api/agencies/update_agency_by_id', data, {
        params: { id: currentAgency!.id },
      });
      if (response.status === 200 || response.status === 201) {
        if (isCustomer) {
          setIsLoading(false);
          navigate(PATH_DASHBOARD.customer.agency.root);
        } else {
          setIsLoading(false);
          navigate(PATH_DASHBOARD.admin.agency.root);
        }
        enqueueSnackbar('Update agency successfully', { variant: 'success' });
      } else {
        setIsLoading(false);
        enqueueSnackbar(response.message, { variant: 'error' });
      }
    } catch (error) {
      setIsLoading(false);
      enqueueSnackbar('Update agency failed', { variant: 'error' });
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteAgency = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.put(
        '/api/agencies/disable_agency_by_id',
        {},
        {
          params: { id: currentAgency!.id },
        }
      );
      if (response.status === 200 || response.status === 201) {
        enqueueSnackbar('Delete agency successfully', { variant: 'success' });
        setIsLoading(false);
        navigate(PATH_DASHBOARD.admin.agency.root);
      } else {
        setIsLoading(false);
        enqueueSnackbar('Delete agency failed', { variant: 'error' });
      }
    } catch (error) {
      setIsLoading(false);
      enqueueSnackbar('Delete agency failed', { variant: 'error' });
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (data: any) => {
    setIsLoading(true);
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

  const {
    toggle: openConfirmDialog,
    onClose: onConfirmDialogClose,
    setToggle: setOpenConfirmDialog,
  } = useToggle();

  const onDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const onConfirmDelete = () => {
    deleteAgency();
  };

  const onConfirm = (value: Technician) => {
    setValue('technician', value);
  };

  useEffect(() => {
    fetchAreas();
    fetchCustomer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              {watch('area') && watch('customer') && (
                <RHFTextField
                  name="technician"
                  value={
                    (watch('technician')?.tech_name &&
                      watch('technician').tech_name + ', ' + watch('technician').code) ||
                    (defaultValues.technician?.tech_name &&
                      defaultValues.technician.tech_name + ', ' + defaultValues.technician.code) ||
                    ''
                  }
                  label="Technician"
                  variant="outlined"
                  fullWidth
                  onClick={() => {
                    setOpenConfirmDialog(true);
                  }}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ readOnly: true }}
                  disabled={false}
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
          {watch('customer') && watch('area') && (
            <TechnicianDialog
              open={openConfirmDialog}
              onClose={onConfirmDialogClose}
              onSelect={onConfirm}
              id={getValues('customer').id || ''}
              isdefault={true}
              isAdminCreate={false}
              agencyId={getValues('area').id || ''}
              serviceId={null}
            />
          )}
          {!isCustomer && (
            <Stack mt={3} direction="row" justifyContent="end" textAlign="end" spacing={2}>
              {currentAgency && (
                <Button variant="outlined" color="error" onClick={onDeleteClick}>
                  Delete
                </Button>
              )}
              <LoadingButton loading={isSubmitting} variant="contained" type="submit">
                {editPage ? 'Save' : 'Create'}
              </LoadingButton>
            </Stack>
          )}
        </Card>
      </FormProvider>
      {isLoading && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {<CircularProgress />}
        </Box>
      )}
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
