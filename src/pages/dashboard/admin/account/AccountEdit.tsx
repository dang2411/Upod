import { Container } from '@mui/material';
import { useParams } from 'react-router-dom';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Page from 'src/components/Page';
import useSettings from 'src/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/routes/paths';

export default function AccountEdit() {
  const { themeStretch } = useSettings();

  const { id = '' } = useParams();

  const title = 'Account';

  return (
    <Page title="Account: Edit">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Account',
              href: PATH_DASHBOARD.admin.account.root,
            },
            { name: title },
          ]}
        />
      </Container>
    </Page>
  );
}
