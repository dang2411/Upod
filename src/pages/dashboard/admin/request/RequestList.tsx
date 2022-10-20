import {
  Box,
  Button,
  Card,
  Container,
  FormControlLabel,
  Switch,
  Table,
  TableBody,
  TableContainer,
  TablePagination
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Priority, Request } from 'src/@types/request';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Page from 'src/components/Page';
import { TableEmptyRows, TableHeadCustom, TableNoData } from 'src/components/table';
import useSettings from 'src/hooks/useSettings';
import useTable, { emptyRows } from 'src/hooks/useTable';
import { PATH_DASHBOARD } from 'src/routes/paths';
import RequestTableRow from 'src/sections/@dashboard/request/list/RequestTableRow';
import RequestTableToolbar from 'src/sections/@dashboard/request/list/RequestTableToolbar';
import axios from 'src/utils/axios';

const TABLE_HEAD = [
  { id: 'code', label: 'Code', align: 'left' },
  { id: 'name', label: 'RequestName', align: 'left' },
  { id: 'agency', label: 'Agency', align: 'left' },
  { id: 'service', label: 'Service', align: 'left' },
  { id: 'createdAt', label: 'createdAt', align: 'left' },
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
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const [data, setData] = useState<Request[]>([]);

  const denseHeight = dense ? 52 : 72;

  const isNotFound = !data.length;

  const fetch = useCallback(async () => {
    const response = await axios.get('/api/requests/get_list_requests', 
    // {
      // params: { pageNumber: page, pageSize: rowsPerPage },
    // }
    );
    const result = Array.from(response.data).map(
      (x: any) =>
        ({
          id: x.id,
          code: x.code,
          createdAt: new Date(x.create_date),
          name: x.request_name,
          service: { id: x.service.id, name: x.service.code },
          agency: { id: x.agency.id, name: x.agency.code },
          priority: parsePriority(x.priority),
          description: x.description,
          status: x.request_status.toLowerCase(),
          technician: '',
        } as Request)
    );
    setData(result);
  }, []);

  useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, filterText]);

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
          <RequestTableToolbar filterText={filterText} onFilterText={handleFilterTextChange} />

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

                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(page, rowsPerPage, data.length)}
                />

                <TableNoData isNotFound={isNotFound} />
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ position: 'relative' }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={data.length}
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
