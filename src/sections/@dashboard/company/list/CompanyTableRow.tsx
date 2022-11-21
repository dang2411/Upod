import { TableCell, TableRow, Typography } from '@mui/material';
import { format } from 'date-fns';

type Props = {
  row: any;
  onRowClick: VoidFunction;
};

export default function CompanyTableRow({ row, onRowClick }: Props) {
  const { code, name, address, phone, createDate } = row;
  return (
    <TableRow hover onClick={onRowClick} sx={{ cursor: 'pointer' }}>
      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {code}
        </Typography>
      </TableCell>
      <TableCell align="left">{name} </TableCell>
      <TableCell align="left">{address} </TableCell>
      <TableCell align="left">{phone} </TableCell>
      <TableCell align="left">{format(new Date(createDate), 'HH:mm dd/MM/yyyy')} </TableCell>
    </TableRow>
  );
}
