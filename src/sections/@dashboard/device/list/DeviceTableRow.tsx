import { TableCell, TableRow, Typography } from '@mui/material';

type Props = {
  row: any;
  onRowClick: VoidFunction;
};

export default function DeviceTableRow({ row, onRowClick }: Props) {
  const { code, name, agency, service, customer, type, technician } = row;
  return (
    <TableRow hover onClick={onRowClick} sx={{ cursor: 'pointer' }}>
      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {code}
        </Typography>
      </TableCell>
      <TableCell align="left">{name} </TableCell>
      <TableCell align="left">{customer?.name || ''} </TableCell>
      <TableCell align="left">{agency} </TableCell>
      <TableCell align="left">{service?.name || ''} </TableCell>
      <TableCell align="left">{type}</TableCell>
      <TableCell align="left">{technician?.name || ''}</TableCell>
    </TableRow>
  );
}
