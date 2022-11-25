import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Button, Card, Stack, TextField, Typography } from '@mui/material';
import { format } from 'date-fns';
import { useSnackbar } from 'notistack';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from 'src/components/dialog/ConfirmDialog';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import useAuth from 'src/hooks/useAuth';
import useToggle from 'src/hooks/useToggle';
import { PATH_DASHBOARD } from 'src/routes/paths';
import axios from 'src/utils/axios';
import * as Yup from 'yup';

type Props = {
  currentService: any;
  isEdit: boolean;
};

export default function ServiceNewEditForm({ currentService, isEdit }: Props) {
  const serviceSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
  });
  const navigate = useNavigate();
  const { user } = useAuth();

  const isCustomer = user?.account?.roleName === 'Customer';

  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = {
    code: currentService?.code || '',
    name: currentService?.name || '',
    description: currentService?.description || '',
    isDelete: currentService?.isDelete || '',
    guideline: currentService?.guideline || '',
  };

  const deleteService = useCallback(async () => {
    try {
      const response = await axios.put(
        '/api/services/disable_service_by_id',
        {},
        {
          params: { id: currentService!.id },
        }
      );
      if (response.status === 200 || response.status === 201) {
        enqueueSnackbar('Delete service successfully', { variant: 'success' });
        navigate(PATH_DASHBOARD.admin.service.root);
      } else {
        enqueueSnackbar('Delete account failed', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Delete service failed', { variant: 'error' });
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateService = useCallback(async (data: any) => {
    try {
      const response: any = await axios.put('/api/services/update_service_by_id', data, {
        params: { id: currentService!.id },
      });
      if (response.status === 200 || response.status === 201) {
        navigate(PATH_DASHBOARD.admin.service.root);
        enqueueSnackbar('Update service successfully', { variant: 'success' });
      } else {
        enqueueSnackbar(response.message, { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Update service failed', { variant: 'error' });
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createService = useCallback(async (data: any) => {
    try {
      const response: any = await axios.post('/api/services/create_service', data);
      if (response.status === 200 || response.status === 201) {
        navigate(PATH_DASHBOARD.admin.service.root);
        enqueueSnackbar('Create service successfully', { variant: 'success' });
      } else {
        enqueueSnackbar(response.message, { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Create service failed', { variant: 'error' });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const methods = useForm({
    resolver: yupResolver(serviceSchema),
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
        service_name: data.name,
        description: data.description,
        guideline: data.guideline,
      };
      updateService(params);
    } else {
      const params = {
        service_name: data.name,
        description: data.description,
        guideline: data.guideline,
      };
      createService(params);
    }
  };
  const disable = !isEdit && currentService != null;

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
    deleteService();
  };

  const editPage = isEdit && currentService;

  const newPage = !isEdit && !currentService;

  const detailPage = !isEdit && currentService;

  return (
    <>
      <FormProvider onSubmit={handleSubmit(onSubmit)} methods={methods}>
        <Card sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Typography variant="subtitle1">{getValues('code')}</Typography>
            <Box
              display="grid"
              sx={{ gap: 2, gridTemplateColumns: { xs: 'auto', md: 'auto auto' } }}
            >
              <RHFTextField name="name" label="Name" disabled={disable} />
              <RHFTextField name="description" label="Description " disabled={disable} />
              <RHFTextField name="guideline" label="Guideline " disabled={disable} />
              {!newPage && (
                <TextField
                  value={format(new Date(currentService.createDate), 'HH:mm dd/MM/yyyy')}
                  label="Create Date "
                  disabled
                />
              )}
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
      <ConfirmDialog
        open={openDeleteDialog}
        onClose={onCloseDeleteDialog}
        onConfirm={onConfirmDelete}
        title="Delete Service"
        text="Are you sure you want to delete?"
      />
    </>
  );
}
