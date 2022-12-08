import { Box, Button, CircularProgress, Container, Stack } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Page from 'src/components/Page';
import useSettings from 'src/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/routes/paths';
import MaintainScheduleNewEditForm from 'src/sections/@dashboard/maintain-schedule/form/MaintainScheduleNewEditForm';
import axios from 'src/utils/axios';

export default function MaintainScheduleEdit() {
  const { themeStretch } = useSettings();

  const { id = '' } = useParams();

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState<any>(null);

  const title = data?.name || 'Maintain Schedule';

  const fetch = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `/api/maintenance_schedules/get_details_maintenance_schedule`,
        {
          params: { id },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setData(response.data);
      } else {
        navigate(PATH_DASHBOARD.admin.maintainSchedule.root);
      }
    } catch (e) {
      console.error(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onReportClick = () => {
    navigate(PATH_DASHBOARD.customer.maintainReport.edit(data.id));
  };
  useEffect(() => {
    setIsLoading(false);
    fetch(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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

  return (
    <Page title="Maintain Schedule: Edit">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Maintain Schedule',
              href: PATH_DASHBOARD.customer.maintainSchedule.root,
            },
            { name: title },
          ]}
          action={
            <Stack spacing={2} direction="row">
              {data.status.toLowerCase() === 'completed' && (
                <Button onClick={onReportClick}>Report</Button>
              )}
            </Stack>
          }
        />

        <MaintainScheduleNewEditForm isEdit={true} currentMaintainSchedule={data} />
      </Container>
    </Page>
  );
}
