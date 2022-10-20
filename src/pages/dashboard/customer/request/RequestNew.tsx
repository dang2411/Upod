import { Container } from '@mui/material';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Page from 'src/components/Page';
import useSettings from 'src/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/routes/paths';
import RequestNewEditForm from 'src/sections/@dashboard/request/form/RequestNewEditForm';

export default function RequestNew() {
  const { themeStretch } = useSettings();

  const title = 'Create Request';

  return (
    <Page title="Request: New">
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
              href: PATH_DASHBOARD.customer.request.root,
            },
            { name: title },
          ]}
        />

        <RequestNewEditForm isEdit={false} currentRequest={null} />
      </Container>
    </Page>
  );
}
