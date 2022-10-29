import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import useAuth from 'src/hooks/useAuth';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { FormProvider, RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import { Box, Card, Stack, Typography } from '@mui/material';

type Props = {
  currentAccount: any;
  isEdit: boolean;
};

export default function AccountNewEditForm({ currentAccount, isEdit }: Props) {
  const accountSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
  });

  const { user } = useAuth();

  const isCustomer = user?.account?.roleName === 'Customer';

  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = {
    code: currentAccount?.code || '',
    roleName: currentAccount?.roleName || '',
    username: currentAccount?.username || '',
  };

  const methods = useForm({
    resolver: yupResolver(accountSchema),
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
          <Box display="grid" sx={{ gap: 2, gridTemplateColumns: 'auto' }}>
            <RHFTextField name="code" label="Code" disabled />
          </Box>
          <RHFTextField name="roleName" label="RoleName" />
          <RHFTextField name="username" label="Username" />
        </Stack>
      </Card>
    </FormProvider>
  );
}
