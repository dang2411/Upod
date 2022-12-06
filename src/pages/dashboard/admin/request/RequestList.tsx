import { LoadingButton } from '@mui/lab';
import {
  Box,
  Typography,
  Card,
  Container,
  FormControlLabel,
  Switch,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Grid,
  CircularProgress,
  Button,
} from '@mui/material';
import { debounce } from 'lodash';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Priority, Request } from 'src/@types/request';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Page from 'src/components/Page';
import { TableHeadCustom, TableNoData } from 'src/components/table';
import useSettings from 'src/hooks/useSettings';
import useTable from 'src/hooks/useTable';
import useTabs from 'src/hooks/useTabs';
import { PATH_DASHBOARD } from 'src/routes/paths';
import RequestTableRow from 'src/sections/@dashboard/request/list/RequestTableRow';
import RequestTableToolbar from 'src/sections/@dashboard/request/list/RequestTableToolbar';
import axios from 'src/utils/axios';

const STATUS_OPTIONS = [
  'all',
  'pending',
  'preparing',
  'resolving',
  'resolved',
  'waring',
  'rejected',
  'canceled',
];

const TABLE_HEAD = [
  { id: 'code', label: 'Code', align: 'left' },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'agency', label: 'Agency', align: 'left' },
  { id: 'service', label: 'Service', align: 'left' },
  { id: 'created', label: 'Created By', align: 'left' },
  { id: 'customer', label: 'Customer', align: 'left' },
  { id: 'createdAt', label: 'Created At', align: 'left' },
  { id: 'description', label: 'Description', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
];

function parsePriority(value: number): Priority {
  if (value <= 1) {
    return 'Low';
  } else if (value === 2) {
    return 'Medium';
  }
  return 'High';
}

export default function RequestList() {
  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const [filterText, setFilterText] = useState('');

  const {
    currentTab: filterStatus,
    // onChangeTab: onChangeFilterStatus,
    setCurrentTab: setFilterStatus,
  } = useTabs('all');

  const handleFilterTextChange = (value: string) => {
    setFilterText(value);
  };

  const handleRowClick = (value: string) => {
    navigate(PATH_DASHBOARD.admin.request.edit(value));
  };

  const handleBtnClick = () => {
    navigate(PATH_DASHBOARD.admin.request.new);
  };

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    //
    selected,
    setPage,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const [data, setData] = useState<Request[]>([]);

  const [total, setTotal] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const isNotFound = !data.length;

  const fetch = useCallback(
    async ({ value, page, rowsPerPage, filterStatus }: any) => {
      try {
        const response: any = await axios.get('/api/requests/get_list_requests', {
          params: {
            pageNumber: page + 1,
            pageSize: rowsPerPage,
            search: value === '' ? undefined : value,
            status: filterStatus === 'all' ? undefined : filterStatus,
          },
        });

        setTotal(response.total);

        const result = Array.from(response.data).map(
          (x: any) =>
            ({
              id: x.id,
              code: x.code,
              createdAt: new Date(x.create_date),
              name: x.request_name,
              service: { id: x.service.id, name: x.service.service_name },
              agency: { id: x.agency.id, name: x.agency.agency_name },
              priority: parsePriority(x.priority),
              description: x.description,
              customer: { id: x.customer.id, name: x.customer.cus_name },
              contract: { id: x.contract.id, name: x.contract.name },
              createdBySystem: x.is_system,
              createdByAdmin: x.admin_id != null,
              status: x.request_status.toLowerCase(),
              technician: x.technician,
            } as Request)
        );
        setData(result);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error(error);
        enqueueSnackbar('Cannot fetch data', { variant: 'error' });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterStatus, page, rowsPerPage]
  );

  // const handleChangeFilterStatus = (event: React.SyntheticEvent<Element, Event>, newValue: any) => {
  //   setPage(0);
  //   onChangeFilterStatus(event, newValue);
  // };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSearch = useCallback(
    debounce(
      ({ value, page, rowsPerPage, filterStatus }: any) =>
        fetch({ value, page, rowsPerPage, filterStatus }),
      1000
    ),
    []
  );

  useEffect(() => {
    setIsLoading(true);
    debounceSearch({ value: filterText, page, rowsPerPage, filterStatus });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, filterStatus, filterText]);

  return (
    <Page title="Request: Listing">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Request: Listing"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Request',
              href: PATH_DASHBOARD.admin.request.root,
            },
            { name: 'Listing' },
          ]}
          action={
            <Button variant="contained" onClick={() => handleBtnClick()}>
              Create
            </Button>
          }
        />

        <Card>
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
          {/* <Tabs
            allowScrollButtonsMobile
            variant="scrollable"
            scrollButtons="auto"
            value={filterStatus}
            onChange={handleChangeFilterStatus}
            sx={{ px: 2, bgcolor: 'background.neutral' }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab disableRipple key={tab} label={tab} value={tab} />
            ))}
          </Tabs> */}

          <RequestTableToolbar
            filterText={filterText}
            onFilterText={handleFilterTextChange}
            filterStatus={filterStatus}
            onChangeFilterStatus={(value) => {
              setPage(0);
              setFilterStatus(value);
            }}
          />

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
                {data.map((row: Request) => (
                  <RequestTableRow
                    key={row.id}
                    row={row}
                    onRowClick={() => handleRowClick(row.id)}
                  />
                ))}
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
      </Container>
    </Page>
  );
}
