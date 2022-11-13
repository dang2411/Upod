import { Container } from '@mui/material';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Page from 'src/components/Page';
import useSettings from 'src/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/routes/paths';
import CompanyNewEditForm from 'src/sections/@dashboard/company/form/CompanyNewEditForm';

export default function CompanyNew() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Customer: New">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Create Customer"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Customer',
              href: PATH_DASHBOARD.admin.company.root,
            },
            { name: 'New' },
          ]}
        />{' '}
        <CompanyNewEditForm isEdit={false} currentCompany={null} />
      </Container>
    </Page>
  );
}
