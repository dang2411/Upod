import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Button, Card, Grid, Stack, TextField } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import { useSnackbar } from 'notistack';
import { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from 'src/components/dialog/ConfirmDialog';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import useAuth from 'src/hooks/useAuth';
import useToggle from 'src/hooks/useToggle';
import { PATH_DASHBOARD } from 'src/routes/paths';
import axios from 'src/utils/axios';
import * as Yup from 'yup';
import { MaintainTitleSection } from '../../maintain-report/form/MaintainTitleSection';

type Props = {
  currentMaintainSchedule: any;
  isEdit: boolean;
};

export default function MaintainScheduleNewEditForm({ currentMaintainSchedule, isEdit }: Props) {
  const serviceSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
  });

  const navigate = useNavigate();

  const { user } = useAuth();

  const isCustomer = user?.account?.roleName === 'Customer';

  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = {
    code: currentMaintainSchedule?.code || '',
    name: currentMaintainSchedule?.name || '',
    maintainTime: currentMaintainSchedule?.maintain_time,
    agency: {
      name: currentMaintainSchedule.agency.agency_name,
      id: currentMaintainSchedule.agency.id,
    },
    contract: {
      id: currentMaintainSchedule.contract.id,
      name: currentMaintainSchedule.contract.name,
    },
    technician: {
      name: currentMaintainSchedule.technician.tech_name,
      id: currentMaintainSchedule.technician.id,
    },
    createDate: currentMaintainSchedule?.create_date,
    startTime: currentMaintainSchedule?.start_time,
    endTime: currentMaintainSchedule?.end_time,
    status: currentMaintainSchedule.status,
    description: currentMaintainSchedule.description,
  };

  const updateMaintainSchedule = useCallback(async (data: any) => {
    try {
      const response: any = await axios.put(
        '/api/maintenance_schedules/update_maintenance_schedule_by_id',
        data,
        {
          params: { id: currentMaintainSchedule!.id },
        }
      );
      if (response.status === 200 || response.status === 201) {
        navigate(PATH_DASHBOARD.admin.maintainSchedule.root);
        enqueueSnackbar('Update maintain schedule successfully', { variant: 'success' });
      } else {
        enqueueSnackbar(response.message, { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Update  maintain schedule failed', { variant: 'error' });
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteMaintainSchedule = useCallback(async () => {
    try {
      const response = await axios.put(
        '/api/maintenance_schedules/disable_maintenance_schedule_by_id',
        {},
        {
          params: { id: currentMaintainSchedule!.id },
        }
      );
      if (response.status === 200 || response.status === 201) {
        enqueueSnackbar('Delete maintain schedule successfully', { variant: 'success' });
        navigate(PATH_DASHBOARD.admin.maintainSchedule.root);
      } else {
        enqueueSnackbar('Delete maintain schedule successfully', { variant: 'success' });
      }
    } catch (error) {
      enqueueSnackbar('Delete agency failed', { variant: 'error' });
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (data: any) => {
    if (isEdit) {
      const params = {
        id: currentMaintainSchedule!.id,
        description: data.description,
        maintain_time: data.maintainTime,
      };
      updateMaintainSchedule(params);
    }
  };

  const methods = useForm({
    resolver: yupResolver(serviceSchema),
    defaultValues,
  });
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
    deleteMaintainSchedule();
  };

  const {
    handleSubmit,
    control,
    watch,
    getValues,
    formState: { isSubmitting },
  } = methods;
  const disableNameDescription =
    currentMaintainSchedule.status === 'MISSED' ||
    currentMaintainSchedule.status === 'MAINTAINING' ||
    currentMaintainSchedule.status === 'COMPLETED';

  const editPage = isEdit && currentMaintainSchedule;

  const status = currentMaintainSchedule.status.toLowerCase();

  return (
    <>
      <FormProvider onSubmit={handleSubmit(onSubmit)} methods={methods}>
        {isEdit && (
          <Box mb={2}>
            <MaintainTitleSection label={currentMaintainSchedule.code} status={watch('status')} />
          </Box>
        )}
        <Grid container spacing={3}>
          <Grid item xs={12} md={9}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <RHFTextField name="name" label="Name" disabled />
                <Controller
                  name="maintainTime"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DateTimePicker
                      label="Maintain Time"
                      inputFormat="dd/MM/yyyy hh:mm"
                      value={field.value}
                      disabled={disableNameDescription}
                      onChange={(newValue) => {
                        field.onChange(newValue);
                      }}
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
                <RHFTextField
                  name="description"
                  label="Description"
                  multiline
                  minRows={4}
                  disabled={disableNameDescription}
                />
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                {/* {isEdit && <TitleSection label={getValues('code')} status={watch('status')} />} */}

                <TextField
                  disabled
                  value={currentMaintainSchedule.agency.agency_name}
                  label="Agency"
                />
                <TextField
                  disabled
                  value={currentMaintainSchedule.technician.tech_name}
                  label="Techician"
                />
                <TextField
                  disabled
                  value={currentMaintainSchedule.contract.name}
                  label="Contract"
                />
                {status === 'completed' && (
                  <>
                    <TextField
                      disabled
                      value={format(
                        new Date(currentMaintainSchedule.start_time),
                        'HH:mm dd/MM/yyy'
                      )}
                      label="Start Time"
                      fullWidth
                    />
                    <TextField
                      disabled
                      value={format(new Date(currentMaintainSchedule.end_time), 'HH:mm dd/MM/yyy')}
                      label="End Time"
                      fullWidth
                    />
                  </>
                )}
              </Stack>
            </Card>
          </Grid>
        </Grid>

        {(currentMaintainSchedule.status === 'SCHEDULED' ||
          currentMaintainSchedule.status === 'NOTIFIED') && (
          <Stack mt={3} direction="row" justifyContent="end" textAlign="end" spacing={2}>
            <Button variant="outlined" color="error" onClick={onDeleteClick}>
              Delete
            </Button>
            <LoadingButton loading={isSubmitting} variant="contained" type="submit">
              {editPage ? 'Save' : 'Create'}
            </LoadingButton>
          </Stack>
        )}
      </FormProvider>
      <ConfirmDialog
        open={openDeleteDialog}
        onClose={onCloseDeleteDialog}
        onConfirm={onConfirmDelete}
        title="Delete Maintain Schedule"
        text="Are you sure you want to delete?"
      />
    </>
  );
}
