import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Button,
  Chip,
  Card,
  Stack,
  TextField,
  Typography,
  Grid,
  FormControlLabel,
  Switch,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
} from '@mui/material';

import { format } from 'date-fns';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import { TableHeadCustom } from 'src/components/table';
import useAuth from 'src/hooks/useAuth';
import useTable from 'src/hooks/useTable';
import axios from 'src/utils/axios';
import * as Yup from 'yup';
import MaintainServiceTableRow from "../list/MaintainServiceTableRow";
export type MaintainStatus = 'problem' | 'noproblem' | 'processing';

type Props = {
  currentMaintain: any;
  isEdit: boolean;
};


const parseStatus = (status: MaintainStatus) => {
  if (status.toLowerCase() === 'problem') {
    return <Chip label="Problem" />;
  } else if (status.toLowerCase() === 'noproblem') {
    return <Chip label="NoProblem" color="info" />;
  } else if (status.toLowerCase() === 'processing') {
    return <Chip label="Processing" color="error" />;
  }
  return <Chip label="Default" />;
};

type TitleSectionProps = {
  label: string;
  status: MaintainStatus;
};

const handleRowClick = async (value: string) => {};

function TitleSection({ label, status }: TitleSectionProps) {
  return (
    <Stack direction="row" spacing={2}>
      <Typography variant="subtitle1">{label}</Typography>
      {parseStatus(status)}
    </Stack>
  );
}

