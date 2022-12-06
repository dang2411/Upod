import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { RequestStatus } from 'src/@types/request';
import { Technician } from 'src/@types/user';
import ConfirmDialog from 'src/components/dialog/ConfirmDialog';
import { FormProvider, RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import useAuth from 'src/hooks/useAuth';
import useToggle from 'src/hooks/useToggle';
import { PATH_DASHBOARD } from 'src/routes/paths';
import axios from 'src/utils/axios';
import uploadFirebase from 'src/utils/uploadFirebase';
import { isContext } from 'vm';
import * as Yup from 'yup';
import RequestRejectDialog from '../dialog/RequestRejectDialog';
import TechnicianDialog from '../dialog/TechnicianDialog';
import RequestNewEditTicketForm from './RequestNewEditTicketForm';

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
    return <Chip label="Resolving" color="info" size="small" />;
  } else if (status === 'resolved') {
    return <Chip label="Resolved" color="success" size="small" />;
  } else if (status === 'warning') {
    return <Chip label="Warning" color="warning" size="small" />;
  } else if (status === 'canceled') {
    return <Chip label="Canceled" color="error" size="small" />;
  } else if (status === 'completed') {
    return <Chip label="Completed" color="success" size="small" />;
  }
  return <Chip label="Default" size="small" />;
};

type Props = {
  currentRequest: any;
  isEdit: boolean;
  isMaintain?: boolean;
};

