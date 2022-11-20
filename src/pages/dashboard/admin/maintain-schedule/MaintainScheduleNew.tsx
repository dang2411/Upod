import { Container } from '@mui/material';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Page from 'src/components/Page';
import useSettings from 'src/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/routes/paths';
import CompanyNewEditForm from 'src/sections/@dashboard/company/form/CompanyNewEditForm';
import MaintainNewEditForm from 'src/sections/@dashboard/maintain-report/form/MaintainNewEditForm';

export default function MaintainScheduleNew() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Maintain-schedule: New">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Create Maintain-schedule"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Maintain-schedule',
              href: PATH_DASHBOARD.admin.maintainSchedule.root,
            },
            { name: 'New' },
          ]}
        />{' '}
        <MaintainNewEditForm isEdit={false} currentMaintain={null} />
      </Container>
    </Page>
  );
}