export default function MaintainNewEditForm({ currentMaintain, isEdit }: Props) {
  const maintainSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
  });

  const services = currentMaintain.service;

  const { user } = useAuth();

  const isCustomer = user?.account?.roleName === 'Customer';

  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = {
    code: currentMaintain?.code || '',
    name: currentMaintain?.name || '',
    createdDate: currentMaintain?.create_date || '',
    updatedDate: currentMaintain?.update_date || '',
    status: currentMaintain?.status || '',
    description: currentMaintain?.description || '',
    customer: currentMaintain?.customer || null,
    create_by: currentMaintain?.create_by || null,
    agency: currentMaintain?.agency || null,
    maintenance_schedule: currentMaintain?.maintenance_schedule || null,
    service: currentMaintain?.service || [],
  };

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    //
    selected,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const TABLE_HEAD = [
    { id: 'code', label: 'Code', align: 'left' },
    { id: 'name', label: 'Name', align: 'left' },
    { id: 'description', label: 'Description', align: 'left' },
    { id: 'created', label: 'Created', align: 'left' },
    { id: 'request', label: 'Request', align: 'left' },
  ];

  const methods = useForm({
    resolver: yupResolver(maintainSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    getValues,
    watch,
    control,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = (data: any) => {
    //
  };
  const disable = !isEdit && currentMaintain != null;

  const onDeleteClick = () => {
    // deleteAccount();
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const disabled = true;
  return (
    <FormProvider onSubmit={handleSubmit(onSubmit)} methods={methods}>
      <Stack spacing={3}>
        <TitleSection label={getValues('name')} status={watch('status')} />
        <Card sx={{ p: 3 }}>
          <Stack spacing={2}>
            <RHFTextField
              name="code"
              label="Code"
              variant="outlined"
              fullWidth
              disabled={disabled}
            />
            <TextField
              label="Created Date"
              variant="outlined"
              value={format(new Date(currentMaintain?.create_date), 'dd/MM/yyyy')}
              fullWidth
              disabled={true}
            />
            <TextField
              label="Update Date"
              variant="outlined"
              value={format(new Date(currentMaintain?.update_date), 'dd/MM/yyyy')}
              fullWidth
              disabled={true}
            />
            <RHFTextField
              name="description"
              label="Description"
              variant="outlined"
              fullWidth
              disabled={disabled}
            />
          </Stack>
        </Card>
        <Grid container rowSpacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Typography variant="h5">Customer</Typography>
                <TextField
                  label="Name"
                  value={currentMaintain?.customer?.cus_name}
                  variant="outlined"
                  fullWidth
                  disabled={disabled}
                />
                <TextField
                  label="Address"
                  value={currentMaintain?.customer?.address}
                  variant="outlined"
                  fullWidth
                  disabled={disabled}
                />
                <TextField
                  label="Mail"
                  value={currentMaintain?.customer?.mail}
                  variant="outlined"
                  fullWidth
                  disabled={disabled}
                />
                <TextField
                  label="Phone"
                  value={currentMaintain?.customer?.phone}
                  variant="outlined"
                  fullWidth
                  disabled={disabled}
                />
              </Stack>
            </Card>
          </Grid>
          <Grid item md={6} xs={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Typography variant="h5">Agency</Typography>
                <RHFTextField
                  name="agency"
                  label="Code"
                  value={currentMaintain?.agency?.code}
                  variant="outlined"
                  fullWidth
                  disabled={disabled}
                />
                <RHFTextField
                  name="agency"
                  label="Name"
                  value={currentMaintain?.agency?.agency_name}
                  variant="outlined"
                  fullWidth
                  disabled={disabled}
                />
                <RHFTextField
                  name="agency"
                  label="Phone"
                  value={currentMaintain?.agency?.phone}
                  variant="outlined"
                  fullWidth
                  disabled={disabled}
                />
                <RHFTextField
                  name="agency"
                  label="Address"
                  value={currentMaintain?.agency?.address}
                  variant="outlined"
                  fullWidth
                  disabled={disabled}
                />
              </Stack>
            </Card>
          </Grid>
          <Grid item md={6} xs={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Typography variant="h5">Technician</Typography>
                <RHFTextField
                  name="create_by"
                  label="Code"
                  value={currentMaintain?.create_by?.code}
                  variant="outlined"
                  fullWidth
                  disabled={disabled}
                />
                <RHFTextField
                  name="create_by"
                  label="Name"
                  value={currentMaintain?.create_by?.tech_name}
                  variant="outlined"
                  fullWidth
                  disabled={disabled}
                />
                <RHFTextField
                  name="create_by"
                  label="Email"
                  value={currentMaintain?.create_by?.email}
                  variant="outlined"
                  fullWidth
                  disabled={disabled}
                />
                <RHFTextField
                  name="create_by"
                  label="Phone"
                  value={currentMaintain?.create_by?.phone}
                  variant="outlined"
                  fullWidth
                  disabled={disabled}
                />
              </Stack>
            </Card>
          </Grid>
          <Grid item md={6} xs={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Typography variant="h5">Maintenance Schedule</Typography>
                <RHFTextField
                  name="maintenance_schedule"
                  label="Code"
                  value={currentMaintain?.maintenance_schedule?.code}
                  variant="outlined"
                  fullWidth
                  disabled={disabled}
                />
                <RHFTextField
                  name="maintenance_schedule"
                  label="Name"
                  value={currentMaintain?.maintenance_schedule?.sche_name}
                  variant="outlined"
                  fullWidth
                  disabled={disabled}
                />
                <RHFTextField
                  name="maintenance_schedule"
                  label="Description"
                  value={currentMaintain?.maintenance_schedule?.description}
                  variant="outlined"
                  fullWidth
                  disabled={disabled}
                />
                <RHFTextField
                  name="maintenance_schedule"
                  label="Maintain Time"
                  value={format(new Date(currentMaintain?.maintenance_schedule?.maintain_time), 'dd/MM/yyyy HH:mm')}
                  variant="outlined"
                  fullWidth
                  disabled={disabled}
                />
              </Stack>
            </Card>
          </Grid>
        </Grid>

        <Card sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Typography variant="h5">Service</Typography>
            {services.length > 0 && (
              <Stack mt={3} spacing={2}>
                <Card>
                  <TableContainer>
                    <Table size={dense ? 'small' : 'medium'}>
                      <TableHeadCustom
                        order={order}
                        orderBy={orderBy}
                        headLabel={TABLE_HEAD}
                        rowCount={services.length}
                        numSelected={selected.length}
                        
                      />

                      <TableBody>
                        {services.map((row: any) => (
                          <MaintainServiceTableRow
                            key={row.id}
                            row={row}
                            onRowClick={() => handleRowClick(row.id)}
                          />
                        ))}
                        {/* 
                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(page, rowsPerPage, data.length)}
                /> */}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Box sx={{ position: 'relative' }}>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      component="div"
                      count={services.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={onChangePage}
                      onRowsPerPageChange={onChangeRowsPerPage}
                    />

                    <FormControlLabel
                      control={<Switch checked={dense} onChange={onChangeDense} />}
                      label="Dense"
                      sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
                    />
                  </Box>
                </Card>
              </Stack>
            )}
          </Stack>
        </Card>
      </Stack>
    </FormProvider>
  );
}
