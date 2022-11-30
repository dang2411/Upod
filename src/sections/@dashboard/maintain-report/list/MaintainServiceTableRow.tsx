import { Button, TableCell, TableRow, Typography } from '@mui/material';
import { MaintainStatus } from 'src/@types/maintain';
import Iconify from 'src/components/Iconify';

type Props = {
  row: any;
  status: MaintainStatus;
  onRowClick: VoidFunction;
};

export default function MaintainServiceTableRow({ row, status, onRowClick }: Props) {
  const { code, service_name, description, created } = row;

  return (
    <TableRow hover sx={{ cursor: 'pointer' }}>
      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {code}
        </Typography>
      </TableCell>
      <TableCell align="left">{service_name} </TableCell>
      <TableCell align="left">{description} </TableCell>
      <TableCell align="left">
        {created ? (
          <Iconify
            icon="akar-icons:circle-check"
            sx={{ width: 20, height: 20, color: 'success.main' }}
          />
        ) : (
          <Iconify icon="charm:circle-cross" sx={{ width: 20, height: 20, color: 'error.main' }} />
        )}
      </TableCell>
      <TableCell align="left">
        {(status === 'processing' || status === 'closed') && (
          <>
            {created && (
              <Button variant="contained" onClick={onRowClick}>
                View Request
              </Button>
            )}
            {!created && (
              <Button variant="contained" onClick={onRowClick}>
                Create Request
              </Button>
            )}
          </>
        )}
      </TableCell>
    </TableRow>
  );
}
