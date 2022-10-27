import { TableCell, TableRow, Typography } from '@mui/material';
import { format } from 'date-fns';

type Props = {
  row: any;
  onRowClick: VoidFunction;
};

export default function TicketTableRow({ row, onRowClick }: Props) {
  const { code, createdAt, DeviceName, solution, description  } = row;
  return (
    <TableRow hover onClick={onRowClick} sx={{ cursor: 'pointer' }}>
      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {code}
        </Typography>
      </TableCell>
      <TableCell align="left">{createdAt} </TableCell>
      <TableCell align="left">{DeviceName} </TableCell>
      <TableCell align="left">{solution} </TableCell>
      <TableCell align="left">{description} </TableCell>
    </TableRow>
  );
}