export default function RequestNewEditForm({ currentRequest, isEdit }: Props) {
  const RequestSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    service: Yup.object().required('Service is required'),
    // priority: Yup.number().required('Priority is required').min(1).max(3),
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

  const [customers, setCustomers] = useState([]);

  const [agencies, setAgencies] = useState([]);

  const [services, setServices] = useState([]);

  // const [customers, setCustomers] = useState([]);

  const id = currentRequest?.id;

  const [isLoading, setIsLoading] = useState(false);

  const isCreatedBySystem = currentRequest?.createdBySystem === true;

  const isCreatedByAdmin = currentRequest?.createdBy?.role === 'Admin';

  const defaultValues = {
    code: currentRequest?.code || '',
    name: currentRequest?.name || '',
    contract: currentRequest?.contract,
    service: currentRequest?.service,
    address: currentRequest?.agency?.address || '',
    phone: currentRequest?.agency?.phone || '',
    agency: currentRequest?.agency,
    description: currentRequest?.description || '',
    customer: currentRequest?.customer,
    status: currentRequest?.status || 'pending',
    createdAt: currentRequest?.createdAt || '',
    createdBy: isCreatedBySystem
      ? 'System'
      : isCreatedByAdmin
      ? 'Admin'
      : currentRequest?.createdBy?.name,
    technician: currentRequest?.technician,
    rejectReason: currentRequest?.rejectReason || '',
    cancelReason: currentRequest?.cancelReason || '',
  };
  const methods = useForm<any>({
    resolver: yupResolver(RequestSchema),
    defaultValues,
  });

  const fetchCustomer = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/customers/get_all_customers', {
        params: { pageSize: 10000, pageNumber: 1 },
      });
      setCustomers(
        response.data.map((x) => ({
          id: x.id,
          name: x.name,
        }))
      );
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const approveRequest = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.put('/api/customers/approve_request_by_id', {}, {
        params: {
          id: currentRequest.id,
        },
      });
      if (response.status === 200 || response.status === 201) {
        console.log(currentRequest.id, response);
        setIsLoading(false);
        navigate(PATH_DASHBOARD.customer.request.root);
        enqueueSnackbar('Approve request successfully', { variant: 'success' });
      }
    } catch (error) {
      setIsLoading(false);
      enqueueSnackbar('Approve request fail', { variant: 'error' });
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAgencies = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      var response;
      if (isCustomer) {
        response = await axios.get('/api/customers/get_agencies_by_customer_id', {
          params: { id: user?.account?.id },
        });
      } else {
        response = await axios.get('/api/customers/get_agencies_by_customer_id', {
          params: { id: id },
        });
      }
      setAgencies(
        response.data.map((x) => ({
          id: x.id,
          name: x.agency_name,
          address: x.address,
          phone: x.phone,
        }))
      );
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchServices = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      var response;
      if (isCustomer) {
        response = await axios.get('/api/customers/get_services_by_customer_id', {
          params: { id: user?.account?.id },
        });
      } else {
        response = await axios.get('/api/customers/get_services_by_customer_id', {
          params: { id: id },
        });
      }
      setServices(response.data.map((x) => ({ id: x.id, name: x.service_name })));
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateRequest = useCallback(async (data: any) => {
    try {
      setIsLoading(true);
      if (isCustomer) {
        const response = await axios.put('/api/requests/update_request_by_id', data, {
          params: { id: currentRequest?.id },
        });
        if (response.status === 200 || response.status === 201) {
          setIsLoading(false);
          navigate(PATH_DASHBOARD.customer.request.root);
          enqueueSnackbar('Update request successfully', { variant: 'success' });
        }
      } else {
        const response = await axios.put('/api/requests/update_request_admin_by_id', data, {
          params: { id: currentRequest?.id },
        });
        if (response.status === 200 || response.status === 201) {
          setIsLoading(false);
          navigate(PATH_DASHBOARD.admin.request.root);
          enqueueSnackbar('Update request successfully', { variant: 'success' });
        }
      }
    } catch (error) {
      enqueueSnackbar('Update request failed', { variant: 'error' });
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const confirmRequest = useCallback(async (data: Technician) => {
    try {
      setIsLoading(true);
      const response = await axios.put('/api/requests/mapping_technician_to_request_by_id', data, {
        params: { request_id: currentRequest?.id, technician_id: data.id },
      });

      if (response.status === 200 || response.status === 201) {
        setIsLoading(false);
        navigate(PATH_DASHBOARD.admin.request.root);
        enqueueSnackbar('Confirm request successfully', { variant: 'success' });
      }
    } catch (error) {
      enqueueSnackbar('Confirm request failed', { variant: 'error' });
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rejectRequest = useCallback(async (data: string) => {
    try {
      setIsLoading(true);
      const response = await axios.put(
        '/api/requests/reject_request_by_id',
        {},
        {
          params: { id: currentRequest?.id, reason: data },
        }
      );

      setValue('status', 'reject');
      if (response.status === 200 || response.status === 201) {
        setIsLoading(false);
        navigate(PATH_DASHBOARD.admin.request.root);
        enqueueSnackbar('Reject request successfully', { variant: 'success' });
      }
    } catch (error) {
      enqueueSnackbar('Reject request failed', { variant: 'error' });
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createRequest = useCallback(async (data: any) => {
    try {
      setIsLoading(true);
      if (isCustomer) {
        const response = await axios.post('/api/requests/create_request', data);
        if (response.status === 200 || response.status === 201) {
          setIsLoading(false);
          navigate(PATH_DASHBOARD.customer.request.root);
          enqueueSnackbar('Create request successfully', { variant: 'success' });
        }
      } else {
        const response = await axios.post('/api/requests/create_request_by_admin', data);
        if (response.status === 200 || response.status === 201) {
          setIsLoading(false);
          navigate(PATH_DASHBOARD.admin.request.root);
          enqueueSnackbar('Create request successfully', { variant: 'success' });
        }
      }
    } catch (error) {
      enqueueSnackbar('Create request failed', { variant: 'error' });
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const parseTime = (s: string) => {
    const hour = parseInt(s.substring(0, 2), 10);
    const min = parseInt(s.substring(3, 5), 10);
    if (hour < 2 && min < 2) {
      return `${hour} hour ${min} minute`;
    } else if (hour < 2 && min >= 2) {
      return `${hour} hour ${min} minutes`;
    } else if (hour >= 2 && min < 2) {
      return `${hour} hours ${min} minute`;
    }
    return `${hour} hours ${min} minutes`;
  };

  const cancelRequest = useCallback(async (data: string) => {
    try {
      setIsLoading(true);
      const response = await axios.put(
        '/api/requests/cancel_request_by_id',
        { reason: data },
        {
          params: { id: currentRequest?.id },
        }
      );
      if (response.status === 200 || response.status === 201) {
        if (!isCustomer) {
          setIsLoading(false);
          navigate(PATH_DASHBOARD.admin.request.root);
          enqueueSnackbar('Cancel request successfully', { variant: 'success' });
        } else {
          setIsLoading(false);
          navigate(PATH_DASHBOARD.customer.request.root);
          enqueueSnackbar('Cancel request successfully', { variant: 'success' });
        }
      }
      setValue('status', 'canceled');
    } catch (error) {
      enqueueSnackbar('Cancel request failed', { variant: 'error' });
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateTicket = useCallback(async (data: any) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        '/api/technicians/update_device_of_ticket_by_request_id',
        data,
        {
          params: { id: currentRequest?.id },
        }
      );
      if (response.status === 200 || response.status === 201) {
        setIsLoading(false);
        navigate(PATH_DASHBOARD.admin.request.root);
        enqueueSnackbar('Update devices successfully', { variant: 'success' });
      }
    } catch (error) {
      setIsLoading(false);
      enqueueSnackbar('Update devices failed', { variant: 'error' });
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

  const {
    toggle: openCancelDialog,
    onClose: onCloseCancelDialog,
    setToggle: setOpenCancelDialog,
  } = useToggle(false);

  const onConfirmCancle = (value: string) => {
    cancelRequest(value);
  };

  const handleCancelClick = (event) => {
    setOpenCancelDialog(true);
  };

  const {
    watch,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    fetchCustomer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   if (isEdit && currentRequest) {
  //     reset(defaultValues);
  //   }
  //   if (!isEdit) {
  //     reset(defaultValues);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isEdit, agencies, services, currentRequest]);

  useEffect(() => {
    if (getValues('agency')) {
      setValue('address', getValues('agency').address);
      setValue('phone', getValues('agency').phone);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch('agency')]);

  useEffect(() => {
    fetchServices(watch('customer')?.id);
    fetchAgencies(watch('customer')?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch('customer')]);

  useEffect(() => {
    onchangeService(watch('service')?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch('service')]);

  const onchangeService = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      let response;
      if (isCustomer) {
        response = await axios.get('/api/requests/get_contract_by_customer_service', {
          params: { cus_id: user?.account?.id, service_id: id },
        });
      } else {
        response = await axios.get('/api/requests/get_contract_by_customer_service', {
          params: { cus_id: watch('customer').id, service_id: id },
        });
      }
      if (response.status === 200 || response.status === 201) {
        setValue('contract', { id: response.data.id, name: response.data.contract_name });
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: any) => {
    if (isEdit) {
      if (currentStatus === 'resolved') {
        const files = data.ticket.map(({ files }) => files); // lấy danh sách files: FILE
        const response = await Promise.all(
          files.map((e) => Promise.all(e.map((item) => uploadFirebase(item, user?.account?.id))))
        );

        const params = {
          ticket: data.ticket.map((ticket, index) => {
            const { device, solution, description, img } = ticket;

            return {
              device_id: device.id,
              description: description,
              solution: solution,
              img: [...img, ...response[index]],
            };
          }),
        };
        updateTicket(params);
      } else {
        const params = {
          agency_id: data.agency.id,
          service_id: data.service.id,
          request_description: data.description,
          customer_id: currentRequest?.customer.id,
          technician_id: data.technician.id || '',
          request_name: data.name,
          phone: data.phone,
          // priority: parseInt(data.priority),
        };
        updateRequest(params);
      }
    } else if (!isCustomer) {
      const params = {
        admin_id: user?.account?.id,
        customer_id: data.customer.id,
        service_id: data.service.id,
        agency_id: data.agency.id,
        request_description: data.description,
        request_name: data.name,
        technician_id: data.technician.id || '',
      };
      createRequest(params);
    } else {
      const params = {
        service_id: data.service.id,
        agency_id: data.agency.id,
        request_description: data.description,
        request_name: data.name,
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

  const newPage = !isEdit;

  const editPage = isEdit && currentRequest;

  const currentStatus = getValues('status');

  const disabled = currentStatus !== 'pending';

  const isCreatedByCurrentUser =
    currentRequest?.createdBy?.role === 'Customer' &&
    currentRequest?.createdBy?.id === user?.account?.id;

  const diableServiceAgency = !(
    (newPage && isCustomer) ||
    (currentStatus === 'pending' && isCustomer && isCreatedByCurrentUser) ||
    (!isCustomer && newPage)
  );
  const disabledNameDescription = !(
    (currentStatus === 'preparing' && !isCustomer && isCreatedByAdmin) ||
    newPage ||
    (currentStatus === 'pending' && isCustomer && isCreatedByCurrentUser)
  );

  return (
    <>
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
                  disabled={disabledNameDescription}
                />
              </Grid>
              {(editPage || !isCustomer) && (
                <Grid item xs={12} md={6}>
                  <RHFAutocomplete
                    name="customer"
                    label="Customer"
                    variant="outlined"
                    options={customers}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    disabled={!(!isCustomer && newPage)}
                  />
                </Grid>
              )}
              {((!isCustomer && watch('customer') && watch('service')) ||
                (isCustomer && watch('service'))) && (
                <Grid item xs={12} md={6}>
                  <RHFTextField
                    value={getValues('contract')?.name ?? ''}
                    name="contract"
                    label="Contract"
                    variant="outlined"
                    fullWidth
                    disabled={true}
                  />
                </Grid>
              )}
              {((!isCustomer && watch('customer')) || isCustomer) && (
                <Grid item xs={12} md={6}>
                  <RHFAutocomplete
                    name="agency"
                    label="Agency"
                    variant="outlined"
                    options={agencies ?? []}
                    fullWidth
                    disabled={diableServiceAgency}
                  />
                </Grid>
              )}
              <Grid item xs={12} md={6}>
                <RHFAutocomplete
                  name="service"
                  label="Service"
                  variant="outlined"
                  options={services}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  disabled={diableServiceAgency}
                />
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
              {editPage && (
                <Grid item xs={12} md={6}>
                  <RHFTextField
                    value={format(new Date(getValues('createdAt')), 'HH:mm dd/MM/yyyy')}
                    name="createdAt"
                    label="Created At"
                    variant="outlined"
                    fullWidth
                    disabled={true}
                  />
                </Grid>
              )}

              {currentRequest?.startTime &&
                (currentStatus === 'resolving' ||
                  currentStatus === 'resolved' ||
                  currentStatus === 'completed' ||
                  currentStatus === 'preparing' ||
                  currentStatus === 'warning') && (
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Start Time"
                      variant="outlined"
                      fullWidth
                      disabled
                      value={format(new Date(currentRequest!.startTime), 'HH:mm dd/MM/yyyy')}
                    />
                  </Grid>
                )}

              {!newPage && (
                <>
                  <Grid item xs={12} md={6}>
                    <RHFTextField
                      value={getValues('createdBy')}
                      name="createdBy"
                      label="Created By"
                      variant="outlined"
                      fullWidth
                      disabled={true}
                    />
                  </Grid>
                  {currentRequest?.endTime &&
                    (currentStatus === 'resolved' || currentStatus === 'completed') && (
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Duration Time"
                          variant="outlined"
                          fullWidth
                          disabled
                          value={parseTime(currentRequest!.duration_time)}
                        />
                      </Grid>
                    )}
                </>
              )}

              {((editPage && (!isCustomer || (isCustomer && currentStatus !== 'pending'))) ||
                (newPage && !isCustomer)) && (
                <Grid item xs={12} md={6}>
                  <RHFTextField
                    name="technician"
                    value={watch('technician')?.tech_name ?? ''}
                    helperText={
                      currentRequest !== null && currentStatus === 'pending' ? (
                        <Typography sx={{ color: 'error.main' }} variant="body2">
                          Please assign a technician
                        </Typography>
                      ) : undefined
                    }
                    error={
                      (currentStatus === 'pending' ||
                        currentStatus === 'preparing' ||
                        currentStatus === 'warning') &&
                      !isCustomer
                    }
                    label="Technician"
                    variant="outlined"
                    fullWidth
                    onClick={() => {
                      if (
                        (currentStatus === 'pending' ||
                          currentStatus === 'preparing' ||
                          currentStatus === 'warning') &&
                        !isCustomer
                      ) {
                        setOpenConfirmDialog(true);
                      }
                    }}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ readOnly: true }}
                    disabled={
                      !(
                        (currentStatus === 'pending' ||
                          currentStatus === 'preparing' ||
                          currentStatus === 'warning') &&
                        !isCustomer
                      )
                    }
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
                  disabled={disabledNameDescription}
                />
              </Grid>
              {currentStatus === 'rejected' && (
                <Grid item xs={12} md={6}>
                  <RHFTextField
                    name="rejectReason"
                    label="Reject Reason"
                    variant="outlined"
                    multiline
                    minRows={6}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    disabled={true}
                  />
                </Grid>
              )}
              {currentStatus === 'canceled' && (
                <Grid item xs={12} md={6}>
                  <RHFTextField
                    name="cancelReason"
                    label="Cancel Reason"
                    variant="outlined"
                    multiline
                    minRows={6}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    disabled={true}
                  />
                </Grid>
              )}
            </Grid>
          </Card>
          {(currentStatus === 'resolved' || currentStatus === 'completed') && (
            <RequestNewEditTicketForm
              requestId={id}
              isCustomer={isCustomer}
              agencyId={watch('agency').id}
              editable={currentStatus === 'resolved' && !isCustomer}
              status={currentStatus}
            />
          )}
          <Box mt={3} display="flex" justifyContent="end" textAlign="end" gap={2}>
            {(currentStatus === 'pending' && !isCustomer && editPage && isCreatedByAdmin && (
              <Button onClick={handleCancelClick} color="error" variant="contained">
                Cancel
              </Button>
            )) ||
              (currentStatus === 'pending' && editPage && isCustomer && isCreatedByCurrentUser && (
                <Button onClick={handleCancelClick} color="error" variant="contained">
                  Cancel
                </Button>
              ))}
            {((currentStatus === 'preparing' && !isCustomer && isCreatedByAdmin) ||
              (currentStatus === 'preparing' && isCustomer && isCreatedByCurrentUser)) && (
              <Button onClick={handleCancelClick} color="error" variant="outlined">
                Cancel
              </Button>
            )}
            {currentStatus === 'pending' && !isCustomer && editPage && !isCreatedByAdmin && (
              <Button onClick={handleShowReject} color="error" variant="outlined">
                Reject
              </Button>
            )}
            {currentStatus === 'pending' && !isCustomer && editPage && watch('technician') && (
              <Button variant="contained" color="info" onClick={handleConfirm}>
                Confirm
              </Button>
            )}
            {currentStatus === 'resolved' && isCustomer && (
              <Button variant="contained" onClick={approveRequest}>
                Approve
              </Button>
            )}
            {((currentStatus === 'pending' && isCustomer && isCreatedByCurrentUser) ||
              (currentStatus === 'preparing' && !isCustomer) ||
              (currentStatus === 'resolved' && !isCustomer) ||
              (currentStatus === 'warning' && !isCustomer)) &&
              editPage && (
                <LoadingButton loading={isSubmitting} variant="contained" type="submit">
                  Save
                </LoadingButton>
              )}
            {newPage && (
              <LoadingButton loading={isSubmitting} variant="contained" type="submit">
                Create
              </LoadingButton>
            )}
          </Box>
        </Stack>
        <TechnicianDialog
          open={openConfirmDialog}
          onClose={onConfirmDialogClose}
          onSelect={onConfirm}
          id={id}
          isAdminCreate={!isCustomer}
          agencyId={watch('agency')?.id ?? null}
          serviceId={watch('service')?.id ?? null}
        />
        <RequestRejectDialog
          open={openRejectDialog}
          onClose={onRejectDialogClose}
          onReject={onReject}
          title="Reject request"
        />
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
      <RequestRejectDialog
        open={openCancelDialog}
        onClose={onCloseCancelDialog}
        onReject={onConfirmCancle}
        title="Cancel request"
      />
    </>
  );
}
