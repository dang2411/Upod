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
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Page from 'src/components/Page';
import useSettings from 'src/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import useTable from 'src/hooks/useTable';
import { useSnackbar } from 'notistack';
import { TableHeadCustom, TableNoData } from 'src/components/table';
import ContractTableRow from 'src/sections/@dashboard/contract/list/ContractTableRow';
import ContractTableToolbar from 'src/sections/@dashboard/contract/list/ContractTableToolbar';
import axiosInstance from 'src/utils/axios';
import useAuth from 'src/hooks/useAuth';
import axios from 'axios';

const TABLE_HEAD = [
  { id: 'code', label: 'Code', align: 'left' },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'company', label: 'Customer', align: 'left' },
  { id: 'createdAt', label: 'Created At', align: 'left' },
  { id: 'expiredAt', label: 'Expired At', align: 'left' },
  { id: 'is_expire', label: 'Available', align: 'left' },
  { id: 'action', lable: '', align: 'left' },
];

export default function ContractList() {
  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const [filterText, setFilterText] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const handleBtnClick = () => {
    navigate(PATH_DASHBOARD.admin.contract.new);
  };

  const handleFilterTextChange = (value: string) => {
    setFilterText(value);
  };

  const handleRowClick = (value: string) => {
    navigate(PATH_DASHBOARD.customer.contract.view(value));
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

  const approveContract = useCallback(async (value) => {
    try {
      const response: any = await axios.put(
        '/api/customers/approve_contract_by_id',
        {},
        {
          params: { cus_id: user?.account?.id, con_id: value },
        }
      );
      if (response.status === 200 || response.status === 201) {
        setIsLoading(false);
        enqueueSnackbar('Approve successfully', { variant: 'success' });
      } else {
        setIsLoading(false);
        enqueueSnackbar(response.message || 'Approve failed', { variant: 'error' });
      }
    } catch (error) {
      setIsLoading(false);
      enqueueSnackbar('Approve failed', { variant: 'error' });
      console.error(error);
    }
  }, []);

  const fetch = useCallback(
    async ({ value, page, rowsPerPage, filterStatus }: any) => {
      try {
        const id = user?.account.id;
        const response: any = await axiosInstance.get(
          '/api/customers/get_contracts_by_customer_id',
          {
            params: {
              id: id,
              pageNumber: page + 1,
              pageSize: rowsPerPage,
              search: value === '' ? undefined : value,
            },
          }
        );

        setTotal(response.total);

        const result = Array.from(response.data).map((x: any) => ({
          id: x.id,
          code: x.code,
          name: x.contract_name,
          company: x.customer.cus_name,
          is_expire: x.is_expire,
          is_accepted: x.is_accepted,
          createdAt: x.start_date,
          expiredAt: x.end_date,
        }));
        setData(result);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
        enqueueSnackbar('Cannot fetch data', { variant: 'error' });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [filterText, page, rowsPerPage]
  );
  const debounceSearch = useCallback(
    debounce(
      ({ value, page, rowsPerPage, filterStatus }: any) => fetch({ value, page, rowsPerPage }),
      1000
    ),
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
    <Page title="Contract: Listing">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Contract: Listing"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Contract',
              href: PATH_DASHBOARD.customer.contract.list,
            },
            { name: 'Listing' },
          ]}
        />
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
        <Card>
          <ContractTableToolbar filterText={filterText} onFilterText={handleFilterTextChange} />

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
                  <ContractTableRow
                    isCustomer={true}
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
