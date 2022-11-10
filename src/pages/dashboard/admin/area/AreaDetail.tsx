import { Container } from '@mui/material';
import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Page from 'src/components/Page';
import useSettings from 'src/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/routes/paths';
import AreaNewEditForm from 'src/sections/@dashboard/area/form/AreaNewEditForm';
import CompanyNewEditForm from 'src/sections/@dashboard/company/form/CompanyNewEditForm';
import axiosInstance from 'src/utils/axios';

export default function AreaDetail() {
  const { themeStretch } = useSettings();

  const { id = '' } = useParams();

  const navigate = useNavigate();

  const [data, setData] = useState<any>(null);

  const fetch = useCallback(async (id: string) => {
    try {
      const response = await axiosInstance.get(`/api/customers/get_customer_details_by_id`, {
        params: { id },
      });
      const result = {
        id: response.data.id || '',
        code: response.data.code || '',
        account: {
          id: response.data.id || '',
          code: response.data.code || '',
          roleName: response.data.role_name || '',
        },
        email: response.data.mail || '',
        address: response.data.address || '',
        phone: response.data.phone || '',
        description: response.data.description || '',
      };
      if (response.status === 200) {
        setData(result);
      } else {
        navigate(PATH_DASHBOARD.admin.company.root);
      }
    } catch (e) {
      console.error(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetch(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const title = data?.code || 'Area';

  if (!data) {
    return <div />;
  }

  return (
    <Page title="Area: Detail">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Area',
              href: PATH_DASHBOARD.admin.area.root,
            },
            { name: title },
          ]}
        />
        <AreaNewEditForm isEdit={false} currentArea={data} />
      </Container>
    </Page>
  );
}
