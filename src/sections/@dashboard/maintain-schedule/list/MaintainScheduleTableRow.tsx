import { Chip, TableCell, TableRow, Typography } from '@mui/material';
import { format } from 'date-fns';

type Props = {
  row: any;
  onRowClick: VoidFunction;
};

const parseStatus = (status: any) => {
  if (status.toLowerCase() === 'scheduled') {
    return <Chip label="Scheduled" color="info" />;
  } else if (status.toLowerCase() === 'notified') {
    return <Chip label="Notified" color="warning" />;
  } else if (status.toLowerCase() === 'maintaining') {
    return <Chip label="Maintaining" color="success" />;
  } else if (status.toLowerCase() === 'missed') {
    return <Chip label="Missed" color="secondary" />;
  } else if (status.toLowerCase() === 'completed') {
    return <Chip label="Completed" />;
  }
  return <Chip label="Default" />;
};

export default function MaintainScheduleTableRow({ row, onRowClick }: Props) {
  const { code, name, maintainTime, agency, technician, status } = row;

  return (
    <TableRow hover onClick={onRowClick} sx={{ cursor: 'pointer' }}>
      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {code}
        </Typography>
      </TableCell>
      <TableCell align="left">{name} </TableCell>
      <TableCell align="left">{agency} </TableCell>
      <TableCell align="left">{technician} </TableCell>
      <TableCell align="left">{format(new Date(maintainTime), 'HH:mm dd/MM/yyyy')} </TableCell>
      <TableCell align="left" onClick={onRowClick}>
        {parseStatus(status)}
      </TableCell>
    </TableRow>
  );
}
