import { Container } from '@mui/material';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Page from 'src/components/Page';
import useSettings from 'src/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/routes/paths';
import TechnicianNewEditForm from 'src/sections/@dashboard/technician/form/TechnicianNewEditForm';

export default function TechnicianNew() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Technician: New">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Create Technician"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Technician',
              href: PATH_DASHBOARD.admin.technician.root,
            },
            { name: 'New' },
          ]}
        />
        <TechnicianNewEditForm isEdit={false} currentTechnician={null} />
      </Container>
    </Page>
  );
}
