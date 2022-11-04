import { Chip, TableCell, TableRow, Typography } from '@mui/material';
import { Request, RequestStatus } from 'src/@types/request';
import { cutOut } from 'src/utils/cutOut';

type Props = {
  row: Request;
  onRowClick: VoidFunction;
};

export default function RequestTableRow({ row, onRowClick }: Props) {
  const { code, name, agency, service, customer, description, status } = row;
  console.log({ code, name, agency, service, customer, description, status });

  const parseStatus = (status: RequestStatus) => {
    if (status === 'pending') {
      return <Chip label="Pending" />;
    } else if (status === 'preparing') {
      return <Chip label="Preparing" color="info" />;
    } else if (status === 'rejected') {
      return <Chip label="Rejected" color="error" />;
    } else if (status === 'resolving') {
      return <Chip label="Resolving" color="warning" />;
    } else if (status === 'resolved') {
      return <Chip label="Resolved" color="success" />;
    } else if (status === 'editing') {
      return <Chip label="Editing" color="secondary" />;
    } else if (status === 'canceled') {
      return <Chip label="Canceled" color="error" />;
    }
    return <Chip label="Default" />;
  };

  return (
    <TableRow hover onClick={onRowClick} sx={{ cursor: 'pointer' }}>
      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {code}
        </Typography>
      </TableCell>
      <TableCell align="left">{name} </TableCell>
      <TableCell align="left">{agency.name} </TableCell>
      <TableCell align="left">{service.name} </TableCell>
      <TableCell align="left">{customer.name} </TableCell>
      {/* <TableCell align="left">{createdAt} </TableCell> */}
      <TableCell align="left">{cutOut(description)} </TableCell>
      <TableCell align="left">{parseStatus(status)} </TableCell>
    </TableRow>
  );
}
