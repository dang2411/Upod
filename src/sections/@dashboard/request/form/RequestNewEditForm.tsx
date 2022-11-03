import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, Chip, Grid, Stack, TextField, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { RequestStatus } from 'src/@types/request';
import { Technician } from 'src/@types/user';
import { FormProvider, RHFAutocomplete, RHFSelect, RHFTextField } from 'src/components/hook-form';
import useAuth from 'src/hooks/useAuth';
import useToggle from 'src/hooks/useToggle';
import { PATH_DASHBOARD } from 'src/routes/paths';
import axios from 'src/utils/axios';
import * as Yup from 'yup';
import RequestRejectDialog from '../dialog/RequestRejectDialog';
import TechnicianDialog from '../dialog/TechnicianDialog';

const PRIORITY_OPTIONS = [
  { text: 'Low', value: 1 },
  { text: 'Medium', value: 2 },
  { text: 'High', value: 3 },
];

type TitleSectionProps = {
  label: string;
  status: RequestStatus;
};

function TitleSection({ label, status }: TitleSectionProps) {
  return (
    <Stack direction="row" spacing={2}>
      <Typography variant="subtitle1">{label}</Typography>
      {parseStatus(status)}
    </Stack>
  );
}

const parseStatus = (status: RequestStatus) => {
  if (status === 'pending') {
    return <Chip label="Pending" size="small" />;
  } else if (status === 'preparing') {
    return <Chip label="Preparing" color="info" size="small" />;
  } else if (status === 'rejected') {
    return <Chip label="Rejected" color="error" size="small" />;
  } else if (status === 'resolving') {
    return <Chip label="Resolving" color="warning" size="small" />;
  } else if (status === 'resolved') {
    return <Chip label="Resolved" color="success" size="small" />;
  } else if (status === 'editing') {
    return <Chip label="Editing" color="secondary" size="small" />;
  } else if (status === 'canceled') {
    return <Chip label="Canceled" color="error" size="small" />;
  }
  return <Chip label="Default" size="small" />;
};

type Props = {
  currentRequest: any;
  isEdit: boolean;
};

