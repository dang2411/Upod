import {
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  debounce,
  FormControlLabel,
  Switch,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Page from 'src/components/Page';
import { TableHeadCustom, TableNoData } from 'src/components/table';
import useAuth from 'src/hooks/useAuth';
import useSettings from 'src/hooks/useSettings';
import useTable from 'src/hooks/useTable';
import { PATH_DASHBOARD } from 'src/routes/paths';
import AgencyTableRow from 'src/sections/@dashboard/agency/list/AgencyTableRow';
import AgencyTableToolbar from 'src/sections/@dashboard/agency/list/AgencyTableToolbar';
import axiosInstance from 'src/utils/axios';

const TABLE_HEAD = [
  { id: 'code', label: 'Code', align: 'left' },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'company', label: 'Manager', align: 'left' },
  { id: 'address', label: 'Address', align: 'left' },
  { id: 'phone', label: 'Phone', align: 'left' },
];

export default function AgencyList() {
  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [filterText, setFilterText] = useState('');

  const handleBtnClick = () => {
    navigate(PATH_DASHBOARD.admin.contract.new);
  };

  const handleFilterTextChange = (value: string) => {
    setFilterText(value);
  };

  const handleRowClick = (value: string) => {
    navigate(PATH_DASHBOARD.customer.agency.view(value));
  };

  const [data, setData] = useState<any[]>([]);

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

  const { user } = useAuth();

  const fetch = useCallback(
    async ({ value, page, rowsPerPage }: any) => {
      try {
        const id = user?.account.id;
        const response: any = await axiosInstance.get('api/customers/get_agencies_by_customer_id', {
          params: {
            id: id,
            pageNumber: page + 1,
            pageSize: rowsPerPage,
            search: value === '' ? undefined : value,
          },
        });

        console.log(response);

        setTotal(response.total);

        const result = Array.from(response.data).map((x: any) => ({
          id: x.id,
          code: x.code,
          name: x.agency_name,
          customer: x.manager_name,
          address: x.address,
          phone: x.phone,
        }));
        setData(result);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error(error);
        enqueueSnackbar('Cannot fetch data', { variant: 'error' });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [filterText, page, rowsPerPage]
  );
  const debounceSearch = useCallback(
    debounce(({ value, page, rowsPerPage }: any) => fetch({ value, page, rowsPerPage }), 1000),
    []
  );
  useEffect(() => {
    setIsLoading(true);
    debounceSearch({ value: filterText, page, rowsPerPage });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, filterText]);

  const [total, setTotal] = useState(0);

  const { enqueueSnackbar } = useSnackbar();

  const isNotFound = !data.length;

  return (
    <Page title="Agency: Listing">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Agency: Listing"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Agency',
              href: PATH_DASHBOARD.customer.agency.root,
            },
            { name: 'Listing' },
          ]}
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
          <AgencyTableToolbar filterText={filterText} onFilterText={handleFilterTextChange} />
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
                {data.map((row: any) => (
                  <AgencyTableRow
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
      </Container>
    </Page>
  );
}
