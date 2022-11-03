import { Container } from '@mui/material';
import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Page from 'src/components/Page';
import useSettings from 'src/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/routes/paths';
import DeviceNewEditForm from 'src/sections/@dashboard/device/form/DeviceNewEditForm';
import axiosInstance from 'src/utils/axios';

export default function DeviceDetail() {
  const { themeStretch } = useSettings();

  const { id = '' } = useParams();

  const navigate = useNavigate();

  const [data, setData] = useState<any>(null);

  const fetch = useCallback(async (id: string) => {
    try {
      const response = await axiosInstance.get(`/api/devices/get_device_details_by_id`, {
        params: { id },
      });
      const result = {
        code: response.data.code,
        name: response.data.device_name,
        type: {
          id: response.data.devicetype.id,
          name: response.data.devicetype.device_type_name,
        },
        agency: {
          id: response.data.agency.id,
          name: response.data.agency.agency_name,
        },
        ip: response.data.ip,
        port: response.data.port,
        deviceAccount: response.data.device_account,
        devicePassword: response.data.device_password,
        settingDate: response.data.setting_date,
      };
      if (response.status === 200) {
        setData(result);
      } else {
        navigate(PATH_DASHBOARD.admin.device.root);
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
    <Page title="Device: Detail">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Device',
              href: PATH_DASHBOARD.admin.device.root,
            },
            { name: title },
          ]}
        />
        <DeviceNewEditForm isEdit={false} currentDevice={data} />
      </Container>
    </Page>
  );
}
