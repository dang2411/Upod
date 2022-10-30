import { Container } from '@mui/material';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Page from 'src/components/Page';
import useSettings from 'src/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/routes/paths';
import AccountNewEditForm from 'src/sections/@dashboard/account/form/AccountNewEditForm';

export default function AccountNew() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Account: New">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Create Account"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Account',
              href: PATH_DASHBOARD.admin.account.root,
            },
            { name: 'New' },
          ]}
        />
        <AccountNewEditForm isEdit={false} currentAccount={null} />
      </Container>
    </Page>
  );
}
