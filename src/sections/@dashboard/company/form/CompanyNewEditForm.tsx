import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import useAuth from 'src/hooks/useAuth';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { FormProvider, RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import { Box, Button, Card, Stack, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useCallback, useEffect, useState } from 'react';
import axios from 'src/utils/axios';

type Props = {
  currentCompany: any;
  isEdit: boolean;
};

export default function CompanyNewEditForm({ currentCompany, isEdit }: Props) {
  const CompanySchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
  });

  const { user } = useAuth();

  const [accounts, setAccounts] = useState([]);

  const isCustomer = user?.account?.roleName === 'Customer';

  const { enqueueSnackbar } = useSnackbar();

  const fetchAccount = useCallback(async () => {
    try {
      const response = await axios.get('/api/accounts/get_all_accounts', {
        params: { pageNumber: 1, pageSize: 1000 },
      });
      setAccounts(response.data.map((x) => ({ id: x.id, name: x.username })));
    } catch (error) {
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createCompany = useCallback(async (data: any) => {
    try {
      await axios.post('/api/customers/create_customer', data);
      enqueueSnackbar('Create company successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Create company failed', { variant: 'error' });
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateCompany = useCallback(async (data: any) => {
    try {
      await axios.put('/api/customers/update_customer_by_id', data, {
        params: { id: currentCompany!.id },
      });
      enqueueSnackbar('Update company successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Update company failed', { variant: 'error' });
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const defaultValues = {
    code: currentCompany?.code || '',
    name: currentCompany?.name || '',
    account: currentCompany?.account,
    mail: currentCompany?.mail || '',
    address: currentCompany?.address || '',
    phone: currentCompany?.phone || '',
    description: currentCompany?.description || '',
  };

  const methods = useForm({
    resolver: yupResolver(CompanySchema),
    defaultValues,
  });

  const {
    handleSubmit,
    getValues,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = (data: any) => {
    if (isEdit) {
      const params = {
        name: data.name,
        account_id: data.account.id,
        description: data.description,
        address: data.address,
        mail: data.mail,
        phone: data.phone,
      };
      updateCompany(params);
    } else {
      const params = {
        name: data.name,
        account_id: data.account.id,
        description: data.description,
        address: data.address,
        mail: data.mail,
        phone: data.phone,
      };
      createCompany(params);
    }
  };

  useEffect(() => {
    fetchAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const disable = !isEdit && currentCompany != null;

  const onDeleteClick = () => {
    // deleteAccount();
  };

  return (
    <FormProvider onSubmit={handleSubmit(onSubmit)} methods={methods}>
      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Box display="grid" sx={{ gap: 2, gridTemplateColumns: { xs: 'auto', md: 'auto auto' } }}>
            {/* <Typography variant="subtitle1">{getValues('code')}</Typography> */}
            {currentCompany != null && <RHFTextField name="code" label="Code" disabled />}
            <RHFTextField name="name" label="Name" />
            <RHFTextField name="mail" label="Mail" />
            <RHFTextField name="address" label="Address" />
            <RHFTextField name="phone" label="Phone" />
            <RHFTextField name="description" label="Description" />
            <RHFAutocomplete
              name="account"
              label="Account"
              variant="outlined"
              options={accounts}
              fullWidth
              InputLabelProps={{ shrink: true }}
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
