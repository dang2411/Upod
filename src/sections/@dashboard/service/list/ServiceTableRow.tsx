import { TableCell, TableRow, Typography } from '@mui/material';
import { format } from 'date-fns';

type Props = {
  row: any;
  onRowClick: VoidFunction;
};

export default function ServiceTableRow({ row, onRowClick }: Props) {
  const { code, name, createdAt, description, isDelete } = row;
  return (
    <TableRow hover onClick={onRowClick} sx={{ cursor: 'pointer' }}>
      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {code}
        </Typography>
      </TableCell>
      <TableCell align="left">{name} </TableCell>
      <TableCell align="left">{description} </TableCell>
      <TableCell align="left">{createdAt} </TableCell>
      <TableCell align="left">{isDelete} </TableCell>
    </TableRow>
  );
}
