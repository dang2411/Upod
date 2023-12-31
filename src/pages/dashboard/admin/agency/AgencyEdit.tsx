import {
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Stack,
  styled,
  Switch,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Page from 'src/components/Page';
import { TableHeadCustom } from 'src/components/table';
import useSettings from 'src/hooks/useSettings';
import useTable from 'src/hooks/useTable';
import { PATH_DASHBOARD } from 'src/routes/paths';
import AgencyNewEditForm from 'src/sections/@dashboard/agency/form/AgencyNewEditForm';
import DeviceNewEditForm from 'src/sections/@dashboard/device/form/DeviceNewEditForm';
import DeviceTableRow from 'src/sections/@dashboard/device/list/DeviceTableRow';
import { CloseIcon } from 'src/theme/overrides/CustomIcons';
import axiosInstance from 'src/utils/axios';

export default function AgencyDetail() {
  const { themeStretch } = useSettings();
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
    { id: 'customer', label: 'Customer', align: 'left' },
    { id: 'agency', label: 'Agency', align: 'left' },
    { id: 'type', label: 'Type', align: 'left' },
    { id: 'createdBy', label: 'Created By', align: 'left' },
  ];

  const [devices, setDevices] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const [device, setDevice] = useState<any>({});

  const [total, setTotal] = useState(0);

  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));

  const { id = '' } = useParams();

  const navigate = useNavigate();

  const [data, setData] = useState<any>(null);

  const fetch = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/api/agencies/get_agency_details`, {
        params: { id },
      });
      const result = {
        id: response.data.id,
        name: response.data.agency_name,
        code: response.data.code,
        customer: {
          id: response.data.customer.id,
          name: response.data.customer.cus_name,
        },
        area: {
          id: response.data.area.id,
          name: response.data.area.area_name,
        },
        technician: response.data.technician,
        address: response.data.address,
        telephone: response.data.telephone,
        createDate: response.data.create_date,
        manager: response.data.manager_name,
      };
      if (response.status === 200) {
        setData(result);
      } else {
        navigate(PATH_DASHBOARD.admin.agency.root);
      }
    } catch (e) {
      console.error(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDevice = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/api/devices/get_device_details_by_id`, {
        params: { id },
      });
      const result = {
        code: response.data.code || '',
        name: response.data.device_name || '',
        type: {
          id: response.data.devicetype.id,
          name: response.data.devicetype.device_type_name,
        },
        agency: {
          id: response.data.agency.id,
          name: response.data.agency.agency_name,
        },
        customer: {
          id: response.data.customer.id,
          name: response.data.customer.cus_name,
        },
        service: {
          id: response.data.service.id,
          name: response.data.service.service_name,
        },
        technician: {
          id: response.data.technician.id,
          name: response.data.technician.tech_name,
        },
        ip: response.data.ip || '',
        port: response.data.port || '',
        deviceAccount: response.data.device_account || '',
        devicePassword: response.data.device_password || '',
        settingDate: response.data.setting_date || '',
      };
      if (response.status === 200) {
        setDevice(result);
        setIsLoading(false);
      }
    } catch (e) {
      setIsLoading(false);
      console.error(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchListDevice = useCallback(async () => {
    try {
      setIsLoading(true);
      const response: any = await axiosInstance.get('api/devices/get_list_devices_by_agency_id', {
        params: { id, pageNumber: page + 1, pageSize: rowsPerPage },
      });

      setTotal(response.total);

      const result = Array.from(response.data).map((x: any) => ({
        id: x.id,
        customer: x.customer,
        service: x.service,
        code: x.code,
        name: x.device_name,
        agency: x.agency,
        type: x.devicetype.device_type_name,
        technician: x.technician,
      }));
      setDevices(result);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Cannot fetch data', { variant: 'error' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetch(id);
    fetchListDevice();
    console.log(devices);
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, rowsPerPage, page]);

  const title = data?.name || 'Agency';

  if (!data) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {<CircularProgress />}
      </Box>
    );
  }
  const handleRowClick = async (value: string) => {
    await fetchDevice(value);
    handleClickOpen();
  };
  interface DialogTitleProps {
    id: string;
    children?: React.ReactNode;
    onClose: () => void;
  }

  function BootstrapDialogTitle(props: DialogTitleProps) {
    const { children, onClose, ...other } = props;

    return (
      <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
        {children}
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
    );
  }
  return (
    <>
      <Page title="Agency: Detail">
        <Container maxWidth={themeStretch ? false : 'xl'}>
          <HeaderBreadcrumbs
            heading={title}
            links={[
              {
                name: 'Dashboard',
                href: PATH_DASHBOARD.root,
              },
              {
                name: 'Agency',
                href: PATH_DASHBOARD.admin.agency.root,
              },
              { name: title },
            ]}
          />
          <AgencyNewEditForm isEdit={true} currentAgency={data} />

          {devices.length > 0 && (
            <Stack mt={3} spacing={2}>
              <Typography variant="h5">Devices</Typography>
              <Card>
                <TableContainer>
                  <Table size={dense ? 'small' : 'medium'}>
                    <TableHeadCustom
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={data.length}
                      numSelected={selected.length}
                    />

                    <TableBody>
                      {devices.map((row: any) => (
                        <DeviceTableRow
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
                    count={total}
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
        </Container>
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
      </Page>

      <BootstrapDialog onClose={handleClose} open={open}>
        <BootstrapDialogTitle onClose={handleClose} id="dialog">
          {device.code}
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <DeviceNewEditForm isEdit={false} currentDevice={device} />
        </DialogContent>
      </BootstrapDialog>
    </>
  );
}
