import { TableCell, TableRow, Typography } from '@mui/material';
import Iconify from 'src/components/Iconify';

type Props = {
  row: any;
  onRowClick: VoidFunction;
};

export default function AccountTableRow({ row, onRowClick }: Props) {
  const { code, role, username, assign } = row;
  return (
    <TableRow hover onClick={onRowClick} sx={{ cursor: 'pointer' }}>
      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {code}
        </Typography>
      </TableCell>
      <TableCell align="left">{role} </TableCell>
      <TableCell align="left">{username} </TableCell>
      <TableCell align="left">
        {!assign ? (
          <Iconify
            icon="akar-icons:circle-check"
            sx={{ width: 20, height: 20, color: 'success.main' }}
          />
        ) : (
          <Iconify icon="charm:circle-cross" sx={{ width: 20, height: 20, color: 'error.main' }} />
        )}
      </TableCell>
    </TableRow>
  );
}
