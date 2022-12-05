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
import { useSnackbar } from 'notistack';
import { TableHeadCustom, TableNoData } from 'src/components/table';
import useTable from 'src/hooks/useTable';
import CompanyTableToolbar from 'src/sections/@dashboard/company/list/CompanyTableToolbar';
import CompanyTableRow from 'src/sections/@dashboard/company/list/CompanyTableRow';
import axiosInstance from 'src/utils/axios';

const TABLE_HEAD = [
  { id: 'code', label: 'Code', align: 'left' },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'address', label: 'Address', align: 'left' },
  { id: 'phone', label: 'Phone', align: 'left' },
  { id: 'createDate', label: 'CreateDate', align: 'left' },
];

export default function CompanyList() {
  const { themeStretch } = useSettings();

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const [filterText, setFilterText] = useState('');

  const handleBtnClick = () => {
    navigate(PATH_DASHBOARD.admin.company.new);
  };

  const handleFilterTextChange = (value: string) => {
    setFilterText(value);
  };

  const handleRowClick = (value: string) => {
    navigate(PATH_DASHBOARD.admin.company.edit(value));
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

  const fetch = useCallback(
    async ({ value, page, rowsPerPage }: any) => {
      try {
        const response: any = await axiosInstance.get('/api/customers/get_all_customers', {
          params: {
            pageNumber: page + 1,
            pageSize: rowsPerPage,
            search: value === '' ? undefined : value,
          },
        });

        setTotal(response.total);
        //
        const result = Array.from(response.data).map((x: any) => ({
          id: x.id,
          code: x.code,
          name: x.name,
          address: x.address ?? '',
          phone: x.phone ?? '',
          email: x.mail ?? '',
          description: x.description,
          createDate: x.create_date,
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
    <Page title="Customer: Listing">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Customer: Listing"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Customer',
              href: PATH_DASHBOARD.admin.company.root,
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
          <CompanyTableToolbar filterText={filterText} onFilterText={handleFilterTextChange} />

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
                  <CompanyTableRow
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
