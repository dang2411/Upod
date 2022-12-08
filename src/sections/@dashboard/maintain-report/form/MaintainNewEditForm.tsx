import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  CircularProgress,
  FormControlLabel,
  Grid,
  Stack,
  Switch,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Typography,
} from '@mui/material';
import axios from 'src/utils/axios';
import { useSnackbar } from 'notistack';
import { useCallback, useState } from 'react';

import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FormProvider } from 'src/components/hook-form';
import { TableHeadCustom } from 'src/components/table';
import useAuth from 'src/hooks/useAuth';
import useTable from 'src/hooks/useTable';
import { PATH_DASHBOARD } from 'src/routes/paths';
import * as Yup from 'yup';
import MaintainServiceTableRow from '../list/MaintainServiceTableRow';
import MaintainNewEditAgencyForm from './MaintainNewEditAgencyForm';
import MaintainNewEditCustomerForm from './MaintainNewEditCustomerForm';
import MaintainNewEditDetailForm from './MaintainNewEditDetailForm';
import MaintainNewEditScheduleForm from './MaintainNewEditScheduleForm';
import MaintainNewEditTechnicianForm from './MaintainNewEditTechnicianForm';
import useToggle from 'src/hooks/useToggle';
import MaintainReportServiceDialog from '../dialog/MaintainReportServiceDialog';

const TABLE_HEAD = [
  { id: 'code', label: 'Code', align: 'left' },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'description', label: 'Description', align: 'left' },
  { id: 'is_resolved', label: 'Resolved', align: 'left' },
  { id: 'craeted', width: 200 },
];

type Props = {
  currentMaintain: any;
  isEdit: boolean;
};

export default function MaintainNewEditForm({ currentMaintain, isEdit }: Props) {
  const maintainSchema = Yup.object().shape({});

  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  const [currentService, setCurrentService] = useState<any>(null);

  const services = currentMaintain.service;

  const { enqueueSnackbar } = useSnackbar();

  const isCustomer = user?.account?.roleName === 'Customer';

  const navigate = useNavigate();

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
    is_processed: currentMaintain?.is_processed || false,
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

  const methods = useForm({
    resolver: yupResolver(maintainSchema),
    defaultValues,
  });

  const processMaintain = useCallback(async () => {
    try {
      const response: any = await axios.post(
        '/api/maintenance_reports/process_maintenance_report_by_report_id',
        {},
        { params: { report_id: currentMaintain!.id } }
      );
      if (response.status === 200 || response.status === 201) {
        setIsLoading(false);
        navigate(PATH_DASHBOARD.admin.maintainReport.root);
        enqueueSnackbar('Process report successfully', { variant: 'success' });
      } else {
        setIsLoading(false);
        enqueueSnackbar(response.message, { variant: 'error' });
      }
    } catch (error) {
      setIsLoading(false);
      enqueueSnackbar('Process report failed', { variant: 'error' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleViewClick = async (value: string) => {
    if (!isCustomer) {
      navigate(PATH_DASHBOARD.admin.request.edit(value));
    } else {
      navigate(PATH_DASHBOARD.customer.request.edit(value));
    }
  };
  const handleApprove = useCallback(async () => {
    try {
      setIsLoading(true);
      const response: any = await axios.put(
        '/api/customers/approve_maintenance_report_by_id',
        {},
        { params: { id: currentMaintain!.id } }
      );
      if (response.status === 200 || response.status === 201) {
        setIsLoading(false);
        navigate(PATH_DASHBOARD.customer.maintainReport.root);
        enqueueSnackbar('Approve successfully', { variant: 'success' });
      } else {
        setIsLoading(false);
        enqueueSnackbar(response.message, { variant: 'error' });
      }
    } catch (error) {
      setIsLoading(false);
      enqueueSnackbar('Approve failed', { variant: 'error' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    toggle: openServiceDialog,
    onClose: onServiceDialogClose,
    setToggle: setOpenServiceDialog,
  } = useToggle(false);

  const handleRowClick = (value: any) => {
    setOpenServiceDialog(true);
    setCurrentService(value);
  };

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    processMaintain();
  };

  return (
    <>
      <FormProvider onSubmit={handleSubmit(onSubmit)} methods={methods}>
        <Stack spacing={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <MaintainNewEditDetailForm currentMaintain={currentMaintain} />
            </Grid>
            <Grid item md={5} xs={12}>
              <MaintainNewEditScheduleForm currentMaintain={currentMaintain} />
            </Grid>
            <Grid item md={4} xs={12}>
              <MaintainNewEditCustomerForm currentMaintain={currentMaintain} />
            </Grid>
            <Grid item md={4} xs={12}>
              <MaintainNewEditAgencyForm currentMaintain={currentMaintain} />
            </Grid>
            <Grid item md={4} xs={12}>
              <MaintainNewEditTechnicianForm currentMaintain={currentMaintain} />
            </Grid>
          </Grid>

          {services.length > 0 && (
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Typography variant="h5">Service</Typography>
                <Stack mt={3} spacing={2}>
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
                          <>
                            <MaintainServiceTableRow
                              key={row.id}
                              row={row}
                              status={currentMaintain.status.toLowerCase()}
                              onRowClick={() => {
                                const value = {
                                  code: row?.code,
                                  service_name: row?.service_name,
                                  description: row?.description,
                                  is_resolved: row?.is_resolved,
                                  img: row.img,
                                };
                                handleRowClick(value);
                              }}
                              onViewClick={() => handleViewClick(row.request_id)}
                            />
                          </>
                        ))}
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
                </Stack>
              </Stack>
            </Card>
          )}
        </Stack>
        <Stack mt={3} direction="row" justifyContent="end" textAlign="end" spacing={2}>
          {currentMaintain.status === 'pending' && !isCustomer && (
            <LoadingButton
              loading={isSubmitting}
              onClick={handleSubmit(onSubmit)}
              variant="contained"
              type="submit"
            >
              Process
            </LoadingButton>
          )}
          {currentMaintain.status === 'processing' && isCustomer && defaultValues.is_processed && (
            <LoadingButton onClick={handleApprove} variant="contained">
              Approve
            </LoadingButton>
          )}
        </Stack>
      </FormProvider>
      {isLoading && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {<CircularProgress />}
        </Box>
      )}
      {currentService && (
        <MaintainReportServiceDialog
          open={openServiceDialog}
          onClose={onServiceDialogClose}
          data={currentService}
        />
      )}
    </>
  );
}
