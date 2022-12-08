import {
  Box,
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
import useSettings from 'src/hooks/useSettings';
import useTable from 'src/hooks/useTable';
import useTabs from 'src/hooks/useTabs';
import { PATH_DASHBOARD } from 'src/routes/paths';
import MaintainTableRow from 'src/sections/@dashboard/maintain-report/list/MaintainTableRow';
import MaintainTableToolbar from 'src/sections/@dashboard/maintain-report/list/MaintainTableToolbar';
import axiosInstance from 'src/utils/axios';

const TABLE_HEAD = [
  { id: 'code', label: 'Code', align: 'left' },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'createdDate', label: 'Created Date', align: 'left' },
  { id: 'agency', label: 'Agency', align: 'left' },
  { id: 'customer', label: 'Customer', align: 'left' },
  { id: 'createdBy', label: 'Created By', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'action', label: '', align: 'left' },
];

export default function MaintainReportList() {
  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

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
    navigate(PATH_DASHBOARD.admin.maintainReport.edit(value));
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
    setPage,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const processMaintain = useCallback(async (id: string) => {
    try {
      await axiosInstance.put(
        '/api/maintenance_reports/processing_maintenance_report',
        {},
        { params: { id } }
      );
      enqueueSnackbar('Process success', { variant: 'success' });
    } catch (error) {
      console.error(error);
      enqueueSnackbar(`${error}`, { variant: 'error' });
    }
  }, []);

  const fetch = useCallback(
    async ({ value, page, rowsPerPage, filterStatus }: any) => {
      try {
        const response: any = await axiosInstance.get(
          '/api/maintenance_reports/get_list_maintenance_reports',
          {
            params: {
              pageNumber: page + 1,
              pageSize: rowsPerPage,
              search: value === '' ? undefined : value,
              status: filterStatus === 'all' ? undefined : filterStatus,
            },
          }
        );

        setTotal(response.total);

        const result = Array.from(response.data).map((x: any) => ({
          id: x.id,
          code: x.code,
          name: x.name,
          createdDate: x.update_date,
          customer: x.customer,
          agency: x.agency,
          status: x.status.toLowerCase(),
          maintenance_schedule: x.maintenance_schedule,
          technician: x.create_by,
          is_processed: x.is_processed,
        }));
        setData(result);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
        enqueueSnackbar('Cannot fetch data', { variant: 'error' });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterText, page, rowsPerPage]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSearch = useCallback(
    debounce(
      ({ value, page, rowsPerPage, filterStatus }: any) =>
        fetch({ value, page, rowsPerPage, filterStatus }),
      1000
    ),
    []
  );

  const handleProcess = async (id: string) => {
    await processMaintain(id);
    fetch({ filterText, page, rowsPerPage, filterStatus });
  };

  useEffect(() => {
    setIsLoading(true);
    debounceSearch({ value: filterText, page, rowsPerPage, filterStatus });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, filterStatus, filterText]);

  const [total, setTotal] = useState(0);

  const { enqueueSnackbar } = useSnackbar();

  const isNotFound = !data.length;

  return (
    <Page title="Maintain Report: Listing">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Maintain Report: Listing"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Maintain',
              href: PATH_DASHBOARD.admin.maintainReport.root,
            },
            { name: 'Listing' },
          ]}
          // action={
          //   <Button variant="contained" onClick={() => handleBtnClick()}>
          //     Create
          //   </Button>
          // }
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
          <MaintainTableToolbar
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
                {data.map((row: any) => (
                  <MaintainTableRow
                    key={row.id}
                    row={row}
                    onRowClick={() => handleRowClick(row.maintenance_schedule.id)}
                    is_processed={row.is_processed}
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
