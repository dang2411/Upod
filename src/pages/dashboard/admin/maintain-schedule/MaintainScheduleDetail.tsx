import { Button, Container, Stack } from '@mui/material';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Page from 'src/components/Page';
import useSettings from 'src/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/routes/paths';
import MaintainScheduleNewEditForm from 'src/sections/@dashboard/maintain-schedule/form/MaintainScheduleNewEditForm';

export default function MaintainScheduleDetail() {
  const { themeStretch } = useSettings();

  const { id = '' } = useParams();

  const navigate = useNavigate();

  const [data, setData] = useState<any>(null);

  const title = data?.code || 'MaintainSchedule';

  if (!data) {
    return <div />;
  }

  const onReportClick = () => {
    navigate(PATH_DASHBOARD.admin.maintainReport.edit(id));
  };

  return (
    <Page title="Maintain Schedule: Detail">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Maintain-schedule',
              href: PATH_DASHBOARD.admin.maintainSchedule.root,
            },
            { name: title },
          ]}
        />
        <MaintainScheduleNewEditForm isEdit={false} currentMaintainSchedule={data} />
      </Container>
    </Page>
  );
}
