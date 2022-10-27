import { Container } from '@mui/material';
import { useParams } from 'react-router-dom';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Page from 'src/components/Page';
import useSettings from 'src/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/routes/paths';

export default function CompanyDetail() {
  const { themeStretch } = useSettings();

  const { id = '' } = useParams();

  const title = 'Company';

  return (
    <Page title="Company: Detail">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Company',
              href: PATH_DASHBOARD.admin.company.root,
            },
            { name: title },
          ]}
        />
      </Container>
    </Page>
  );
}
