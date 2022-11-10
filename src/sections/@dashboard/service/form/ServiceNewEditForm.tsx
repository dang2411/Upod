import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import useAuth from 'src/hooks/useAuth';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { FormProvider, RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import { Box, Button, Card, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { description } from 'src/_mock/text';

type Props = {
  currentService: any;
  isEdit: boolean;
};

export default function ServiceNewEditForm({ currentService, isEdit }: Props) {
  const serviceSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
  });

  const { user } = useAuth();

  const isCustomer = user?.account?.roleName === 'Customer';

  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = {
    code: currentService?.code || '',
    name: currentService?.name || '',
    description: currentService?.description || '',
    createDate: currentService?.createDate || '',
    isDelete: currentService?.isDelete || '',
  };

  const methods = useForm({
    resolver: yupResolver(serviceSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    getValues,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = (data: any) => {};
  const disable = !isEdit && currentService != null;

  const onDeleteClick = () => {
    // deleteAccount();
  };

  const editPage = isEdit && currentService;

  const newPage = !isEdit && !currentService;

  const detailPage = !isEdit && currentService;

  return (
    <FormProvider onSubmit={handleSubmit(onSubmit)} methods={methods}>
      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* <Typography variant="subtitle1">{getValues('code')}</Typography> */}
          <Box display="grid" sx={{ gap: 2, gridTemplateColumns: { xs: 'auto', md: 'auto auto' } }}>
            <RHFTextField name="name" label="Name" disabled={disable} />
            <RHFTextField name="telephone" label="Telephone" disabled={disable} />
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
  );
}
