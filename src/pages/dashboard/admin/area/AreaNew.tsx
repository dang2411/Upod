import { Container } from '@mui/material';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Page from 'src/components/Page';
import useSettings from 'src/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/routes/paths';
import AreaNewEditForm from 'src/sections/@dashboard/area/form/AreaNewEditForm';
import ContractNewEditForm from 'src/sections/@dashboard/contract/form/ContractNewEditForm';

export default function AreaNew() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Area: New">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Area Area"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Area',
              href: PATH_DASHBOARD.admin.area.root,
            },
            { name: 'New' },
          ]}
        />
        <AreaNewEditForm isEdit={false} currentArea={null} />
      </Container>
    </Page>
  );
}
