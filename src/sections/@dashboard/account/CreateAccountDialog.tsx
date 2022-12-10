import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Dialog, Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import axios from 'src/utils/axios';
import * as Yup from 'yup';

export default function CreateAccountDialog({ open, onClose, onSuccess, role }: any) {
  const AccountSchema = Yup.object().shape({
    username: Yup.string().trim().required('Username is required'),
    password: Yup.string()
      .trim()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters'),
  });

  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = {
    username: '',
    password: '',
    afterSubmit: '',
  };

  const createAccount = useCallback(async (data: any) => {
    try {
      setValue('afterSubmit', '');
      let endpoint = '/api/accounts/create_account_technician';
      if (role === 'Customer') {
        endpoint = '/api/accounts/create_account_customer';
      }
      const response: any = await axios.post(endpoint, data);
      if (response.status === 200 || response.status === 201) {
        onSuccess(response.data);
        enqueueSnackbar('Create account successfully', { variant: 'success' });
        handleClose();
      } else {
        setValue('afterSubmit', response.message);
      }
    } catch (error) {
      setValue('afterSubmit', error.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const methods = useForm({
    resolver: yupResolver(AccountSchema),
    defaultValues,
  });

  const onSubmit = (data: any) => {
    const params = {
      role_id: role.id,
      user_name: data.username,
      password: data.password,
    };
    createAccount(params);
  };

  const {
    handleSubmit,
    getValues,
    reset,
    watch,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const handleCancel = (_: any) => {
    handleClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={handleClose}>
      <Stack direction="row" alignItems="center" justifyContent="start" sx={{ py: 2.5, px: 3 }}>
        <Typography variant="h6">Create an account</Typography>
      </Stack>
      <FormProvider onSubmit={handleSubmit(onSubmit)} methods={methods}>
        <Stack sx={{ p: 3, pt: 0 }} spacing={2}>
          <RHFTextField name="username" label="Username" />
          <RHFTextField name="password" label="Password" />
          {watch('afterSubmit') && (
            <Typography variant="body1" color="error">
              {getValues('afterSubmit')}
            </Typography>
          )}
          <Stack sx={{ width: '100%' }} direction="row" justifyContent="end" spacing={2}>
            <Button variant="outlined" color="error" onClick={handleCancel}>
              Cancel
            </Button>
            <LoadingButton loading={isSubmitting} variant="contained" type="submit">
              Create
            </LoadingButton>
          </Stack>
        </Stack>
      </FormProvider>
    </Dialog>
  );
}
