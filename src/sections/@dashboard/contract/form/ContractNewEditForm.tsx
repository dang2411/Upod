import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Autocomplete, Button, Card, Grid, Stack, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { add } from 'date-fns';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FormProvider, RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import useAuth from 'src/hooks/useAuth';
import { PATH_DASHBOARD } from 'src/routes/paths';
import axios from 'src/utils/axios';
import * as Yup from 'yup';

type Props = {
  currentContract: any;
  isEdit: boolean;
};

export default function ContractNewEditForm({ currentContract, isEdit }: Props) {
  const navigate = useNavigate();

  const ContractSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    startDate: Yup.date().required('Start date is required'),
    endDate: Yup.date().required('End date is required'),
    service: Yup.array()
      .required('Service is required')
      .test({
        message: 'At least one service is required',
        test: (arr) => arr!.length > 0,
      }),
    frequencyMaintain: Yup.number().required('Frequency maintain is required'),
  });

  const { user } = useAuth();

  const [services, setServices] = useState([]);

  const [customers, setCustomers] = useState([]);

  const isCustomer = user?.account?.roleName === 'Customer';

  const { enqueueSnackbar } = useSnackbar();

  const disable = !isEdit && currentContract;

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
    img: currentContract?.img || '',
    description: currentContract?.description || '',
    frequencyMaintain: currentContract?.frequencyMaintain || 0,
    service: currentContract?.service || [],
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

  const createContract = useCallback(async (data: any) => {
    try {
      const response: any = await axios.post('/api/contracts/create_contract', data);
      if (response.status === 200 || response.status === 201) {
        navigate(PATH_DASHBOARD.admin.contract.root);
        enqueueSnackbar('Create contract successfully', { variant: 'success' });
      } else {
        enqueueSnackbar(response.message, { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Create contract failed', { variant: 'error' });
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    formState: { isSubmitting },
  } = methods;

  const onSubmit = (data: any) => {
    if (isEdit) {
      //
    } else {
      const params = {
        customer_id: data.customer.id,
        contract_name: data.name,
        contract_price: data.contractPrice,
        attachment: undefined,
        img: undefined,
        description: data.description,
        start_date: data.startDate,
        end_date: data.endDate,
        service: data.service.map((x: any) => ({
          service_id: x.value.id,
          frequency_maintain: x.frequencyMaintain,
        })),
      };
      createContract(params);
    }
  };

  useEffect(() => {
    fetchCustomer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchServices(getValues('customer')?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch('customer')]);

  const onDeleteClick = () => {
    deleteContract();
  };

  const editPage = isEdit && currentContract;

  // const newPage = !isEdit && !currentContract;

  // const detailPage = !isEdit && currentContract;

  const serviceList = services.filter(
    (x: { id: string; name: string }) => !services.find((y: any) => y.value?.id === x.id)
  ) as any[];

  return (
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
              <RHFTextField
                name="description"
                label="Description"
                disabled={disable}
                multiline
                minRows={4}
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
                fullWidth
                type="number"
                disabled={disable}
              />
              <RHFTextField
                name="frequencyMaintain"
                label="Frequency Maintain"
                type="number"
                disabled={disable}
              />
            </Stack>
          </Card>
        </Grid>
      </Grid>
      {!disable && (
        <Stack mt={3} direction="row" justifyContent="end" textAlign="end" spacing={2}>
          {editPage && !isCustomer && (
            <Button variant="outlined" color="error" onClick={onDeleteClick}>
              Delete
            </Button>
          )}
          {!isEdit && (
            <LoadingButton loading={isSubmitting} variant="contained" type="submit">
              Create
            </LoadingButton>
          )}
        </Stack>
      )}
    </FormProvider>
  );
}
