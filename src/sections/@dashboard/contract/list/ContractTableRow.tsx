/* eslint-disable react-hooks/rules-of-hooks */
import { LoadingButton } from '@mui/lab';
import { Chip, TableCell, TableRow, Typography } from '@mui/material';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import Iconify from 'src/components/Iconify';
import useToggle from 'src/hooks/useToggle';

type Props = {
  row: any;
  onRowClick: VoidFunction;
  isCustomer: boolean;
};

export default function ContractTableRow({ isCustomer, row, onRowClick }: Props) {
  const { code, name, company, createdAt, expiredAt, is_expire, is_accepted } = row;
  return (
    <TableRow hover onClick={onRowClick} sx={{ cursor: 'pointer' }}>
      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {code}
        </Typography>
      </TableCell>
      <TableCell align="left">{name} </TableCell>
      <TableCell align="left">{company} </TableCell>
      <TableCell align="left">{format(new Date(createdAt), 'HH:mm dd/MM/yyyy')} </TableCell>
      <TableCell align="left">{format(new Date(expiredAt), 'HH:mm dd/MM/yyyy')} </TableCell>
      <TableCell align="left">
        {!is_expire && is_accepted ? (
          <Iconify
            icon="akar-icons:circle-check"
            sx={{ width: 20, height: 20, color: 'success.main' }}
          />
        ) : (
          <Iconify icon="charm:circle-cross" sx={{ width: 20, height: 20, color: 'error.main' }} />
        )}{' '}
      </TableCell>
      {isCustomer && !is_expire && !is_accepted && (
        <>
          <TableCell align="left">
            <Chip label="Need approve" size="medium" color="error" />
          </TableCell>
        </>
      )}
      {!isCustomer && !is_expire && !is_accepted && (
        <>
          <TableCell align="left">
            <Chip label="Pending approval" size="medium" color="warning" />
          </TableCell>
        </>
      )}
    </TableRow>
  );
}
