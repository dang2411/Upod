import { Container } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Page from 'src/components/Page';
import useSettings from 'src/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/routes/paths';
import AgencyNewEditForm from 'src/sections/@dashboard/agency/form/AgencyNewEditForm';
import axiosInstance from 'src/utils/axios';

export default function AgencyEdit() {
  const { themeStretch } = useSettings();

  const { id = '' } = useParams();

  const navigate = useNavigate();

  const [data, setData] = useState<any>(null);

  const fetch = useCallback(async (id: string) => {
    try {
      const response = await axiosInstance.get(`/api/agencies/get_agency_details`, {
        params: { id },
      });
      const result = {
        id: response.data.id,
        name: response.data.agency_name,
        customer: response.data.customer,
        area: response.data.area.area_name,
        description: response.data.area.description,
        address: response.data.address,
        telephone: response.data.telephone,
        manager: response.data.manager_name,
      };
      if (response.status === 200) {
        setData(result);
      } else {
        navigate(PATH_DASHBOARD.admin.agency.root);
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

  const title = data?.name || 'Agency';

  if (!data) {
    return <div />;
  }

  return (
    <Page title="Agency: Edit">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Agency',
              href: PATH_DASHBOARD.admin.agency.root,
            },
            { name: title },
          ]}
        />
        <AgencyNewEditForm isEdit={true} currentAgency={data} />
      </Container>
    </Page>
  );
}
