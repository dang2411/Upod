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
    return <Chip label="Resolving" color="warning" size="small" />;
  } else if (status === 'resolved') {
    return <Chip label="Resolved" color="success" size="small" />;
  } else if (status === 'editing') {
    return <Chip label="Editing" color="secondary" size="small" />;
  } else if (status === 'canceled') {
    return <Chip label="Canceled" color="error" size="small" />;
  } else if (status === 'closed') {
    return <Chip label="Closed" color="success" size="small" />;
  }
  return <Chip label="Default" size="small" />;
};

type Props = {
  currentRequest: any;
  isEdit: boolean;
  isMaintain?: boolean;
};

export default function RequestNewEditForm({ currentRequest, isEdit, isMaintain = false }: Props) {
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

  const isCreatedByAdmin = currentRequest?.createdBy?.role === 'Admin';

  const defaultValues = {
    code: currentRequest?.code || '',
    name: currentRequest?.name || '',
    contract: currentRequest?.contract,
    service: currentRequest?.service,
    address: currentRequest?.agency?.address || '',
    phone: currentRequest?.agency?.phone || '',
    agency: currentRequest?.agency,
    // priority: currentRequest?.priority || 1,
    description: currentRequest?.description || '',
    customer: currentRequest?.customer,
    status: currentRequest?.status || 'pending',
    createdAt: currentRequest?.createdAt || '',
    createdBy: isCreatedByAdmin ? 'Admin' : currentRequest?.createdBy?.name,
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

  const fetchAgencies = useCallback(async () => {
    try {
      setIsLoading(true);
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
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchServices = useCallback(async () => {
    try {
      setIsLoading(true);
      var response;
      if (isCustomer) {
        response = await axios.get('/api/customers/get_services_by_customer_id', {
          params: { id: user?.account?.id },
        });
      } else {
        response = await axios.get('/api/services/get_all_services');
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

  const reopenRequest = useCallback(async (data: any) => {
    try {
      setIsLoading(true);
      const response = await axios.put('/api/requests/reopen_request_by_id', {}, { params: data });
      setValue('status', 'editing');
      if (response.status === 200 || response.status === 201) {
        setIsLoading(false);
        navigate(PATH_DASHBOARD.admin.request.root);
        enqueueSnackbar('Reopen request successfully', { variant: 'success' });
      }
    } catch (error) {
      enqueueSnackbar('Reopen request failed', { variant: 'error' });
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        enqueueSnackbar('Update ticket successfully', { variant: 'success' });
      }
    } catch (error) {
      enqueueSnackbar('Update ticket failed', { variant: 'error' });
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
    fetchAgencies();
    fetchServices();
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

  const onSubmit = async (data: any) => {
    if (isEdit) {
      if (currentStatus === 'editing') {
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
        report_service_id: currentRequest?.reportId,
        customer_id: currentRequest?.customer.id,
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
    (currentStatus === 'pending' && isCustomer && isCreatedByCurrentUser)
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
              <Grid item xs={12} md={6}>
                <RHFAutocomplete
                  name="agency"
                  label="Agency"
                  variant="outlined"
                  options={agencies}
                  fullWidth
                  disabled={diableServiceAgency}
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
                  disabled={diableServiceAgency}
                />
              </Grid>
              {/* <Grid item xs={12} md={6}>
      <RHFSelect disabled={disabled} name="priority" label="Priority">
        {PRIORITY_OPTIONS.map(({ text, value }) => (
          <option key={text} value={value}>
            {text}
          </option>
        ))}
      </RHFSelect>
    </Grid> */}
              {(editPage || isMaintain) && (
                <Grid item xs={12} md={6}>
                  <TextField
                    value={getValues('customer')?.name ?? ''}
                    label="Customer"
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    disabled={true}
                  />
                </Grid>
              )}
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
                  currentStatus === 'closed' ||
                  currentStatus === 'editing') && (
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

              {!newPage && !isMaintain && (
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
                    (currentStatus === 'resolved' ||
                      currentStatus === 'closed' ||
                      currentStatus === 'editing') && (
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="End Time"
                          variant="outlined"
                          fullWidth
                          disabled
                          value={format(new Date(currentRequest!.endTime), 'HH:mm dd/MM/yyyy')}
                        />
                      </Grid>
                    )}
                </>
              )}
              {editPage && (
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
              {((editPage && (!isCustomer || (isCustomer && currentStatus !== 'pending'))) ||
                isMaintain) && (
                <Grid item xs={12} md={6}>
                  <RHFTextField
                    name="technician"
                    value={watch('technician')?.tech_name ?? ''}
                    helperText={
                      currentStatus === 'pending' ? (
                        <Typography sx={{ color: 'error.main' }} variant="body2">
                          Please assign a technician
                        </Typography>
                      ) : undefined
                    }
                    error={
                      (currentStatus === 'pending' || currentStatus === 'preparing') && !isCustomer
                    }
                    label="Technician"
                    variant="outlined"
                    fullWidth
                    onClick={() => {
                      if (
                        (currentStatus === 'pending' || currentStatus === 'preparing') &&
                        !isCustomer
                      ) {
                        setOpenConfirmDialog(true);
                      }
                    }}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ readOnly: true }}
                    disabled={
                      !(
                        (currentStatus === 'pending' || currentStatus === 'preparing') &&
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
          {(currentStatus === 'editing' ||
            currentStatus === 'closed' ||
            currentStatus === 'resolved') && (
            <RequestNewEditTicketForm
              requestId={id}
              agencyId={watch('agency').id}
              editable={currentStatus === 'editing'}
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
            {(currentStatus === 'preparing' && !isCustomer && isCreatedByAdmin && (
              <Button onClick={handleCancelClick} color="error" variant="outlined">
                Cancel
              </Button>
            )) ||
              (currentStatus === 'preparing' && isCustomer && isCreatedByCurrentUser && (
                <Button onClick={handleCancelClick} color="error" variant="outlined">
                  Cancel
                </Button>
              ))}
            {currentStatus === 'pending' && !isCustomer && editPage && !isCreatedByAdmin && (
              <Button onClick={handleShowReject} color="error" variant="outlined">
                Reject
              </Button>
            )}
            {currentStatus === 'resolved' && !isCustomer && (
              <Button onClick={handleReopenClick} color="info" variant="outlined">
                Reopen
              </Button>
            )}
            {currentStatus === 'pending' && !isCustomer && editPage && watch('technician') && (
              <Button variant="contained" color="info" onClick={handleConfirm}>
                Confirm
              </Button>
            )}
            {((currentStatus === 'pending' && isCustomer && isCreatedByCurrentUser) ||
              (currentStatus === 'preparing' && !isCustomer && isCreatedByAdmin) ||
              (currentStatus === 'editing' && !isCustomer)) &&
              editPage && (
                <LoadingButton loading={isSubmitting} variant="contained" type="submit">
                  Save
                </LoadingButton>
              )}
            {(newPage || isMaintain) && (
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
          id={isMaintain ? currentRequest.reportId : id}
          isMaintain={isMaintain}
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
