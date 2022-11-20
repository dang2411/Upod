import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Card,
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

import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FormProvider } from 'src/components/hook-form';
import { TableHeadCustom } from 'src/components/table';
import useTable from 'src/hooks/useTable';
import { PATH_DASHBOARD } from 'src/routes/paths';
import * as Yup from 'yup';
import MaintainServiceTableRow from '../list/MaintainServiceTableRow';
import MaintainNewEditAgencyForm from './MaintainNewEditAgencyForm';
import MaintainNewEditCustomerForm from './MaintainNewEditCustomerForm';
import MaintainNewEditDetailForm from './MaintainNewEditDetailForm';
import MaintainNewEditScheduleForm from './MaintainNewEditScheduleForm';
import MaintainNewEditTechnicianForm from './MaintainNewEditTechnicianForm';

const TABLE_HEAD = [
  { id: 'code', label: 'Code', align: 'left' },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'description', label: 'Description', align: 'left' },
  { id: 'created', label: 'Created', align: 'left' },
  { id: 'action', width: 200 },
];

type Props = {
  currentMaintain: any;
  isEdit: boolean;
};

export default function MaintainNewEditForm({ currentMaintain, isEdit }: Props) {
  const maintainSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
  });

  const services = currentMaintain.service;

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

  const handleRowClick = async (value: string, isView: boolean) => {
    if (isView) {
      navigate(PATH_DASHBOARD.admin.request.edit(value));
    } else {
      navigate(PATH_DASHBOARD.admin.request.maintain(value));
    }
  };

  const { handleSubmit } = methods;

  const onSubmit = (data: any) => {
    //
  };

  return (
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
                        <MaintainServiceTableRow
                          key={row.id}
                          row={row}
                          status={currentMaintain.status.toLowerCase()}
                          onRowClick={() =>
                            handleRowClick(
                              row.created ? row.request_id : row.report_service_id,
                              row.created
                            )
                          }
                        />
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
    </FormProvider>
  );
}
