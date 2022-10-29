import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import useAuth from 'src/hooks/useAuth';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { FormProvider, RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import { Box, Card, Stack, Typography } from '@mui/material';

type Props = {
  currentAgency: any;
  isEdit: boolean;
};

export default function AgencyNewEditForm({ currentAgency, isEdit }: Props) {
  const AgencySchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
  });

  const { user } = useAuth();

  const isCustomer = user?.account?.roleName === 'Customer';

  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = {
    name: currentAgency?.name || '',
    customer: currentAgency?.customer,
    area: currentAgency?.area,
    description: currentAgency?.description || '',
    address: currentAgency?.address || '',
    telephone: currentAgency?.telephone || '',
    manager: currentAgency?.manager || '',
  };

  const methods = useForm({
    resolver: yupResolver(AgencySchema),
    defaultValues,
  });

  const { handleSubmit, getValues } = methods;

  const onSubmit = (data: any) => {
    //
  };

  return (
    <FormProvider onSubmit={handleSubmit(onSubmit)} methods={methods}>
      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* <Typography variant="subtitle1">{getValues('code')}</Typography> */}
          <Box display="grid" sx={{ gap: 2, gridTemplateColumns: { xs: 'auto', md: 'auto auto' } }}>
            <RHFTextField name="name" label="Name" />
            <RHFTextField name="description" label="Description" />
            <RHFTextField name="address" label="Address" />
            <RHFTextField name="telephone" label="Telephone" />
            <RHFTextField name="manager" label="manager" />
            {/* <RHFAutocomplete
              name="area"
              label="Area"
              variant="outlined"
              options={areas}
              fullWidth
              InputLabelProps={{ shrink: true }}
            /> */}

            <RHFTextField name="account" label="Account" disabled />
          </Box>
        </Stack>
      </Card>
    </FormProvider>
  );
}
