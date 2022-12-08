import { Button, TableCell, TableRow, Typography } from '@mui/material';
import { MaintainStatus } from 'src/@types/maintain';
import Iconify from 'src/components/Iconify';

type Props = {
  row: any;
  status: MaintainStatus;
  onRowClick: VoidFunction;
  onViewClick: VoidFunction;
};

export default function MaintainServiceTableRow({ row, status, onRowClick, onViewClick }: Props) {
  const { code, service_name, description, created, is_resolved, img } = row;

  return (
    <TableRow hover sx={{ cursor: 'pointer' }}>
      <TableCell align="left" onClick={onRowClick}>
        <Typography variant="subtitle2" noWrap>
          {code}
        </Typography>
      </TableCell>
      <TableCell align="left" onClick={onRowClick}>
        {service_name}{' '}
      </TableCell>
      <TableCell align="left" onClick={onRowClick}>
        {description}{' '}
      </TableCell>
      <TableCell align="left" onClick={onRowClick}>
        {is_resolved ? (
          <Iconify
            icon="akar-icons:circle-check"
            sx={{ width: 20, height: 20, color: 'success.main' }}
          />
        ) : (
          <Iconify icon="charm:circle-cross" sx={{ width: 20, height: 20, color: 'error.main' }} />
        )}
      </TableCell>
      <TableCell align="left">
        <>
          {!is_resolved && created && (
            <Button variant="contained" onClick={onViewClick}>
              View Request
            </Button>
          )}
        </>
      </TableCell>
    </TableRow>
  );
}
