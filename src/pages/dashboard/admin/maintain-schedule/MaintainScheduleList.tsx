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
import { PATH_DASHBOARD } from 'src/routes/paths';
import MaintainScheduleTableRow from 'src/sections/@dashboard/maintain-schedule/list/MaintainScheduleTableRow';
import MaintainScheduleTableToolbar from 'src/sections/@dashboard/maintain-schedule/list/MaintainScheduleTableToolbar';
import axiosInstance from 'src/utils/axios';

const TABLE_HEAD = [
  { id: 'code', label: 'Code', align: 'left' },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'agencyName', label: 'Agency name', align: 'left' },
  { id: 'technicianName', label: 'Technician name', align: 'left' },
  { id: 'maintainTime', label: 'Maintain time', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
];

export default function MaintainScheduleList() {
  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const [filterText, setFilterText] = useState('');

  const handleBtnClick = () => {
    navigate(PATH_DASHBOARD.admin.maintainSchedule.new);
  };

  const handleFilterTextChange = (value: string) => {
    setFilterText(value);
  };

  const handleRowClick = (value: string) => {
    navigate(PATH_DASHBOARD.admin.maintainSchedule.edit(value));
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
      const response: any = await axiosInstance.get(
        '/api/maintenance_schedules/get_list_maintenance_schedules',
        {
          params: { pageNumber: page + 1, pageSize: rowsPerPage, search: filterText },
        }
      );

      setTotal(response.total);
      //
      const result = Array.from(response.data).map((x: any) => ({
        id: x.id,
        code: x.code,
        name: x.name,
        createDate: x.create_date ?? '',
        description: x.description,
        maintainTime: x.maintain_time,
        agency: x.agency.agency_name,
        technician: x.technician.tech_name,
        status: x.status,
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
    <Page title="Maintain Schedule: Listing">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Maintain Schedule: Listing"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Maintain-schedule',
              href: PATH_DASHBOARD.admin.maintainSchedule.root,
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
          <MaintainScheduleTableToolbar
            filterText={filterText}
            onFilterText={handleFilterTextChange}
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
                  <MaintainScheduleTableRow
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