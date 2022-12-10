import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CircularProgress,
  ListItem,
  Stack,
  TextField,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from 'src/components/dialog/ConfirmDialog';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import useAuth from 'src/hooks/useAuth';
import useToggle from 'src/hooks/useToggle';
import { PATH_DASHBOARD } from 'src/routes/paths';
import axios from 'src/utils/axios';
import * as Yup from 'yup';
import CreateAccountDialog from '../../account/CreateAccountDialog';

type Props = {
  currentCompany: any;
  isEdit: boolean;
};

export default function CompanyNewEditForm({ currentCompany, isEdit }: Props) {
  const navigate = useNavigate();

  const CompanySchema = Yup.object().shape({
    name: Yup.string().trim().required('Name is required'),
    email: Yup.string().trim().email('Email is invalid').required('Email is required'),
    address: Yup.string().trim().required('Address is required'),
    phone: Yup.string()
      .trim()
      .matches(
        /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
        {
          message: 'Please enter valid number.',
          excludeEmptyString: false,
        }
      )
      .required('Phone is required'),
    account: Yup.object().required('Account is required'),
  });

  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  const { toggle: openDialog, onClose: onCloseDialog, setToggle: setOpenDialog } = useToggle(false);

  const [accounts, setAccounts] = useState([{ id: 'new', name: '' }]);

  const isCustomer = user?.account?.roleName === 'Customer';

  const { enqueueSnackbar } = useSnackbar();

  const fetchAccount = useCallback(async () => {
    try {
      const response = await axios.get('/api/accounts/get_all_accounts_is_not_assign', {
        params: { search: 'Customer', pageNumber: 1, pageSize: 1000 },
      });
      setAccounts([
        { id: 'new', name: '' },
        ...response.data.map((x) => ({ id: x.id, name: x.username })),
      ]);
    } catch (error) {
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createCompany = useCallback(async (data: any) => {
    try {
      const response: any = await axios.post('/api/customers/create_customer', data);
      if (response.status === 200 || response.status === 201) {
        setIsLoading(false);
        navigate(PATH_DASHBOARD.admin.company.root);
        enqueueSnackbar('Create company successfully', { variant: 'success' });
      } else {
        setIsLoading(false);
        enqueueSnackbar(response.message ?? 'Create company failed', {
          variant: 'error',
        });
      }
    } catch (error) {
      setIsLoading(false);
      enqueueSnackbar('Create company failed', { variant: 'error' });
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateCompany = useCallback(async (data: any) => {
    try {
      const response: any = await axios.put('/api/customers/update_customer_by_id', data, {
        params: { id: currentCompany!.id },
      });
      if (response.status === 200 || response.status === 201) {
        setIsLoading(false);
        navigate(PATH_DASHBOARD.admin.company.root);
        enqueueSnackbar('Update company successfully', { variant: 'success' });
      } else {
        setIsLoading(false);
        enqueueSnackbar(response.message, { variant: 'error' });
      }
    } catch (error) {
      setIsLoading(false);
      enqueueSnackbar('Update company failed', { variant: 'error' });
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const defaultValues = {
    code: currentCompany?.code || '',
    name: currentCompany?.name || '',
    account: currentCompany?.account,
    email: currentCompany?.email || '',
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
    setValue,
    control,
    formState: { isSubmitting },
  } = methods;

  const deleteCompany = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.put(
        '/api/customers/disable_customer_by_id',
        {},
        {
          params: { id: currentCompany!.id },
        }
      );
      if (response.status === 200 || response.status === 201) {
        setIsLoading(false);
        navigate(PATH_DASHBOARD.admin.company.root);
        enqueueSnackbar('Delete company successfully', { variant: 'success' });
      } else {
        setIsLoading(false);
        enqueueSnackbar('Delete company failed', { variant: 'error' });
      }
    } catch (error) {
      setIsLoading(false);
      enqueueSnackbar('Delete company failed', { variant: 'error' });
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (data: any) => {
    setIsLoading(true);
    if (isEdit) {
      const params = {
        name: data.name,
        description: data.description,
        address: data.address,
        mail: data.email,
        phone: data.phone,
      };
      updateCompany(params);
    } else {
      const params = {
        name: data.name,
        account_id: data.account.id,
        description: data.description,
        address: data.address,
        mail: data.email,
        phone: data.phone,
      };
      createCompany(params);
    }
  };

  const onCreateAccountSuccess = (account: any) => {
    const { id, username: name } = account;
    setValue('account', { id, name });
    fetchAccount();
  };

  useEffect(() => {
    fetchAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    toggle: openDeleteDialog,
    onClose: onCloseDeleteDialog,
    setToggle: setOpenDeleteDialog,
  } = useToggle(false);
  const disable = !isEdit && currentCompany != null;

  const onDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const onConfirmDelete = () => {
    deleteCompany();
  };

  const editPage = isEdit && currentCompany;

  const newPage = !isEdit && !currentCompany;

  const detailPage = !isEdit && currentCompany;

  const isAsign = isEdit && currentCompany;

  const handleCreateAccountClick = () => {
    setOpenDialog(true);
  };

  return (
    <>
      <FormProvider onSubmit={handleSubmit(onSubmit)} methods={methods}>
        <Card sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Box
              display="grid"
              sx={{ gap: 2, gridTemplateColumns: { xs: 'auto', md: 'auto auto' } }}
            >
              {/* <Typography variant="subtitle1">{getValues('code')}</Typography> */}
              {currentCompany != null && <RHFTextField name="code" label="Code" disabled />}
              <RHFTextField name="name" label="Name" />
              <RHFTextField name="email" label="Email" />
              <RHFTextField name="address" label="Address" />
              <RHFTextField name="phone" label="Phone" />
              <Controller
                name="account"
                control={control}
                render={({ field: { value, onChange }, fieldState: { error } }) => (
                  <Autocomplete
                    isOptionEqualToValue={(option: any, value: any) => option.id === value.id}
                    getOptionLabel={(option: any) => option.name}
                    renderOption={(props, { id, name }: any) => {
                      if (id === 'new') {
                        return (
                          <ListItem {...props} onClick={handleCreateAccountClick}>
                            Create an account
                          </ListItem>
                        );
                      } else {
                        return <ListItem {...props}>{name}</ListItem>;
                      }
                    }}
                    options={accounts}
                    onChange={(_: any, newValue: any) => onChange(newValue)}
                    disableClearable
                    disabled={isAsign}
                    value={value}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={!!error}
                        helperText={error?.message}
                        label="Account"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: <>{params.InputProps.endAdornment}</>,
                        }}
                      />
                    )}
                  />
                )}
              />
              <RHFTextField name="description" label="Description" multiline minRows={4} />
            </Box>
          </Stack>
          {!disable && (
            <Stack mt={3} direction="row" justifyContent="end" textAlign="end" spacing={2}>
              {editPage && !isCustomer && (
                <Button variant="outlined" color="error" onClick={onDeleteClick}>
                  Delete
                </Button>
              )}
              <LoadingButton loading={isSubmitting} variant="contained" type="submit">
                {isEdit ? 'Save' : 'Create'}
              </LoadingButton>
            </Stack>
          )}
        </Card>
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
      <CreateAccountDialog
        open={openDialog}
        onClose={onCloseDialog}
        role="Customer"
        onSuccess={onCreateAccountSuccess}
      />
      <ConfirmDialog
        open={openDeleteDialog}
        onClose={onCloseDeleteDialog}
        onConfirm={onConfirmDelete}
        title="Delete Customer"
        text="Are you sure you want to delete?"
      />
    </>
  );
}
