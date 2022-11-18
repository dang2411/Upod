import { Button, Chip, TableCell, TableRow, Typography } from '@mui/material';
import Iconify from 'src/components/Iconify';
export type MaintainStatus = 'problem' | 'noproblem' | 'processing';

type Props = {
  row: any;
  onRowClick: VoidFunction;
};

export default function MaintainServiceTableRow({ row, onRowClick }: Props) {
  const { code, name, description, created, request_id} = row;

  const handleBtnClick = () => {};

  return (
    <TableRow hover onClick={onRowClick} sx={{ cursor: 'pointer' }}>
      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {code}
        </Typography>
      </TableCell>
      <TableCell align="left">{code} </TableCell>
      <TableCell align="left">{name} </TableCell>
      <TableCell align="left">{description} </TableCell>
      <TableCell align="left">{created ? (
          <Iconify
            icon="akar-icons:circle-check"
            sx={{ width: 20, height: 20, color: 'success.main' }}
          />
        ) : (
          <Iconify icon="charm:circle-cross" sx={{ width: 20, height: 20, color: 'error.main' }} />
        )} </TableCell>
      <TableCell align="left">
      {created ? (
          <Chip label={request_id} />
        ) : (
          <Button variant="contained" onClick={() => handleBtnClick()}>
            Create Request
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}
