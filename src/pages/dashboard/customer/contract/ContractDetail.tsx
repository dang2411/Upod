import { Container } from '@mui/material';
import { useParams } from 'react-router-dom';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Page from 'src/components/Page';
import useSettings from 'src/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/routes/paths';

export default function ContractDetail() {
  const { themeStretch } = useSettings();

  const { id = '' } = useParams();

  const title = 'Contract';

  return (
    <Page title="Contract: Detail">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Contract',
              href: PATH_DASHBOARD.customer.contract.root,
            },
            { name: title },
          ]}
        />
      </Container>
    </Page>
  );
}
