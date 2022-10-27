import { TableCell, TableRow, Typography } from '@mui/material';

type Props = {
  row: any;
  onRowClick: VoidFunction;
};

export default function AccountTableRow({ row, onRowClick }: Props) {
  const { code, name, skill, area,  } = row;
  return (
    <TableRow hover onClick={onRowClick} sx={{ cursor: 'pointer' }}>
      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {code}
        </Typography>
      </TableCell>
      <TableCell align="left">{name} </TableCell>
      <TableCell align="left">{skill} </TableCell>
      <TableCell align="left">{area} </TableCell>
    </TableRow>
  );
}
