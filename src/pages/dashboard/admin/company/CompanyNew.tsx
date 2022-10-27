import { Container } from '@mui/material';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Page from 'src/components/Page';
import useSettings from 'src/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/routes/paths';

export default function CompanyNew() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Company: New">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Create Company"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Company',
              href: PATH_DASHBOARD.admin.company.root,
            },
            { name: 'New' },
          ]}
        />
      </Container>
    </Page>
  );
}