export default function RequestNewEditForm({ currentRequest, isEdit }: Props) {
  const RequestSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    service: Yup.object().required('Service is required'),
    priority: Yup.number().required('Priority is required').min(1).max(3),
    agency: Yup.object().required('Agency is required'),
  });

  const navigate = useNavigate();

  const { user } = useAuth();

  const isCustomer = user?.account?.roleName === 'Customer';

  const { enqueueSnackbar } = useSnackbar();

  const {
    toggle: openConfirmDialog,
    onClose: onConfirmDialogClose,
    setToggle: setOpenConfirmDialog,
  } = useToggle();

  const {
    toggle: openRejectDialog,
    onClose: onRejectDialogClose,
    setToggle: setOpenRejectDialog,
  } = useToggle();

  const [agencies, setAgencies] = useState([]);

  const [services, setServices] = useState([]);

  const defaultValues = {
    code: currentRequest?.code || '',
    name: currentRequest?.name || '',
    service: currentRequest?.service,
    address: currentRequest?.agency?.address || '',
    phone: currentRequest?.agency?.phone || '',
    agency: currentRequest?.agency,
    priority: currentRequest?.priority || 2,
    description: currentRequest?.description || '',
    status: currentRequest?.status || 'pending',
    technician: currentRequest?.technician,
  };

  const methods = useForm({
    resolver: yupResolver(RequestSchema),
    defaultValues,
  });

  const fetchAgencies = useCallback(async () => {
    try {
      var response;
      if (isCustomer) {
        response = await axios.get('/api/customers/get_agencies_by_customer_id', {
          params: { id: user?.account?.id },
        });
      } else {
        response = await axios.get('/api/agencies/get_list_agencies', {});
      }
      setAgencies(
        response.data.map((x) => ({
          id: x.id,
          name: x.agency_name,
          address: x.address,
          phone: isCustomer ? x.phone : x.telephone,
        }))
      );
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

  const updateRequest = useCallback(async (data: any) => {
    try {
      await axios.put('/api/requests/update_request_by_id', data, {
        params: { id: currentRequest?.id },
      });

      enqueueSnackbar('Update request successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Update request failed', { variant: 'error' });
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const confirmRequest = useCallback(async (data: Technician) => {
    try {
      await axios.put('/api/requests/mapping_technician_to_request_by_id', data, {
        params: { request_id: currentRequest?.id, technician_id: data.id },
      });

      setValue('status', 'preparing');
      setValue('technician', data);
      enqueueSnackbar('Confirm request successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Confirm request failed', { variant: 'error' });
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rejectRequest = useCallback(async (data: string) => {
    try {
      await axios.put(
        '/api/requests/reject_request_by_id',
        {},
        {
          params: { id: currentRequest?.id, reason: data },
        }
      );

      setValue('status', 'reject');
      enqueueSnackbar('Reject request successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Reject request failed', { variant: 'error' });
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createRequest = useCallback(async (data: any) => {
    try {
      if (isCustomer) {
        await axios.post('/api/requests/create_request', data);
      } else {
        await axios.post('/api/requests/create_request_by_admin', data);
      }

      enqueueSnackbar('Create request successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Create request failed', { variant: 'error' });
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reopenRequest = useCallback(async (data: any) => {
    try {
      await axios.put('/api/requests/reopen_request_by_id', {}, { params: data });

      enqueueSnackbar('Reopen request successfully', { variant: 'success' });
      setValue('status', 'editing');
    } catch (error) {
      enqueueSnackbar('Reopen request failed', { variant: 'error' });
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cancelRequest = useCallback(async (data: any) => {
    try {
      await axios.put('/api/requests/cancel_request_by_id', {}, { params: data });

      enqueueSnackbar('Cancel request successfully', { variant: 'success' });
      setValue('status', 'canceled');
    } catch (error) {
      enqueueSnackbar('Cancel request failed', { variant: 'error' });
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteRequest = useCallback(async (data: any) => {
    try {
      await axios.put('/api/requests/disable_request_by_id', {}, { params: data });

      enqueueSnackbar('Disable request successfully', { variant: 'success' });
      if (isCustomer) {
        navigate(PATH_DASHBOARD.customer.request.root);
      } else {
        navigate(PATH_DASHBOARD.admin.request.root);
      }
    } catch (error) {
      enqueueSnackbar('Disable request failed', { variant: 'error' });
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConfirm = (event) => {
    confirmRequest(getValues('technician'));
  };

  const handleShowReject = (event) => {
    setOpenRejectDialog(true);
  };

  const handleReopenClick = (event) => {
    reopenRequest({ id: currentRequest?.id });
  };

  const handleCancelClick = (event) => {
    cancelRequest({ id: currentRequest?.id });
  };

  const handleDeleteClick = (event) => {
    deleteRequest({ id: currentRequest?.id });
  };

  const {
    reset,
    watch,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    fetchAgencies();
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isEdit && currentRequest) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, agencies, services, currentRequest]);

  useEffect(() => {
    if (getValues('agency')) {
      setValue('address', getValues('agency').address);
      setValue('phone', getValues('agency').phone);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch('agency')]);

  const onSubmit = (data: any) => {
    if (isEdit) {
      const params = {
        agency_id: data.agency.id,
        service_id: data.service.id,
        request_description: data.description,
        request_name: data.name,
        phone: data.phone,
        priority: parseInt(data.priority),
      };
      updateRequest(params);
    } else {
      const params = {
        admin_id: user?.account?.id,
        service_id: data.service.id,
        agency_id: data.agency.id,
        request_description: data.description,
        request_name: data.name,
        priority: parseInt(data.priority),
      };
      createRequest(params);
    }
  };

  const onConfirm = (value: Technician) => {
    setValue('technician', value);
  };

  const onReject = (value: string) => {
    rejectRequest(value);
  };

  const disabled = getValues('status') !== 'pending';

  const newPage = !isEdit && !currentRequest;

  const editPage = isEdit && currentRequest;

  const currentStatus = getValues('status');

  const isCreatedByAdmin = currentRequest?.createdBy.role === 'Admin';

  return (
    <FormProvider onSubmit={handleSubmit(onSubmit)} methods={methods}>
      <Stack spacing={3}>
        {isEdit && <TitleSection label={getValues('code')} status={watch('status')} />}
        <Card sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="name"
                label="Name"
                variant="outlined"
                fullWidth
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFAutocomplete
                name="agency"
                label="Agency"
                variant="outlined"
                options={agencies}
                fullWidth
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFAutocomplete
                name="service"
                label="Service"
                variant="outlined"
                options={services}
                fullWidth
                InputLabelProps={{ shrink: true }}
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFSelect disabled={disabled} name="priority" label="Priority">
                {PRIORITY_OPTIONS.map((option) => (
                  <option key={option.text} value={option.value}>
                    {option.text}
                  </option>
                ))}
              </RHFSelect>
            </Grid>
            {watch('address') && (
              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="address"
                  label="Address"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  disabled={true}
                />
              </Grid>
            )}
            {watch('phone') && (
              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="phone"
                  label="Phone"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  disabled={true}
                />
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <TextField
                value={watch('technician')?.name ?? ''}
                label="Technician"
                variant="outlined"
                fullWidth
                onClick={() => setOpenConfirmDialog(true)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ readOnly: true }}
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="description"
                label="Description"
                variant="outlined"
                multiline
                minRows={6}
                fullWidth
                InputLabelProps={{ shrink: true }}
                disabled={disabled}
              />
            </Grid>
          </Grid>
          <Box mt={3} display="flex" justifyContent="end" textAlign="end" gap={2}>
            {/* Pending thì có quyền reject, comfirm, delete nếu là rq admin tạo
            Preparing thì có quyền Cancel nếu là rq admin tạo, có quyền edit và re-asigntech và nút Save            
            Resolved thì có thể re-open 
            Pending thì cus có quyền edit, có nút Save, Delete
            Preparing thì cus có nút Cancel
            */}
            {(currentStatus === 'pending' || currentStatus === 'preparing') && editPage && (
              <LoadingButton loading={isSubmitting} variant="contained" type="submit">
                Save
              </LoadingButton>
            )}
            {newPage && (
              <LoadingButton loading={isSubmitting} variant="contained" type="submit">
                Create
              </LoadingButton>
            )}
            {currentStatus === 'pending' && !isCustomer && editPage && isCreatedByAdmin && (
              <Button onClick={handleDeleteClick} color="error" variant="outlined">
                Delete
              </Button>
            )}
            {currentStatus === 'preparing' && !isCustomer && isCreatedByAdmin && (
              <Button onClick={handleCancelClick} color="error" variant="outlined">
                Cancel
              </Button>
            )}
            {currentStatus === 'pending' && !isCustomer && editPage && !isCreatedByAdmin && (
              <Button onClick={handleShowReject} color="error" variant="outlined">
                Reject
              </Button>
            )}
            {currentStatus === 'pending' && !isCustomer && watch('technician') && (
              <Button variant="contained" onClick={handleConfirm}>
                Confirm
              </Button>
            )}
            {currentStatus === 'resolved' && !isCustomer && (
              <Button onClick={handleReopenClick} color="info" variant="outlined">
                Reopen
              </Button>
            )}
            {/* Khi technician != null */}
          </Box>
        </Card>
      </Stack>
      <TechnicianDialog
        open={openConfirmDialog}
        onClose={onConfirmDialogClose}
        onSelect={onConfirm}
        requestId={currentRequest?.id}
      />
      <RequestRejectDialog
        open={openRejectDialog}
        onClose={onRejectDialogClose}
        onReject={onReject}
      />
    </FormProvider>
  );
}
