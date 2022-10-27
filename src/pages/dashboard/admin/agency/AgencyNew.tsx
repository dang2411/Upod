import { Container } from '@mui/material';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Page from 'src/components/Page';
import useSettings from 'src/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/routes/paths';
import AgencyNewEditForm from 'src/sections/@dashboard/agency/form/AgencyNewEditForm';

export default function AgencyNew() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Agency: New">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Create Agency"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Agency',
              href: PATH_DASHBOARD.admin.agency.root,
            },
            { name: 'New' },
          ]}
        />
        <AgencyNewEditForm isEdit={false} currentAgency={null} />
      </Container>
    </Page>
  );
}
