import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import useAuth from 'src/hooks/useAuth';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';

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

  const defaultValues = {};

  const methods = useForm({
    resolver: yupResolver(AgencySchema),
    defaultValues,
  });

  return <div />;
}
