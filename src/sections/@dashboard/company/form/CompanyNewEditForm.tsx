import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import useAuth from 'src/hooks/useAuth';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { FormProvider, RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import { Box, Card, Stack, Typography } from '@mui/material';

type Props = {
  currentCompany: any;
  isEdit: boolean;
};

export default function CompanyNewEditForm({ currentCompany, isEdit }: Props) {
  const CompanySchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
  });

  const { user } = useAuth();

  const isCustomer = user?.account?.roleName === 'Customer';

  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = {
    code: currentCompany?.code || '',
    name: currentCompany?.name || '',
    account: currentCompany?.account,
    mail: currentCompany?.mail || '',
    address: currentCompany?.address || '',
    phone: currentCompany?.phone || '',
    description: currentCompany?.description || '',
  };

  const methods = useForm({
    resolver: yupResolver(CompanySchema),
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
          <Box display="grid" sx={{ gap: 2, gridTemplateColumns: { xs: 'auto', md: 'auto auto' } }}>
            {/* <Typography variant="subtitle1">{getValues('code')}</Typography> */}
            <RHFTextField name="code" label="Code" disabled />
            <RHFTextField name="name" label="Name" />
            <RHFTextField name="mail" label="Mail" />
            <RHFTextField name="address" label="Address" />
            <RHFTextField name="phone" label="Phone" />
            <RHFTextField name="description" label="Description" />
            <RHFAutocomplete
              name="account"
              label="Account"
              variant="outlined"
              options={[]}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </Stack>
      </Card>
    </FormProvider>
  );
}
