import { TableCell, TableRow, Typography } from '@mui/material';
import { format } from 'date-fns';

type Props = {
  row: any;
  onRowClick: VoidFunction;
};

export default function ContractTableRow({ row, onRowClick }: Props) {
  const { code, name, company, createdAt, expiredAt } = row;
  return (
    <TableRow hover onClick={onRowClick} sx={{ cursor: 'pointer' }}>
      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {code}
        </Typography>
      </TableCell>
      <TableCell align="left">{name} </TableCell>
      <TableCell align="left">{company} </TableCell>
      <TableCell align="left">{format(new Date(createdAt), 'dd/MM/yyyy')} </TableCell>
      <TableCell align="left">{format(new Date(expiredAt), 'dd/MM/yyyy')} </TableCell>
    </TableRow>
  );
}
