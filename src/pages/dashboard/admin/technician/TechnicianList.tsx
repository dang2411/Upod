
import { Box, Button, Card, Container, FormControlLabel, Switch, Table, TableBody, TableContainer, TablePagination } from '@mui/material';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Page from 'src/components/Page';
import useSettings from 'src/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { TableHeadCustom, TableNoData } from 'src/components/table';
import useTable from 'src/hooks/useTable';
import ContractTableRow from 'src/sections/@dashboard/contract/list/ContractTableRow';
import ContractTableToolbar from 'src/sections/@dashboard/contract/list/ContractTableToolbar';
import TechnicianTableToolbar from 'src/sections/@dashboard/technician/list/TechnicianTableToolbar';
import TechnicianTableRow from 'src/sections/@dashboard/technician/list/TechnicianTableRow';

const TABLE_HEAD = [
  { id: 'code', label: 'Code', align: 'left' },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'skill', label: 'Skill', align: 'left' },
  { id: 'area', label: 'Area', align: 'left' },
];


export default function TechnicianList() {
  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const [filterText, setFilterText] = useState('');

  const handleBtnClick = () => {
    navigate(PATH_DASHBOARD.admin.technician.new);
  };

  const handleFilterTextChange = (value: string) => {
    setFilterText(value);
  };

  const handleRowClick = (value: string) => {
    navigate(PATH_DASHBOARD.admin.technician.edit(value));
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
  const fetch = useCallback(async () => {
    try {
      const response: any = await axiosInstance.get('/api/agencies/get_list_agencies', {
        params: { pageNumber: page + 1, pageSize: rowsPerPage, search: filterText },
      });

      setTotal(response.total);

      const result = Array.from(response.data).map((x: any) => ({
        id: x.id,
        code: x.code,
        name: x.agency_name,
        company: x.customer.name,
        address: x.address,
        phone: x.telephone,
      }));
      setData(result);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Cannot fetch data', { variant: 'error' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterText, page, rowsPerPage]);

  useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, filterText]);

  const [total, setTotal] = useState(0);

  const { enqueueSnackbar } = useSnackbar();

  const isNotFound = !data.length;

  return (
    <Page title="Technician: Listing">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Technician: Listing"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Technician',
              href: PATH_DASHBOARD.admin.technician.root,
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
          <TechnicianTableToolbar filterText={filterText} onFilterText={handleFilterTextChange} />

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
                  <TechnicianTableRow
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

                <TableNoData isNotFound={isNotFound} />
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
