import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, IconButton, Stack, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Priority } from 'src/@types/request';
import { FormProvider, RHFAutocomplete, RHFSelect, RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/Iconify';
import useAuth from 'src/hooks/useAuth';
import { PATH_DASHBOARD } from 'src/routes/paths';
import axios from 'src/utils/axios';
import * as Yup from 'yup';

type Props = {
  currentContract: any;
  isEdit: boolean;
};

function parsePriority(value: number): Priority {
  if (value <= 1) {
    return 'Low';
  } else if (value === 2) {
    return 'Medium';
  }
  return 'High';
}

const PRIORITY_OPTIONS = [
  { text: 'Low', value: 0 },
  { text: 'Medium', value: 1 },
  { text: 'High', value: 2 },
];

export default function ContractNewEditForm({ currentContract, isEdit }: Props) {
  const navigate = useNavigate();

  const ContractSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    service: Yup.array()
      .of(
        Yup.object().shape({
          value: Yup.object().required('Service is required'),
          frequencyMaintain: Yup.number()
            .required('Frequency maintain is required')
            .min(1, 'Frequency maintain must be greater than 0'),
        })
      )
      .length(1, 'At least 1 service is required'),
    customer: Yup.object().required('Name is required'),
    startDate: Yup.date().required('Start date is required'),
    endDate: Yup.date().required('End date is required'),
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
    startDate: currentContract?.startDate || null,
    endDate: currentContract?.endDate || null,
    attachment: currentContract?.attachment || '',
    img: currentContract?.img || '',
    description: currentContract?.description || '',
    service:
      currentContract?.service || (disable ? null : [{ value: null, frequencyMaintain: null }]),
  };

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

  const methods = useForm({
    resolver: yupResolver(ContractSchema),
    defaultValues,
  });

  const createContract = useCallback(async (data: any) => {
    try {
      const response = await axios.post('/api/contracts/create_contract', data);
      if (response.status === 200 || response.status === 201) {
        enqueueSnackbar('Create contract successfully', { variant: 'success' });
      } else {
        enqueueSnackbar('Create contract failed', { variant: 'error' });
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
        enqueueSnackbar('Delete contract successfully', { variant: 'success' });
        navigate(PATH_DASHBOARD.admin.contract.root);
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
    formState: { isSubmitting },
  } = methods;

  const { fields, append, remove } = useFieldArray({ control, name: 'service' });

  const handleAppend = () => {
    append({});
  };

  const handleRemove = (index: number) => {
    remove(index);
  };

  const onSubmit = (data: any) => {
    if (isEdit) {
      //
    } else {
      console.log(data);

      const params = {
        customer_id: data.customer.id,
        contract_name: data.name,
        contract_price: data.price,
        priority: data.priorty,
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
    fetchServices();
    fetchCustomer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDeleteClick = () => {
    deleteContract();
  };
  console.log(defaultValues);
  return (
    <FormProvider onSubmit={handleSubmit(onSubmit)} methods={methods}>
      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Box display="grid" sx={{ gap: 2, gridTemplateColumns: { xs: 'auto', md: 'auto auto' } }}>
            {/* <Typography variant="subtitle1">{getValues('code')}</Typography> */}
            {currentContract?.code && (
              <TextField value={currentContract?.code} label="Code" disabled />
            )}
            <RHFTextField name="name" label="Name" disabled={disable} />
            <RHFSelect disabled={disable} name="priority" label="Priority">
              {PRIORITY_OPTIONS.map((option) => (
                <option key={option.text} value={option.value}>
                  {option.text}
                </option>
              ))}
            </RHFSelect>
            <Controller
              name="startDate"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  label="Start Date"
                  value={field.value}
                  onChange={(newValue) => {
                    field.onChange(newValue);
                  }}
                  disabled={disable}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth error={!!error} helperText={error?.message} />
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
                  value={field.value}
                  onChange={(newValue) => {
                    field.onChange(newValue);
                  }}
                  disabled={disable}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth error={!!error} helperText={error?.message} />
                  )}
                />
              )}
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
            <RHFTextField
              name="description"
              label="Description"
              disabled={disable}
              multiline
              minRows={4}
            />
          </Box>
        </Stack>
      </Card>
      {fields && (fields.length > 0 || !disable) && (
        <Card sx={{ p: 3, mt: 3 }}>
          <Stack spacing={2}>
            <Typography variant="h6" fontWeight={600}>
              Service
            </Typography>
            {fields.map((_, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Box display="grid" sx={{ gridTemplateColumns: 'auto auto', flexGrow: 1, gap: 2 }}>
                  <RHFAutocomplete
                    name={`service[${index}].value`}
                    label="Service"
                    variant="outlined"
                    options={services}
                    fullWidth
                    disabled={disable}
                  />
                  <RHFTextField
                    name={`service[${index}].frequencyMaintain`}
                    label="Frequency Maintain"
                    disabled={disable}
                  />
                </Box>
                {!disable && (
                  <Box>
                    <IconButton onClick={() => handleRemove(index)} color="error">
                      <Iconify icon="fluent:delete-12-regular" sx={{ color: 'error.main' }} />
                    </IconButton>
                  </Box>
                )}
              </Box>
            ))}
          </Stack>
          {!disable && (
            <Stack mt={2} direction="row" justifyContent="start" textAlign="start" spacing={2}>
              <Button variant="outlined" color="info" onClick={handleAppend}>
                Add
              </Button>
            </Stack>
          )}
        </Card>
      )}
      {!disable && (
        <Stack mt={3} direction="row" justifyContent="end" textAlign="end" spacing={2}>
          <Button variant="outlined" color="error" onClick={onDeleteClick}>
            Delete
          </Button>
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
