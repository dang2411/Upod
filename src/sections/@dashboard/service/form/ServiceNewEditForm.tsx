import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import { watch } from 'fs';
import { useSnackbar } from 'notistack';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from 'src/components/dialog/ConfirmDialog';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/Iconify';
import useAuth from 'src/hooks/useAuth';
import useToggle from 'src/hooks/useToggle';
import { PATH_DASHBOARD } from 'src/routes/paths';
import axios from 'src/utils/axios';
import uploadFirebase from 'src/utils/uploadFirebase';
import * as Yup from 'yup';

type Props = {
  currentService: any;
  isEdit: boolean;
};

export default function ServiceNewEditForm({ currentService, isEdit }: Props) {
  const serviceSchema = Yup.object().shape({
    name: Yup.string().trim().required('Name is required'),
  });
  const navigate = useNavigate();
  const { user } = useAuth();
  const [file, setFile] = useState<any>();

  const isCustomer = user?.account?.roleName === 'Customer';

  const [isLoading, setIsLoading] = useState(false);

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
      setIsLoading(true);
      const response = await axios.put(
        '/api/services/disable_service_by_id',
        {},
        {
          params: { id: currentService!.id },
        }
      );
      if (response.status === 200 || response.status === 201) {
        enqueueSnackbar('Delete service successfully', { variant: 'success' });
        setIsLoading(false);
        navigate(PATH_DASHBOARD.admin.service.root);
      } else {
        setIsLoading(false);
        enqueueSnackbar('Delete account failed', { variant: 'error' });
      }
    } catch (error) {
      setIsLoading(false);
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
        setIsLoading(false);
        navigate(PATH_DASHBOARD.admin.service.root);
        enqueueSnackbar('Update service successfully', { variant: 'success' });
      } else {
        setIsLoading(false);
        enqueueSnackbar(response.message, { variant: 'error' });
      }
    } catch (error) {
      setIsLoading(false);
      enqueueSnackbar('Update service failed', { variant: 'error' });
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createService = useCallback(async (data: any) => {
    try {
      const response: any = await axios.post('/api/services/create_service', data);
      if (response.status === 200 || response.status === 201) {
        setIsLoading(false);
        navigate(PATH_DASHBOARD.admin.service.root);
        enqueueSnackbar('Create service successfully', { variant: 'success' });
      } else {
        setIsLoading(false);
        enqueueSnackbar(response.message, { variant: 'error' });
      }
    } catch (error) {
      setIsLoading(false);
      enqueueSnackbar('Create service failed', { variant: 'error' });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    toggle: openDeleteDialog,
    onClose: onCloseDeleteDialog,
    setToggle: setOpenDeleteDialog,
  } = useToggle(false);

  const {
    toggle: openDeleteImageDialog,
    onClose: onCloseDeleteImageDialog,
    setToggle: setOpenDeleteImageDialog,
  } = useToggle(false);

  const methods = useForm({
    resolver: yupResolver(serviceSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    let fileUrl = '';
    if (file) fileUrl = await uploadFirebase(file, user?.account?.id ?? 'other');
    if (isEdit) {
      const params = {
        service_name: data.name,
        description: data.description,
        guideline: fileUrl,
      };
      updateService(params);
    } else {
      const params = {
        service_name: data.name,
        description: data.description,
        guideline: fileUrl,
      };
      createService(params);
    }
  };
  const disable = !isEdit && currentService != null;

  const { toggle: openDialog, onClose: onCloseDialog, setToggle: setOpenDialog } = useToggle(false);

  const onDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const onDeleteImageClick = () => {
    setOpenDeleteImageDialog(true);
  };

  const onConfirmDelete = () => {
    deleteService();
  };

  const onConfirmDeleteImage = () => {
    setValue('guideline', '');
    setOpenDeleteImageDialog(false);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    // @ts-ignore: Object is possibly 'null'.
    setFile(e.target.files[0]);
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
              {!watch('guideline') && (
                <RHFTextField
                  name=""
                  label="Guideline"
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
              {watch('guideline') && (
                <RHFTextField
                  name="guideline"
                  label="Guideline"
                  value={getValues('guideline')}
                  InputProps={{
                    endAdornment: getValues('guideline') && (
                      <>
                        <Stack direction={'row'} spacing={3}>
                          <LoadingButton
                            href={getValues('guideline')}
                            target="_blank"
                            variant="contained"
                            type="submit"
                            size="small"
                          >
                            Download
                          </LoadingButton>
                          <Iconify
                            icon="akar-icons:cross"
                            sx={{ cursor: 'pointer', width: 20, height: 20, color: 'black' }}
                            onClick={onDeleteImageClick}
                          />
                        </Stack>
                      </>
                    ),
                  }}
                  disabled={disable}
                />
              )}
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
        title="Delete Service"
        text="Are you sure you want to delete?"
      />
      <ConfirmDialog
        open={openDeleteImageDialog}
        onClose={onCloseDeleteImageDialog}
        onConfirm={onConfirmDeleteImage}
        title="Delete file"
        text="Are you sure you want to delete?"
      />
    </>
  );
}
