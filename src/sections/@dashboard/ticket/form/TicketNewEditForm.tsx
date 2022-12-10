import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import useAuth from 'src/hooks/useAuth';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';

type Props = {
  currentTicket: any;
  isEdit: boolean;
};

export default function TicketNewEditForm({ currentTicket, isEdit }: Props) {
  const ticketSchema = Yup.object().shape({
    name: Yup.string().trim().required('Name is required'),
  });

  const { user } = useAuth();

  const isCustomer = user?.account?.roleName === 'Customer';

  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = {};

  const methods = useForm({
    resolver: yupResolver(ticketSchema),
    defaultValues,
  });

  const { handleSubmit, getValues } = methods;

  const onSubmit = (data: any) => {
    //
  };

  return <div />;
}
