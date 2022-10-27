import { Container } from '@mui/material';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Page from 'src/components/Page';
import useSettings from 'src/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/routes/paths';
import ServiceNewEditForm from 'src/sections/@dashboard/service/form/ServiceNewEditForm';

export default function ServiceNew() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Service: New">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Create Service"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Servcie',
              href: PATH_DASHBOARD.admin.service.root,
            },
            { name: 'New' },
          ]}
        />
        <ServiceNewEditForm isEdit={false} currentService={null} />
      </Container>
    </Page>
  );
}
