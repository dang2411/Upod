import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Chip,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { RequestStatus } from 'src/@types/request';
import { Technician } from 'src/@types/user';
import { FormProvider, RHFAutocomplete, RHFSelect, RHFTextField } from 'src/components/hook-form';
import useAuth from 'src/hooks/useAuth';
import useToggle from 'src/hooks/useToggle';
import axios from 'src/utils/axios';
import { _technician } from 'src/_mock';
import * as Yup from 'yup';
import RequestConfirmDialog from '../dialog/RequestConfirmDialog';
import RequestRejectDialog from '../dialog/RequestRejectDialog';

const PRIORITY_OPTIONS = [
  { text: 'Low', value: 1 },
  { text: 'Medium', value: 2 },
  { text: 'High', value: 3 },
];

type TitleSectionProps = {
  label: string;
  status: RequestStatus;
};

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
  }
  return <Chip label="Default" size="small" />;
};

function TitleSection({ label, status }: TitleSectionProps) {
  return (
    <Stack direction="row" spacing={2}>
      <Typography variant="subtitle1">{label}</Typography>
      {parseStatus(status)}
    </Stack>
  );
}

type Props = {
  currentRequest: any;
  isEdit: boolean;
};

export default function RequestNewEditForm({ currentRequest, isEdit }: Props) {
  const RequestSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
  });

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

  const _empty = { id: '', name: '' };

  const handleShowConfirm = (event) => {
    setOpenConfirmDialog(true);
  };
  const handleShowReject = (event) => {
    setOpenRejectDialog(true);
  };

  const defaultValues = {
    code: currentRequest?.code || '',
    name: currentRequest?.name || '',
    service: currentRequest?.service || _empty, // fetch model
    address: currentRequest?.agency?.address || '',
    phone: currentRequest?.agency?.phone || '',
    agency: currentRequest?.agency || _empty, // fetch model
    priority: currentRequest?.priority || 2, //! todo FE fix priority not work
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
          phone: x.telephone,
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
      await axios.put('/api/requests/disable_request_by_id', data, {
        params: { id: currentRequest?.id },
      });

      setValue('status', 'rejected');
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

  const {
    control,
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
    setValue('address', getValues('agency').address);
    setValue('phone', getValues('agency').phone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch('agency')]);

  const onSubmit = (data: any) => {
    console.log(data.priority);
    const priority = PRIORITY_OPTIONS.find((x) => x.text === data.priority)?.value;
    console.log(priority);
    if (isEdit) {
      const params = {
        agency_id: data.agency.id,
        service_id: data.service.id,
        request_description: data.description,
        request_name: data.name,
        phone: data.phone,
        priority,
      };
      updateRequest(params);
    } else {
      const params = {
        admin_id: user?.account?.id,
        service_id: data.service.id,
        agency_id: data.agency.id,
        request_description: data.description,
        request_name: data.name,
        priority,
      };
      createRequest(params);
    }
  };

  const onConfirm = (value: Technician) => {
    confirmRequest(value);
  };

  const onReject = (value: string) => {
    rejectRequest(value);
  };

  const disabled = getValues('status') !== 'pending';

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
                  disabled={disabled}
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
                  disabled={disabled}
                />
              </Grid>
            )}
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
            {getValues('status') !== 'pending' && (
              <Grid item xs={12} md={6}>
                <Controller
                  name="technician"
                  control={control}
                  render={({ field: { value, onChange }, fieldState: { error } }) => (
                    <Autocomplete
                      isOptionEqualToValue={(option: any, value: any) => option.id === value.id}
                      getOptionLabel={(option: any) => option.name}
                      options={_technician}
                      onChange={(event: any, newValue: any) => {
                        onChange(newValue);
                      }}
                      value={value}
                      disabled={disabled}
                      renderInput={(params) => (
                        <TextField
                          error={!!error}
                          helperText={error?.message}
                          label="Technician"
                          {...params}
                          inputProps={{ ...params.inputProps }}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: <>{params.InputProps.endAdornment}</>,
                          }}
                        />
                      )}
                    />
                  )}
                />
              </Grid>
            )}
          </Grid>
          {getValues('status') === 'pending' && (
            <Box mt={3} display="flex" justifyContent="end" textAlign="end">
              <LoadingButton loading={isSubmitting} variant="contained" type="submit">
                {isEdit ? 'Save' : 'Create'}
              </LoadingButton>
            </Box>
          )}
        </Card>
        {isEdit && !isCustomer && getValues('status') === 'pending' && (
          <Stack sx={{ width: '100%' }} direction="row" justifyContent="start" spacing={2}>
            <Button onClick={handleShowReject} color="error" variant="outlined">
              Reject
            </Button>
            <Button variant="contained" onClick={handleShowConfirm}>
              Confirm
            </Button>
          </Stack>
        )}
      </Stack>
      <RequestConfirmDialog
        open={openConfirmDialog}
        onClose={onConfirmDialogClose}
        onSelect={onConfirm}
      />
      <RequestRejectDialog
        open={openRejectDialog}
        onClose={onRejectDialogClose}
        onReject={onReject}
      />
    </FormProvider>
  );
}
