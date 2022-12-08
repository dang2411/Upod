import { Button, Container, Stack } from '@mui/material';
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

  const [data, setData] = useState<any>(null);

  const { enqueueSnackbar } = useSnackbar();

  const processMaintain = useCallback(
    async (value: string) => {
      try {
        await axios.put('/api/maintenance_reports/processing_maintenance_report', undefined, {
          params: { id: value },
        });
        enqueueSnackbar('Process success', { variant: 'success' });
        navigate(PATH_DASHBOARD.admin.maintainReport.root);
      } catch (error) {
        console.error(error);
        enqueueSnackbar(`${error}`, { variant: 'error' });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id]
  );

  const unProcessMaintain = useCallback(
    async (value: string) => {
      try {
        await axios.put('/api/maintenance_reports/unprocessing_maintenance_report', undefined, {
          params: { id: value },
        });
        enqueueSnackbar('Un Process success', { variant: 'success' });
        navigate(PATH_DASHBOARD.admin.maintainReport.root);
      } catch (error) {
        console.error(error);
        enqueueSnackbar(`${error}`, { variant: 'error' });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id]
  );

  const fetch = useCallback(async (id: string) => {
    try {
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
        create_by: response.data.create_by,
        maintenance_schedule: response.data.maintenance_schedule,
        description: response.data.description,
        service: response.data.service,
      };
      if (response.status === 200) {
        setData(result);
      } else {
        navigate(PATH_DASHBOARD.admin.maintainReport.root);
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
    return <div />;
  }

  const onScheduleClick = () => {
    navigate(PATH_DASHBOARD.admin.maintainSchedule.edit(data.maintenance_schedule.id));
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
              href: PATH_DASHBOARD.admin.maintainReport.root,
            },
            { name: title },
          ]}
          action={
            <><Button variant='outlined' onClick={onScheduleClick}>Schedule</Button>
            </>
          }
        />

        <MaintainNewEditForm isEdit={false} currentMaintain={data} />
      </Container>
    </Page>
  );
}
