import { Container } from '@mui/material';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Page from 'src/components/Page';
import useSettings from 'src/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/routes/paths';
import ContractNewEditForm from 'src/sections/@dashboard/contract/form/ContractNewEditForm';

export default function ContractNew() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Contract: New">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Create Contract"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Contract',
              href: PATH_DASHBOARD.admin.contract.root,
            },
            { name: 'New' },
          ]}
        />
        <ContractNewEditForm isEdit={false} currentContract={null} />
      </Container>
    </Page>
  );
}
