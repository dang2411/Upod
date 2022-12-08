import { IconButton, Chip, TableCell, TableRow, Typography } from '@mui/material';
import { format } from 'date-fns';
import { MaintainStatus } from 'src/@types/maintain';
import Iconify from 'src/components/Iconify';

type Props = {
  row: any;
  onRowClick: VoidFunction;
  is_processed: boolean;
  isCustomer: boolean;
};

export default function MaintainTableRow({ row, onRowClick, is_processed, isCustomer }: Props) {
  const { code, name, createdDate, agency, customer, technician, status } = row;

  const parseStatus = (status: MaintainStatus) => {
    if (status === 'pending') {
      return <Chip label="Pending" color="warning" />;
    } else if (status === 'completed') {
      return <Chip label="Completed" color="success" />;
    } else if (status === 'processing') {
      return <Chip label="Processing" color="info" />;
    }
    return <Chip label="Default" />;
  };

  return (
    <TableRow hover sx={{ cursor: 'pointer' }}>
      <TableCell align="left" onClick={onRowClick}>
        <Typography variant="subtitle2" noWrap>
          {code}
        </Typography>
      </TableCell>
      <TableCell align="left" onClick={onRowClick}>
        {name}{' '}
      </TableCell>
      <TableCell align="left" onClick={onRowClick}>
        {format(new Date(createdDate), 'HH:mm dd/MM/yyyy')}{' '}
      </TableCell>
      <TableCell align="left" onClick={onRowClick}>
        {agency?.agency_name}{' '}
      </TableCell>
      <TableCell align="left" onClick={onRowClick}>
        {customer?.cus_name || ''}{' '}
      </TableCell>
      <TableCell align="left" onClick={onRowClick}>
        {technician?.tech_name || ''}{' '}
      </TableCell>
      <TableCell align="left" onClick={onRowClick}>
        {parseStatus(status)}
      </TableCell>
      <TableCell align="left" onClick={onRowClick}>
        {status === 'processing' && is_processed && !isCustomer && (
          <Iconify
            icon="akar-icons:circle-check"
            sx={{ width: 20, height: 20, color: 'success.main' }}
          />
        )}
        {status === 'processing' && is_processed && isCustomer && (
          <Chip label="Need Approve" color="error" size="small" />
        )}
      </TableCell>
    </TableRow>
  );
}
