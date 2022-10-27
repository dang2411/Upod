import { Container } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Page from 'src/components/Page';
import useSettings from 'src/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/routes/paths';
import CompanyNewEditForm from 'src/sections/@dashboard/company/form/CompanyNewEditForm';
import axiosInstance from 'src/utils/axios';

export default function CompanyEdit() {
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
        id: response.data[0].id,
        code: response.data[0].code,
        name: response.data[0].name,
        account: response.data[0].account,
        mail: response.data[0].mail,
        address: response.data[0].address,
        phone: response.data[0].phone,
        description: response.data[0].description,
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

  const title = data?.name || 'Company';

  if (!data) {
    return <div />;
  }
  return (
    <Page title="Company: Edit">
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
        <CompanyNewEditForm isEdit={true} currentCompany={data} />
      </Container>
    </Page>
  );
}
