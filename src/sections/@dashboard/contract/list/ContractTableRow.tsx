import { TableCell, TableRow, Typography } from '@mui/material';
import { format } from 'date-fns';
import Iconify from 'src/components/Iconify';

type Props = {
  row: any;
  onRowClick: VoidFunction;
};

export default function ContractTableRow({ row, onRowClick }: Props) {
  const { code, name, company, createdAt, expiredAt , is_expire} = row;
  return (
    <TableRow hover onClick={onRowClick} sx={{ cursor: 'pointer' }}>
      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {code}
        </Typography>
      </TableCell>
      <TableCell align="left">{name} </TableCell>
      <TableCell align="left">{company} </TableCell>
      <TableCell align="left">{format(new Date(createdAt), 'hh:MM dd/MM/yyyy')} </TableCell>
      <TableCell align="left">{format(new Date(expiredAt), 'hh:mm dd/MM/yyyy')} </TableCell>
      <TableCell align="left">{!is_expire ? (
          <Iconify
            icon="akar-icons:circle-check"
            sx={{ width: 20, height: 20, color: 'success.main' }}
          />
        ) : (
          <Iconify icon="charm:circle-cross" sx={{ width: 20, height: 20, color: 'error.main' }} />
        )} </TableCell>
    </TableRow>
  );
}
