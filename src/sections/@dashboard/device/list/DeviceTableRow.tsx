import { TableCell, TableRow, Typography } from '@mui/material';
import { format } from 'date-fns';

type Props = {
  row: any;
  onRowClick: VoidFunction;
};

export default function DeviceTableRow({ row, onRowClick }: Props) {
  const { code, name, agency, service, customer, type } = row;
  return (
    <TableRow hover onClick={onRowClick} sx={{ cursor: 'pointer' }}>
      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {code}
        </Typography>
      </TableCell>
      <TableCell align="left">{name} </TableCell>
      <TableCell align="left">{customer} </TableCell>
      <TableCell align="left">{agency} </TableCell>
      <TableCell align="left">{service} </TableCell>
      <TableCell align="left">{type}</TableCell>
    </TableRow>
  );
}
