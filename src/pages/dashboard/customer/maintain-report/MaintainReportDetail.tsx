import { Box, Button, CircularProgress, Container, Stack } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Page from 'src/components/Page';
import useSettings from 'src/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/routes/paths';
import MaintainNewEditForm from 'src/sections/@dashboard/maintain-report/form/MaintainNewEditForm';
import axios from 'src/utils/axios';

export default function MaintainReportDetail() {
  const { themeStretch } = useSettings();

  const { id = '' } = useParams();

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState<any>(null);

  const { enqueueSnackbar } = useSnackbar();

  const fetch = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/maintenance_reports/get_details_maintenance_report`, {
        params: { id },
      });
      const result = {
        id: response.data.id,
        status: response.data.status.toLowerCase(),
        code: response.data.code,
        name: response.data.device_name,
        create_date: response.data.create_date,
        update_date: response.data.update_date,
        agency: response.data.agency,
        customer: response.data.customer,
        is_processed: response.data.is_processed,
        create_by: response.data.create_by,
        maintenance_schedule: response.data.maintenance_schedule,
        description: response.data.description,
        service: response.data.service,
      };
      console.log(result);
      if (response.status === 200) {
        setData(result);
      } else {
        navigate(PATH_DASHBOARD.customer.maintainReport.root);
      }
    } catch (e) {
      console.error(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetch(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const title = data?.code || 'Device';

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

  const onScheduleClick = () => {
    navigate(PATH_DASHBOARD.customer.maintainSchedule.edit(data.maintenance_schedule.id));
  };

  return (
    <Page title="Maintain Report: Detail">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Maintain Report',
              href: PATH_DASHBOARD.customer.maintainReport.root,
            },
            { name: title },
          ]}
          action={
            <>
              <Button variant="outlined" onClick={onScheduleClick}>
                Schedule
              </Button>
            </>
          }
        />

        <MaintainNewEditForm isEdit={false} currentMaintain={data} />
      </Container>
    </Page>
  );
}
