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
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
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
  currentArea: any;
  isEdit: boolean;
};

export default function AreaNewEditForm({ currentArea, isEdit }: Props) {
  const areaSchema = Yup.object().shape({
    name: Yup.string().trim().required('Name is required'),
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toggle: openDialog, onClose: onCloseDialog, setToggle: setOpenDialog } = useToggle(false);

  const {
    toggle: openDeleteDialog,
    onClose: onCloseDeleteDialog,
    setToggle: setOpenDeleteDialog,
  } = useToggle(false);

  const isCustomer = user?.account?.roleName === 'Customer';

  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = {
    code: currentArea?.code || '',
    name: currentArea?.name || '',
    description: currentArea?.description || '',
    createDate: currentArea?.createDate || '',
  };

  const deleteArea = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.put(
        '/api/areas/disable_area_by_id',
        {},
        {
          params: { id: currentArea!.id },
        }
      );
      if (response.status === 200 || response.status === 201) {
        enqueueSnackbar('Delete area successfully', { variant: 'success' });
        setIsLoading(false);
        navigate(PATH_DASHBOARD.admin.area.root);
      } else {
        setIsLoading(false);
        enqueueSnackbar('Delete area failed', { variant: 'error' });
      }
    } catch (error) {
      setIsLoading(false);
      enqueueSnackbar('Delete area failed', { variant: 'error' });
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateArea = useCallback(async (data: any) => {
    try {
      const response: any = await axios.put('/api/areas/update_area_by_id', data, {
        params: { id: currentArea!.id },
      });
      if (response.status === 200 || response.status === 201) {
        setIsLoading(false);
        navigate(PATH_DASHBOARD.admin.area.root);
        enqueueSnackbar('Update area successfully', { variant: 'success' });
      } else {
        setIsLoading(false);
        enqueueSnackbar(response.message, { variant: 'error' });
      }
    } catch (error) {
      setIsLoading(false);
      enqueueSnackbar('Update area failed', { variant: 'error' });
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createArea = useCallback(async (data: any) => {
    try {
      const response: any = await axios.post('/api/areas/create_area', data);
      if (response.status === 200 || response.status === 201) {
        setIsLoading(false);
        navigate(PATH_DASHBOARD.admin.area.root);
        enqueueSnackbar('Create area successfully', { variant: 'success' });
      } else {
        setIsLoading(false);
        enqueueSnackbar(response.message, { variant: 'error' });
      }
    } catch (error) {
      setIsLoading(false);
      enqueueSnackbar('Create area failed', { variant: 'error' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const methods = useForm({
    resolver: yupResolver(areaSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    getValues,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = (data: any) => {
    setIsLoading(true);
    if (isEdit) {
      const params = {
        area_name: data.name,
        description: data.description,
      };
      updateArea(params);
    } else {
      const params = {
        area_name: data.name,
        description: data.description,
      };
      createArea(params);
    }
  };

  useEffect(() => {}, []);

  const onDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const onConfirmDelete = () => {
    deleteArea();
  };

  const disable = !isEdit && currentArea != null;

  const editPage = isEdit && currentArea;

  const newPage = !isEdit && !currentArea;

  const detailPage = !isEdit && currentArea;

  const handleCreateAccountClick = () => {
    setOpenDialog(true);
  };

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
              {/* <Typography variant="subtitle1">{getValues('code')}</Typography> */}
              {currentArea != null && <RHFTextField name="code" label="Code" disabled />}
              <RHFTextField name="name" label="Name" />
              {!newPage && (
                <TextField
                  value={format(new Date(currentArea!.createDate), 'HH:mm dd/MM/yyyy')}
                  label="Create Date "
                  disabled
                />
              )}
              <RHFTextField name="description" label="Description " disabled={disable} />
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
      <ConfirmDialog
        open={openDeleteDialog}
        onClose={onCloseDeleteDialog}
        onConfirm={onConfirmDelete}
        title="Delete Area"
        text="Are you sure you want to delete?"
      />
    </>
  );
}
