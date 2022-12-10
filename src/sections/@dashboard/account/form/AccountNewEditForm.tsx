import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Button, Card, CircularProgress, Stack } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from 'src/components/dialog/ConfirmDialog';
import {
  FormProvider,
  RHFAutocomplete,
  RHFTextField,
  RHFUploadMultiFile,
  RHFUploadSingleFile,
} from 'src/components/hook-form';
import useAuth from 'src/hooks/useAuth';
import useToggle from 'src/hooks/useToggle';
import { PATH_DASHBOARD } from 'src/routes/paths';
import axios from 'src/utils/axios';
import uploadFirebase from 'src/utils/uploadFirebase';
import * as Yup from 'yup';

type Props = {
  currentAccount: any;
  isEdit: boolean;
};

export default function AccountNewEditForm({ currentAccount, isEdit }: Props) {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const AccountSchema = Yup.object().shape({
    role: Yup.object().required('Role is required'),
    username: Yup.string().trim().required('Username is required'),
    password: Yup.string().trim().required('Password is required'),
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
    password: currentAccount?.password || '',
    is_assign: currentAccount?.is_assign,
    // single file
    cover: null,
    // multi file
    images: currentAccount?.images || [],
  };

  const createAccount = useCallback(async (data: any) => {
    try {
      const response: any = await axios.post('/api/accounts/create_account', data);
      if (response.status === 200 || response.status === 201) {
        enqueueSnackbar('Create account successfully', { variant: 'success' });
        setIsLoading(false);
        navigate(PATH_DASHBOARD.admin.account.root);
      } else {
        enqueueSnackbar(response.message || 'Create account failed', { variant: 'error' });
        setIsLoading(false);
      }
    } catch (error) {
      enqueueSnackbar('Create account failed', { variant: 'error' });
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateAccount = useCallback(async (data: any) => {
    try {
      const response = await axios.put('/api/accounts/update_account_by_id', data, {
        params: { id: currentAccount!.id },
      });
      if (response.status === 200 || response.status === 201) {
        setIsLoading(false);
        navigate(PATH_DASHBOARD.admin.account.root);
        enqueueSnackbar('Update account successfully', { variant: 'success' });
      }
    } catch (error) {
      setIsLoading(false);
      enqueueSnackbar('Update account failed', { variant: 'error' });
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteAccount = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.put(
        '/api/accounts/disable_account_by_id',
        {},
        {
          params: { id: currentAccount.id },
        }
      );
      if (response.status === 200 || response.status === 201) {
        setIsLoading(false);
        enqueueSnackbar('Delete account successfully', { variant: 'success' });
        navigate(PATH_DASHBOARD.admin.account.root);
      } else {
        setIsLoading(false);
        enqueueSnackbar('Delete account failed', { variant: 'error' });
      }
    } catch (error) {
      setIsLoading(false);
      enqueueSnackbar('Delete account failed', { variant: 'error' });
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { toggle: openDialog, onClose: onCloseDialog, setToggle: setOpenDialog } = useToggle(false);

  const {
    toggle: openDeleteDialog,
    onClose: onCloseDeleteDialog,
    setToggle: setOpenDeleteDialog,
  } = useToggle(false);

  const methods = useForm({
    resolver: yupResolver(AccountSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = (data: any) => {
    setIsLoading(true);
    if (isEdit) {
      const params = {
        id: currentAccount!.id,
        role_id: data.role.id,
        password: data.password,
      };
      updateAccount(params);
    } else {
      const params = {
        role_name: data.role.name,
        user_name: data.username,
        password: data.password,
      };
      createAccount(params);
    }
  };

  const onDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const onConfirmDelete = () => {
    setOpenDeleteDialog(false);
    deleteAccount();
  };

  useEffect(() => {
    fetchRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const disable = !isEdit && currentAccount != null;

  const editPage = isEdit && currentAccount;

  const disableUsername = isEdit && currentAccount != null;

  const values = watch();

  const handleDropSingle = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'cover',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  const onUploadClick = async () => {
    //
    const images = values.images || [];
    const urlList = await Promise.all(
      images.map(async (item) => uploadFirebase(item, user?.account?.id ?? 'other'))
    );
    console.log(urlList);
  };

  // input cua ham la files
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
                disabled={false}
              />
              <RHFTextField name="username" label="Username" disabled={disableUsername} />
              <RHFTextField name="password" label="Password" disabled={false} />
            </Box>
          </Stack>
          {!disable && (
            <Stack mt={3} direction="row" justifyContent="end" textAlign="end" spacing={2}>
              {editPage && !isCustomer && !defaultValues.is_assign && (
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
        {/* <RHFUploadMultiFile
          showPreview
          name="images"
          maxSize={3145728}
          onDrop={handleDropMultiple}
          onRemove={handleRemove}
          onRemoveAll={handleRemoveAll}
          onUpload={onUploadClick}
        /> */}
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
        title="Delete Account"
        text="Are you sure you want to delete?"
      />
    </>
  );
}
