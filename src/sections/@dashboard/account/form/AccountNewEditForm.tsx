import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Button, Card, Stack } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FormProvider, RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import useAuth from 'src/hooks/useAuth';
import { PATH_DASHBOARD } from 'src/routes/paths';
import axios from 'src/utils/axios';
import * as Yup from 'yup';

type Props = {
  currentAccount: any;
  isEdit: boolean;
};

export default function AccountNewEditForm({ currentAccount, isEdit }: Props) {
  const navigate = useNavigate();

  const AccountSchema = Yup.object().shape({
    role: Yup.string().required('Role is required'),
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  });

  const [roles, setRoles] = useState([]);

  const { user } = useAuth();

  const isCustomer = user?.account?.roleName === 'Customer';

  const { enqueueSnackbar } = useSnackbar();

  const fetchRoles = useCallback(async () => {
    try {
      const response = await axios.get('/api/accounts/get_all_roles');

      setRoles(response.data.map((x) => ({ id: x.id, name: x.role_name })));
    } catch (error) {
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const defaultValues = {
    code: currentAccount?.code || '',
    role: currentAccount?.role,
    username: currentAccount?.username || '',
    password: '',
  };

  const createAccount = useCallback(async (data: any) => {
    try {
      const response = await axios.post('/api/accounts/create_account', data);
      if (response.status === 200 || response.status === 201) {
        enqueueSnackbar('Create account successfully', { variant: 'success' });
      }
    } catch (error) {
      enqueueSnackbar('Create account failed', { variant: 'error' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateAccount = useCallback(async (data: any) => {
    try {
      const response = await axios.put('/api/accounts/update_account_by_id', data, {
        params: { id: currentAccount!.id },
      });
      if (response.status === 200 || response.status === 201) {
        enqueueSnackbar('Update account successfully', { variant: 'success' });
        navigate(PATH_DASHBOARD.admin.account.root);
      }
    } catch (error) {
      enqueueSnackbar('Update account failed', { variant: 'error' });
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteAccount = useCallback(async () => {
    try {
      const response = await axios.put(
        '/api/accounts/disable_account_by_id',
        {},
        {
          params: { id: currentAccount!.id },
        }
      );
      if (response.status === 200 || response.status === 201) {
        enqueueSnackbar('Delete account successfully', { variant: 'success' });
        navigate(PATH_DASHBOARD.admin.account.root);
      } else {
        enqueueSnackbar('Delete account failed', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Delete account failed', { variant: 'error' });
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const methods = useForm({
    resolver: yupResolver(AccountSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = (data: any) => {
    if (isEdit) {
      const params = {
        id: currentAccount!.id,
        role_id: data.role.id,
        password: data.password,
      };
      updateAccount(params);
    } else {
      const params = {
        role_id: data.role.id,
        user_name: data.username,
        password: data.password,
      };
      createAccount(params);
    }
  };

  const onDeleteClick = () => {
    deleteAccount();
  };

  useEffect(() => {
    fetchRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const disable = !isEdit && currentAccount != null;

  return (
    <FormProvider onSubmit={handleSubmit(onSubmit)} methods={methods}>
      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* <Typography variant="subtitle1">{getValues('code')}</Typography> */}
          <Box display="grid" sx={{ gap: 2, gridTemplateColumns: 'auto' }}>
            {isEdit && <RHFTextField name="code" label="Code" disabled />}
            <RHFAutocomplete
              name="role"
              label="Role"
              variant="outlined"
              options={roles}
              fullWidth
              InputLabelProps={{ shrink: true }}
              disabled={disable}
            />
            <RHFTextField name="username" label="Username" disabled={disable} />
            {!isEdit && <RHFTextField name="password" label="Password" disabled={disable} />}
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
