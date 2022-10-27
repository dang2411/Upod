import { Container } from '@mui/material';
import { useParams } from 'react-router-dom';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Page from 'src/components/Page';
import useSettings from 'src/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/routes/paths';

export default function TechnicianEdit() {
  const { themeStretch } = useSettings();

  const { id = '' } = useParams();

  const title = 'Technician';

  return (
    <Page title="Technician: Edit">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Technician',
              href: PATH_DASHBOARD.admin.technician.root,
            },
            { name: title },
          ]}
        />
      </Container>
    </Page>
  );
}
