import { Button, Chip, TableCell, TableRow, Typography } from '@mui/material';
export type MaintainStatus = 'problem' | 'noproblem' | 'processing';

type Props = {
  row: any;
  onRowClick: VoidFunction;
};

export default function MaintainTableRow({ row, onRowClick }: Props) {
  const { code, name, createdDate, agency, customer, maintenance_schedule, technician, status, action } = row;

  const parseStatus = (status: MaintainStatus) => {
    if (status === 'problem') {
      return <Chip label="Problem" />;
    } else if (status === 'noproblem') {
      return <Chip label="NoProblem" color="info" />;
    } else if (status === 'processing') {
      return <Chip label="Processing" color="error" />;
    }
    return <Chip label="Default" />;
  };

  const handleBtnClick = () => {};

  return (
    <TableRow hover onClick={onRowClick} sx={{ cursor: 'pointer' }}>
      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {code}
        </Typography>
      </TableCell>
      <TableCell align="left">{name} </TableCell>
      <TableCell align="left">{createdDate} </TableCell>
      <TableCell align="left">{agency?.agency_name} </TableCell>
      <TableCell align="left">{customer?.cus_name || ''} </TableCell>
      <TableCell align="left">{technician?.tech_name || ''} </TableCell>
      <TableCell align="left">{parseStatus(status)}</TableCell>
      <TableCell align="left">
        {
          <Button variant="contained" onClick={() => handleBtnClick()}>
            Process
          </Button>
        }
      </TableCell>
    </TableRow>
  );
}
