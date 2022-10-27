import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import useAuth from 'src/hooks/useAuth';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';

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
    code: currentAccount?.code,
    roleId: currentAccount?.roleId || '',
    roleName: currentAccount?.roleName || new Date(),
    username: currentAccount?.username || new Date(),
    isDelete: currentAccount?.isDelete || '',
  };

  const methods = useForm({
    resolver: yupResolver(accountSchema),
    defaultValues,
  });

  return <div />;
}
