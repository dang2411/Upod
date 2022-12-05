import { Chip, TableCell, TableRow, Typography } from '@mui/material';
import { format } from 'date-fns';
import { Request, RequestStatus } from 'src/@types/request';
import { cutOut } from 'src/utils/cutOut';

type Props = {
  row: Request;
  onRowClick: VoidFunction;
};

export default function RequestTableRow({ row, onRowClick }: Props) {
  const { code, name, agency, service, createdBySystem , createdByAdmin, customer, createdAt, description, status } =
    row;

  const parseStatus = (status: RequestStatus) => {
    if (status === 'pending') {
      return <Chip label="Pending" size="small" />;
    } else if (status === 'preparing') {
      return <Chip label="Preparing" color="info" size="small" />;
    } else if (status === 'rejected') {
      return <Chip label="Rejected" color="error" size="small" />;
    } else if (status === 'resolving') {
      return <Chip label="Resolving" color="info" size="small" />;
    } else if (status === 'resolved') {
      return <Chip label="Resolved" color="success" size="small" />;
    } else if (status === 'warning') {
      return <Chip label="Warning" color="warning" size="small" />;
    } else if (status === 'canceled') {
      return <Chip label="Canceled" color="error" size="small" />;
    } else if (status === 'completed') {
      return <Chip label="Completed" color="success" size="small" />;
    }
    return <Chip label="Default" size="small" />;
  };

  return (
    <TableRow hover onClick={onRowClick} sx={{ cursor: 'pointer' }}>
      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {code}
        </Typography>
      </TableCell>
      <TableCell align="left">{cutOut(name)} </TableCell>
      <TableCell align="left">{agency.name} </TableCell>
      <TableCell align="left">{service.name} </TableCell>
      <TableCell align="left">{createdBySystem ? 'System'  : createdByAdmin ? 'Admin' : customer.name} </TableCell>
      <TableCell align="left">{customer.name} </TableCell>
      <TableCell align="left">{format(new Date(createdAt), 'HH:mm dd/MM/yyyy')} </TableCell>
      {/* <TableCell align="left">{createdAt} </TableCell> */}
      <TableCell align="left">{cutOut(description)} </TableCell>
      <TableCell align="left">{parseStatus(status)} </TableCell>
    </TableRow>
  );
}
