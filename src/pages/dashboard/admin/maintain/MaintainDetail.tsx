import { Container } from '@mui/material';
import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Page from 'src/components/Page';
import useSettings from 'src/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/routes/paths';
import MaintainNewEditForm from 'src/sections/@dashboard/maintain/form/MaintainNewEditForm';
import axiosInstance from 'src/utils/axios';

export default function DeviceDetail() {
  const { themeStretch } = useSettings();

  const { id = '' } = useParams();

  const navigate = useNavigate();

  const [data, setData] = useState<any>(null);

  const fetch = useCallback(async (id: string) => {
    try {
      const response = await axiosInstance.get(
        `/api/maintenance_reports/get_details_maintenance_report`,
        {
          params: { id },
        }
      );
      const result = {
        status: response.data.status,
        code: response.data.code,
        name: response.data.device_name,
        create_date: response.data.create_date,
        update_date: response.data.update_date,
        agency: response.data.agency,
        customer: response.data.customer,
        create_by: response.data.create_by,
        maintenance_schedule: response.data.maintenance_schedule,
        description: response.data.description,
        service: response.data.service,
      };
      console.log(response.data.status);
      if (response.status === 200) {
        setData(result);
      } else {
        navigate(PATH_DASHBOARD.admin.maintain.root);
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

  const title = data?.code || 'Device';

  if (!data) {
    return <div />;
  }

  return (
    <Page title="Maintain: Detail">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'DevicMaintaine',
              href: PATH_DASHBOARD.admin.maintain.root,
            },
            { name: title },
          ]}
        />
        <MaintainNewEditForm isEdit={false} currentMaintain={data} />
      </Container>
    </Page>
  );
}
