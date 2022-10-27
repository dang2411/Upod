import { Container } from '@mui/material';
import { useParams } from 'react-router-dom';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Page from 'src/components/Page';
import useSettings from 'src/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/routes/paths';

export default function ServiceDetail() {
  const { themeStretch } = useSettings();

  const { id = '' } = useParams();

  const title = 'Service';

  return (
    <Page title="Service: Detail">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Service',
              href: PATH_DASHBOARD.admin.service.root,
            },
            { name: title },
          ]}
        />
      </Container>
    </Page>
  );
}
