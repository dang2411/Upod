import { Container, FormControlLabel, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Page from 'src/components/Page';
import useSettings from 'src/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { _request } from 'src/_mock/_requests';

export default function RequestDetail() {
  const { themeStretch } = useSettings();
  

  const { id = '' } = useParams();

  const request = _request.find((item) => item.id === id);

  const title = request?.name || 'Request';

  return (
    <Page title="Request: Detail">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Request',
              href: PATH_DASHBOARD.admin.request.root,
            },
            { name: title },
          ]}
        />
      </Container>
    </Page>
  );
}
