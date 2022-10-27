import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import useAuth from 'src/hooks/useAuth';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';

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
    name: currentCompany?.name,
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

  return <div />;
}
