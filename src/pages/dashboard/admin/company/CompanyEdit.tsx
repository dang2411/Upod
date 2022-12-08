import {
  Box,
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
import { useNavigate, useParams } from 'react-router-dom';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Page from 'src/components/Page';
import useSettings from 'src/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/routes/paths';
import CompanyNewEditForm from 'src/sections/@dashboard/company/form/CompanyNewEditForm';
import { useCallback, useEffect, useState } from 'react';
import axios from 'src/utils/axios';
import { orderBy } from 'lodash';
import { TableHeadCustom } from 'src/components/table';
import AgencyNewEditForm from 'src/sections/@dashboard/agency/form/AgencyNewEditForm';
import ServiceNewEditForm from 'src/sections/@dashboard/service/form/ServiceNewEditForm';
import useTable from 'src/hooks/useTable';
import axiosInstance from 'src/utils/axios';
import { CloseIcon } from 'src/theme/overrides/CustomIcons';
import AgencyTableRow from 'src/sections/@dashboard/agency/list/AgencyTableRow';
import ServiceTableRow from 'src/sections/@dashboard/service/list/ServiceTableRow';

export default function CompanyEdit() {
  const { themeStretch } = useSettings();

  const { id = '' } = useParams();
  const [totalAgencies, setTotalAgencies] = useState(0);
  const [totalServices, setTotalServices] = useState(0);
  const [agencies, setAgencies] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [data, setData] = useState<any>(null);
  const [agency, setAgency] = useState<any>({});
  const [service, setService] = useState<any>({});
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
  const TABLE_HEAD_AGENCIES = [
    { id: 'code', label: 'Code', align: 'left' },
    { id: 'name', label: 'Name', align: 'left' },
    { id: 'customer', label: 'Customer', align: 'left' },
    { id: 'address', label: 'Address', align: 'left' },
    { id: 'phone', label: 'Phone', align: 'left' },
  ];
  const TABLE_HEAD_SERVICES = [
    { id: 'code', label: 'Code', align: 'left' },
    { id: 'name', label: 'Name', align: 'left' },
    { id: 'createDate', label: 'Create Date', align: 'left' },
    { id: 'description', label: 'Description', align: 'left' },
  ];
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [open, setOpen] = useState(false);

  const [agencyClick, setAgencyClick] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
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
  const fetchAgency = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/api/agencies/get_agency_details`, {
        params: { id },
      });
      const result = {
        id: response.data.id,
        code: response.data.code,
        name: response.data.agency_name,
        customer: {
          id: response.data.customer.id,
          name: response.data.customer.cus_name,
        },
        area: {
          id: response.data.area.id,
          name: response.data.area.area_name,
        },
        technician: {
          id: response.data.technician.id,
          name: response.data.technician.tech_name,
        },
        address: response.data.address,
        telephone: response.data.telephone,
        createDate: response.data.create_date,
        manager: response.data.manager_name,
      };
      if (response.status === 200) {
        setAgency(result);
      } else {
        navigate(PATH_DASHBOARD.admin.agency.root);
      }
    } catch (e) {
      console.error(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchService = useCallback(async (id: string) => {
    try {
      const response = await axiosInstance.get(`/api/services/get_service_details`, {
        params: { id },
      });
      const result = {
        id: response.data.id,
        code: response.data.code,
        name: response.data.service_name,
        createDate: response.data.create_date,
        description: response.data.description,
      };
      if (response.status === 200) {
        setService(result);
      } else {
        navigate(PATH_DASHBOARD.admin.agency.root);
      }
    } catch (e) {
      console.error(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRowClickAgencies = async (value: string) => {
    await fetchAgency(value);
    setAgencyClick(true);
    handleClickOpen();
  };

  const handleRowClickServices = async (value: string) => {
    await fetchService(value);
    setAgencyClick(false);
    handleClickOpen();
  };

  const fetch = useCallback(async (id: string) => {
    try {
      const response = await axios.get(`/api/customers/get_customer_details_by_id`, {
        params: { id },
      });
      const result = {
        id: response.data[0].id,
        code: response.data[0].code,
        name: response.data[0].name,
        account: {
          id: response.data[0].account.id,
          name: response.data[0].account.username,
        },
        email: response.data[0].mail,
        address: response.data[0].address,
        phone: response.data[0].phone,
        description: response.data[0].description,
      };
      if (response.status === 200) {
        setData(result);
        fetchListAgency(id, response.data[0].name);
        fetchListService(id);
        console.log(services);
      } else {
        navigate(PATH_DASHBOARD.admin.company.root);
      }
    } catch (e) {
      console.error(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchListAgency = useCallback(
    async (id: string, name: string) => {
      try {
        const response: any = await axiosInstance.get('api/customers/get_agencies_by_customer_id', {
          params: { id: id },
        });

        setTotalAgencies(response.total);

        const result = Array.from(response.data).map((x: any) => ({
          id: x.id,
          code: x.code,
          name: x.agency_name,
          customer: name,
          address: x.address,
          phone: x.phone,
        }));
        setAgencies(result);
      } catch (error) {
        console.error(error);
        enqueueSnackbar('Cannot fetch data', { variant: 'error' });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [page, rowsPerPage]
  );

  const fetchListService = useCallback(
    async (id: string) => {
      try {
        const response: any = await axiosInstance.get(
          '/api/customers/get_services_by_customer_id',
          {
            params: { id: id },
          }
        );

        setTotalAgencies(response.total);

        const result = Array.from(response.data).map((x: any) => ({
          id: x.id,
          code: x.code,
          name: x.service_name,
          description: x.description,
          createDate: x.create_date,
          isDelete: x.is_delete,
        }));
        setServices(result);
      } catch (error) {
        console.error(error);
        enqueueSnackbar('Cannot fetch data', { variant: 'error' });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [page, rowsPerPage]
  );

  useEffect(() => {
    fetch(id);
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const title = data?.name || 'Customer';

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
  return (
    <>
      <Page title="Customer: Edit">
        <Container maxWidth={themeStretch ? false : 'xl'}>
          <HeaderBreadcrumbs
            heading={title}
            links={[
              {
                name: 'Dashboard',
                href: PATH_DASHBOARD.root,
              },
              {
                name: 'Customer',
                href: PATH_DASHBOARD.admin.company.root,
              },
              { name: title },
            ]}
          />

          <CompanyNewEditForm isEdit={true} currentCompany={data} />

          {agencies.length > 0 && (
            <Stack mt={3} spacing={2}>
              <Typography variant="h5">Agencies</Typography>

              <Card>
                <TableContainer>
                  <Table size={dense ? 'small' : 'medium'}>
                    <TableHeadCustom
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD_AGENCIES}
                      rowCount={agencies.length}
                      numSelected={selected.length}
                    />

                    <TableBody>
                      {agencies.map((row: any) => (
                        <AgencyTableRow
                          key={row.id}
                          row={row}
                          onRowClick={() => handleRowClickAgencies(row.id)}
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
              </Card>
            </Stack>
          )}
          {services.length > 0 && (
            <Stack mt={3} spacing={2}>
              <Typography variant="h5">Services</Typography>

              <Card>
                <TableContainer>
                  <Table size={dense ? 'small' : 'medium'}>
                    <TableHeadCustom
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD_SERVICES}
                      rowCount={data.length}
                      numSelected={selected.length}
                    />

                    <TableBody>
                      {services.map((row: any) => (
                        <ServiceTableRow
                          key={row.id}
                          row={row}
                          onRowClick={() => handleRowClickServices(row.id)}
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
              </Card>
            </Stack>
          )}
        </Container>
      </Page>
      <BootstrapDialog onClose={handleClose} open={open}>
        <BootstrapDialogTitle onClose={handleClose} id="dialog">
          {agencyClick && <Typography variant="subtitle1">Agency details</Typography>}
          {!agencyClick && <Typography variant="subtitle1">Service details</Typography>}
        </BootstrapDialogTitle>
        <DialogContent dividers>
          {agencyClick && <AgencyNewEditForm isEdit={false} currentAgency={agency} />}
          {!agencyClick && <ServiceNewEditForm isEdit={false} currentService={service} />}
        </DialogContent>
      </BootstrapDialog>
    </>
  );
}
function enqueueSnackbar(arg0: string, arg1: { variant: string }) {
  throw new Error('Function not implemented.');
}
