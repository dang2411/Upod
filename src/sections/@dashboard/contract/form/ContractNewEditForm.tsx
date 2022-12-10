import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CircularProgress,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { add } from 'date-fns';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from 'src/components/dialog/ConfirmDialog';
import {
  FormProvider,
  RHFAutocomplete,
  RHFTextField,
  RHFUploadMultiFile,
} from 'src/components/hook-form';
import useAuth from 'src/hooks/useAuth';
import useToggle from 'src/hooks/useToggle';
import { PATH_DASHBOARD } from 'src/routes/paths';
import ContractTerminalDialog from '../dialog/ContractTerminalDialog';
import axios from 'src/utils/axios';
import * as Yup from 'yup';
import Iconify from 'src/components/Iconify';
import { SwiperSlide } from 'swiper/react';
import uploadFirebase from 'src/utils/uploadFirebase';
import ContractNewEditImageContainer from '../card/ContractNewEditImageContainer';

type Props = {
  currentContract: any;
  isEdit: boolean;
};

export default function ContractNewEditForm({ currentContract, isEdit }: Props) {
  const navigate = useNavigate();

  const ContractSchema = Yup.object().shape({
    name: Yup.string().trim().required('Name is required'),
    startDate: Yup.date().required('Start date is required'),
    endDate: Yup.date().required('End date is required'),
    customer: Yup.object().required('Customer is required'),
    service: Yup.array()
      .required('Service is required')
      .test({
        message: 'At least one service is required',
        test: (arr) => arr!?.length > 0,
      }),
    frequencyMaintain: Yup.number().required('Frequency maintain is required'),
    contractPrice: Yup.number(),
  });

  const { user } = useAuth();

  const [services, setServices] = useState([]);

  const [file, setFile] = useState<any>();

  const [customers, setCustomers] = useState([]);

  const isCustomer = user?.account?.roleName === 'Customer';

  const [isLoading, setIsLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const disable = !isEdit && currentContract != null;

  const defaultValues = {
    code: currentContract?.code || '',
    name: currentContract?.name || '',
    customer: currentContract?.customer,
    contractPrice: currentContract?.contractPrice || 0,
    startDate: currentContract?.startDate ? new Date(currentContract?.startDate) : new Date(),
    endDate: currentContract?.endDate
      ? new Date(currentContract?.endDate)
      : add(new Date(), { months: 6 }),
    attachment: currentContract?.attachment || '',
    is_expire: currentContract?.is_expire,
    is_accepted: currentContract?.is_accepted,
    terminal_content: currentContract?.terminal_content,
    terminal_time: currentContract?.terminal_time,
    reject_reason: currentContract?.reject_reason,
    img: currentContract?.img || '',
    description: currentContract?.description || '',
    frequencyMaintain: currentContract?.frequencyMaintain || 0,
    service: currentContract?.service,
    images: currentContract?.images || [],
  };


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

  const fetchServices = useCallback(async (customerId: string) => {
    try {
      var response;
      if (isCustomer) {
        response = await axios.get('/api/customers/get_services_by_customer_id', {
          params: { id: user?.account?.id },
        });
      } else {
        response = await axios.get('/api/customers/get_services_not_in_contract_customer', {
          params: { id: customerId },
        });
      }
      setServices(response.data.map((x) => ({ id: x.id, name: x.service_name })));
    } catch (error) {
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const methods = useForm({
    resolver: yupResolver(ContractSchema),
    defaultValues,
  });

  const {
    toggle: openTerminateDialog,
    onClose: onCloseTerminateDialog,
    setToggle: setOpenTerminateDialog,
  } = useToggle(false);

  const {
    toggle: openRejectDialog,
    onClose: onCloseRejectDialog,
    setToggle: setOpenRejectDialog,
  } = useToggle(false);

  const onConfirmReject = (value: string) => {
    setIsLoading(true);
    RejectContract(value);
  };

  const onConfirmTerminate = (value: string) => {
    setIsLoading(true);
    TerminateContract(value);
  };

  const TerminateContract = useCallback(async (data: string) => {
    try {
      const response = await axios.put(
        '/api/contracts/terminal_contract_by_id',
        { terminal_content: data },
        {
          params: { id: currentContract?.id },
        }
      );
      if (response.status === 200 || response.status === 201) {
        setIsLoading(false);
        navigate(PATH_DASHBOARD.admin.contract.root);
        enqueueSnackbar('Terminal contract successfully', { variant: 'success' });
      }
    } catch (error) {
      setIsLoading(false);
      enqueueSnackbar('Terminal contract failed', { variant: 'error' });
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const RejectContract = useCallback(async (data: string) => {
    try {
      const response = await axios.put(
        '/api/customers/reject_contract_by_id',
        { reject_reason: data },
        {
          params: { cus_id: user?.account?.id, con_id: currentContract?.id },
        }
      );
      if (response.status === 200 || response.status === 201) {
        setIsLoading(false);
        navigate(PATH_DASHBOARD.customer.contract.root);
        enqueueSnackbar('Reject successfully', { variant: 'success' });
      }
    } catch (error) {
      setIsLoading(false);
      enqueueSnackbar('Reject failed', { variant: 'error' });
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRejectClick = (event) => {
    setOpenRejectDialog(true);
  };

  const onTerminateClick = (event) => {
    setOpenTerminateDialog(true);
  };

  const createContract = useCallback(async (data: any) => {
    try {
      const response: any = await axios.post('/api/contracts/create_contract', data);
      if (response.status === 200 || response.status === 201) {
        setIsLoading(false);
        navigate(PATH_DASHBOARD.admin.contract.root);
        enqueueSnackbar('Create contract successfully', { variant: 'success' });
      } else {
        setIsLoading(false);
        enqueueSnackbar(response.message, { variant: 'error' });
      }
    } catch (error) {
      setIsLoading(false);
      enqueueSnackbar('Create contract failed', { variant: 'error' });
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const approveContract = useCallback(async () => {
    try {
      const response: any = await axios.put(
        '/api/customers/approve_contract_by_id',
        {},
        {
          params: { cus_id: user?.account?.id, con_id: currentContract.id },
        }
      );
      if (response.status === 200 || response.status === 201) {
        setIsLoading(false);
        navigate(PATH_DASHBOARD.customer.contract.root);
        enqueueSnackbar('Approve successfully', { variant: 'success' });
      } else {
        setIsLoading(false);
        enqueueSnackbar(response.message || 'Approve failed', { variant: 'error' });
      }
    } catch (error) {
      setIsLoading(false);
      enqueueSnackbar('Approve failed', { variant: 'error' });
      console.error(error);
    }
  }, []);

  const deleteContract = useCallback(async () => {
    try {
      const response = await axios.put(
        '/api/contracts/disable_contract_by_id',
        {},
        {
          params: { id: currentContract!.id },
        }
      );
      if (response.status === 200 || response.status === 201) {
        navigate(PATH_DASHBOARD.admin.contract.root);
        enqueueSnackbar('Delete contract successfully', { variant: 'success' });
      } else {
        enqueueSnackbar('Delete contract failed', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Delete contract failed', { variant: 'error' });
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    handleSubmit,
    control,
    watch,
    getValues,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const onUploadClick = () =>
    Promise.all(
      values.images.map(async (item) => uploadFirebase(item, user?.account?.id ?? 'other'))
    );

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    if (isCustomer) {
      approveContract();
    } else {
      let fileUrl = '';
      if (file) fileUrl = await uploadFirebase(file, user?.account?.id ?? 'other');
      const urlList = await onUploadClick();
      const params = {
        customer_id: data.customer.id,
        contract_name: data.name,
        contract_price: data.contractPrice,
        attachment: fileUrl,
        img: urlList,
        description: data.description,
        start_date: data.startDate,
        end_date: data.endDate,
        service: data.service.map((x: any) => ({ service_id: x.id })),
        frequency_maintain_time: data.frequencyMaintain,
      };
      createContract(params);
    }
  };
  const is_expire = defaultValues.is_expire;

  useEffect(() => {
    fetchCustomer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchServices(getValues('customer')?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch('customer')]);

  const { toggle: openDialog, onClose: onCloseDialog, setToggle: setOpenDialog } = useToggle(false);

  const {
    toggle: openDeleteDialog,
    onClose: onCloseDeleteDialog,
    setToggle: setOpenDeleteDialog,
  } = useToggle(false);

  const onDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const onConfirmDelete = () => {
    deleteContract();
  };

  const editPage = isEdit && currentContract;

  const newPage = !isEdit && !currentContract;

  // const detailPage = !isEdit && currentContract;

  const serviceList = services.filter(
    (x: { id: string; name: string }) => !services.find((y: any) => y.value?.id === x.id)
  ) as any[];

  const values = watch();
  const handleDropMultiple = useCallback(
    (acceptedFiles) => {
      const images = values.images || [];

      setValue('images', [
        ...images,
        ...acceptedFiles.map((file: Blob | MediaSource) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ),
      ]);
    },
    [setValue, values.images]
  );

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    // @ts-ignore: Object is possibly 'null'.
    setFile(e.target.files[0]);
  };

  const handleRemoveAll = () => {
    setValue('images', []);
  };

  const handleRemove = (file: File | string) => {
    const filteredItems = values.images?.filter((_file) => _file !== file);
    setValue('images', filteredItems);
  };

  return (
    <>
      <FormProvider onSubmit={handleSubmit(onSubmit)} methods={methods}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                {currentContract?.code && (
                  <Typography variant="subtitle1">{getValues('code')}</Typography>
                )}
                <RHFTextField name="name" label="Name" disabled={disable} />
                <RHFAutocomplete
                  name="customer"
                  label="Customer"
                  variant="outlined"
                  options={customers}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  disabled={disable || isEdit}
                />
                <Controller
                  name="service"
                  control={control}
                  render={({ field: { value, onChange }, fieldState: { error } }) => (
                    <Autocomplete
                      multiple
                      options={services}
                      getOptionLabel={(option: any) => option.name}
                      isOptionEqualToValue={(option: any, value: any) => option.id === value.id}
                      value={value}
                      filterSelectedOptions
                      onChange={(_: any, newValue: any) => {
                        onChange(newValue);
                      }}
                      disabled={disable}
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
                <RHFTextField
                  name="description"
                  label="Description"
                  disabled={disable}
                  multiline
                  minRows={4}
                />
                {defaultValues.terminal_content && (
                  <>
                    <RHFTextField
                      name="terminal_content"
                      label="Terminal Content"
                      disabled={disable}
                      multiline
                    />
                    <RHFTextField
                      name="terminal_time"
                      label="Terminal Date"
                      disabled={disable}
                      multiline
                    />
                  </>
                )}
                {defaultValues.reject_reason && (
                  <RHFTextField
                    name="reject_reason"
                    label="Reject reason"
                    disabled={disable}
                    multiline
                  />
                )}
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      label="Start Date"
                      value={field.value}
                      inputFormat="dd/MM/yyyy"
                      onChange={(newValue) => {
                        field.onChange(newValue);
                      }}
                      disabled={disable}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          error={!!error}
                          helperText={error?.message}
                        />
                      )}
                    />
                  )}
                />
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      label="End Date"
                      inputFormat="dd/MM/yyyy"
                      value={field.value}
                      onChange={(newValue) => {
                        field.onChange(newValue);
                      }}
                      disabled={disable}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          error={!!error}
                          helperText={error?.message}
                        />
                      )}
                    />
                  )}
                />
                <RHFTextField
                  name="contractPrice"
                  label="Contract Price"
                  variant="outlined"
                  type="number"
                  disabled={disable}
                />
                <RHFTextField
                  name="frequencyMaintain"
                  label="Frequency Maintain"
                  type="number"
                  disabled={disable}
                />
                {newPage && (
                  <RHFTextField
                    name=""
                    label="Attachment"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <input type="file" id="myFile" name="filename" onChange={onFileChange} />
                        </InputAdornment>
                      ),
                    }}
                    disabled={disable}
                  />
                )}

                {!newPage &&
                  ((is_expire && (
                    <RHFTextField
                      name=""
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Iconify
                              icon="akar-icons:circle-check"
                              sx={{ width: 20, height: 20, color: 'success.main' }}
                            />
                          </InputAdornment>
                        ),
                      }}
                      label="Expired"
                      disabled={disable}
                    />
                  )) ||
                    (!is_expire && (
                      <RHFTextField
                        name=""
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Iconify
                                icon="charm:circle-cross"
                                sx={{ width: 20, height: 20, color: 'error.main' }}
                              />
                            </InputAdornment>
                          ),
                        }}
                        label="Expired"
                        disabled={disable}
                      />
                    )))}
                {!newPage &&
                  ((defaultValues.is_accepted && (
                    <RHFTextField
                      name=""
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Iconify
                              icon="akar-icons:circle-check"
                              sx={{ width: 20, height: 20, color: 'success.main' }}
                            />
                          </InputAdornment>
                        ),
                      }}
                      label="Accepted"
                      disabled={disable}
                    />
                  )) ||
                    (!defaultValues.is_accepted && (
                      <RHFTextField
                        name=""
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Iconify
                                icon="charm:circle-cross"
                                sx={{ width: 20, height: 20, color: 'error.main' }}
                              />
                            </InputAdornment>
                          ),
                        }}
                        label="Accepted"
                        disabled={disable}
                      />
                    )))}
              </Stack>
            </Card>
          </Grid>
          {!newPage && (
            <>
              <Grid item xs={12} md={8}>
                <Card sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    <>
                      <Typography variant="subtitle1">Files</Typography>
                      {defaultValues.attachment && (
                        <RHFTextField
                          name=""
                          label="Attachment"
                          value={defaultValues.attachment}
                          InputProps={{
                            endAdornment: (
                              <LoadingButton
                                href={defaultValues.attachment}
                                variant="contained"
                                type="submit"
                                size="small"
                              >
                                Download
                              </LoadingButton>
                            ),
                          }}
                          disabled={disable}
                        />
                      )}
                    </>
                  </Stack>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ p: 3 }}>
                  <RHFTextField
                    name=""
                    value={''}
                    label="Images"
                    InputProps={{
                      startAdornment: (
                        <ContractNewEditImageContainer fullWidth listImage={defaultValues.img} />
                      ),
                    }}
                    disabled={disable}
                  />
                </Card>
              </Grid>
            </>
          )}
        </Grid>
        {newPage && (
          <>
            <Typography variant="subtitle1">Image</Typography>
            <SwiperSlide key={'Add'}>
              <RHFUploadMultiFile
                showPreview
                showButton={false}
                name="images"
                maxSize={3145728}
                onDrop={handleDropMultiple}
                onRemove={handleRemove}
                onRemoveAll={handleRemoveAll}
                onUpload={onUploadClick}
              />
            </SwiperSlide>
          </>
        )}

        {!disable && (
          <Stack mt={3} direction="row" justifyContent="end" textAlign="end" spacing={2}>
            {!isEdit && (
              <>
                <LoadingButton loading={isSubmitting} variant="contained" type="submit">
                  Create
                </LoadingButton>
              </>
            )}
          </Stack>
        )}
        {disable && (
          <Stack mt={3} direction="row" justifyContent="end" textAlign="end" spacing={2}>
            {!isCustomer && !is_expire && defaultValues.is_accepted && (
              <>
                <LoadingButton variant="outlined" color="error" onClick={onTerminateClick}>
                  Terminate
                </LoadingButton>
              </>
            )}
            {isCustomer && !is_expire && !defaultValues.is_accepted && (
              <>
                <LoadingButton variant="outlined" color="error" onClick={onRejectClick}>
                  Reject
                </LoadingButton>
                <LoadingButton loading={isSubmitting} variant="contained" type="submit">
                  Approve
                </LoadingButton>
              </>
            )}
          </Stack>
        )}
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
        title="Delete Contract"
        text="Are you sure you want to delete?"
      />
      <ContractTerminalDialog
        open={openTerminateDialog}
        onClose={onCloseTerminateDialog}
        onReject={onConfirmTerminate}
        title="Terminate contract"
        text="Terminate content"
      />
      <ContractTerminalDialog
        open={openRejectDialog}
        onClose={onCloseRejectDialog}
        onReject={onConfirmReject}
        title="Reject contract"
        text="Reaject reason"
      />
    </>
  );
}
