import { IconButton, Chip, TableCell, TableRow, Typography } from '@mui/material';
import { format } from 'date-fns';
import { MaintainStatus } from 'src/@types/maintain';
import Iconify from 'src/components/Iconify';

type Props = {
  row: any;
  onRowClick: VoidFunction;
  onProcessClick: VoidFunction;
};

export default function MaintainTableRow({ row, onRowClick, onProcessClick }: Props) {
  const { code, name, createdDate, agency, customer, technician, status } = row;

  const parseStatus = (status: MaintainStatus) => {
    if (status === 'problem') {
      return <Chip label="Problem" />;
    } else if (status === 'noproblem') {
      return <Chip label="No Problem" />;
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
        {format(new Date(createdDate), 'dd/MM/yyyy')}{' '}
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
      <TableCell align="left">
        {status === 'problem' && (
          <IconButton onClick={(e) => onProcessClick()}>
            <Iconify icon="material-symbols:new-label-rounded" sx={{ color: 'neutral' }} />
          </IconButton>
        )}
      </TableCell>
    </TableRow>
  );
}
