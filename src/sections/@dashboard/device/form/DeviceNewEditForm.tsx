import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import { getValue } from '@mui/system';
import { DatePicker } from '@mui/x-date-pickers';
import { indexOf } from 'lodash';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import useAuth from 'src/hooks/useAuth';
import { CloseIcon } from 'src/theme/overrides/CustomIcons';
import axios from 'src/utils/axios';
import * as Yup from 'yup';
import ImageCard from './ImageCard';

type Props = {
  currentDevice: any;
  isEdit: boolean;
};

export default function DeviceNewEditForm({ currentDevice, isEdit }: Props) {
  const deviceSchema = Yup.object().shape({
    name: Yup.string().trim().required('Name is required'),
  });

  const [deviceTypes, setDeviceTypes] = useState([]);
  const [agencies, setAgencies] = useState([]);

  const { user } = useAuth();

  const isCustomer = user?.account?.roleName === 'Customer';

  const { enqueueSnackbar } = useSnackbar();

  const fetchDeviceType = useCallback(async () => {
    try {
      const response = await axios.get('/api/device_types/get_list_device_type');

      setAgencies(response.data.map((x) => ({ id: x.id, name: x.agency_name })));
    } catch (error) {
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleImageClick = async (value: any) => {
    handleClickOpen();
  };

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));
  interface DialogTitleProps {
    id: string;
    children?: React.ReactNode;
    onClose: () => void;
  }

  const fetchAgencies = useCallback(async () => {
    try {
      const response = await axios.get('/api/agencies/get_list_agencies');

      setDeviceTypes(response.data.map((x) => ({ id: x.id, name: x.device_type_name })));
    } catch (error) {
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const defaultValues = {
    code: currentDevice?.code || '',
    name: currentDevice?.name || '',
    typeName: currentDevice?.type?.name || '',
    agencyName: currentDevice?.agency.name,
    technician: currentDevice?.technician?.name || '',
    settingDate: currentDevice?.settingDate,
    guarantyStartDate: currentDevice?.guarantyStartDate,
    guarantyEndDate: currentDevice?.guarantyEndDate,
    image: currentDevice?.img ?? [],
  };

  const methods = useForm({
    resolver: yupResolver(deviceSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = (data: any) => {
    //
  };
  const disable = !isEdit && currentDevice != null;

  const onDeleteClick = () => {
    // deleteAccount();
  };

  useEffect(() => {
    fetchDeviceType();
    fetchAgencies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* <ImageCard image={defaultValues.image[0]} width="80%" height="80%" /> */}

      <FormProvider onSubmit={handleSubmit(onSubmit)} methods={methods}>
        <Card sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Box
              display="grid"
              sx={{ gap: 2, gridTemplateColumns: { xs: 'auto', md: 'auto auto' } }}
            >
              {/* <Typography variant="subtitle1">{getValues('code')}</Typography> */}
              <RHFTextField name="code" label="Code" disabled />
              <RHFTextField name="name" label="Name" disabled={disable} />
              <TextField
                label="Customer"
                value={currentDevice?.customer?.name ?? ''}
                disabled={disable}
              />
              <RHFTextField name="agencyName" label="Agency" disabled={disable} />
              <RHFTextField name="typeName" label="Device Type" disabled={disable} />
              <RHFTextField name="technician" label="Created By" disabled={disable} />
              <Controller
                name="settingDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label="Setting Date"
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
              <Controller
                name="guarantyStartDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label="Guaranty Start Date"
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
              <Controller
                name="guarantyEndDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label="Guaranty End Date"
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
    </>
  );
}
