import { TableCell, TableRow, Typography } from '@mui/material';
import { format } from 'date-fns';

type Props = {
  row: any;
  onRowClick: VoidFunction;
};

export default function AreaTableRow({ row, onRowClick }: Props) {
  const { code, name, createDate, description } = row;
  return (
    <TableRow hover onClick={onRowClick} sx={{ cursor: 'pointer' }}>
      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {code}
        </Typography>
      </TableCell>
      <TableCell align="left">{name} </TableCell>
      <TableCell align="left">{format(new Date(createDate), 'HH:mm dd/MM/yyyy')} </TableCell>
      <TableCell align="left">{description} </TableCell>
    </TableRow>
  );
}
