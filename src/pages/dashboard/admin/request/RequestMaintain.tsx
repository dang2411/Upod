import { Container } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Page from 'src/components/Page';
import useAuth from 'src/hooks/useAuth';
import useSettings from 'src/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/routes/paths';
import RequestNewEditForm from 'src/sections/@dashboard/request/form/RequestNewEditForm';
import axiosInstance from 'src/utils/axios';
import { Request } from 'src/@types/request';

export default function RequestMaintain() {
  const { themeStretch } = useSettings();

  const { id = '' } = useParams();

  const [request, setRequest] = useState<Request | null>(null);

  const navigate = useNavigate();

  const { user } = useAuth();

  const fetch = useCallback(async (id: string) => {
    try {
      const response = await axiosInstance.get(
        '/api/requests/auto_fill_request_by_report_service_id',
        {
          params: { id },
        }
      );
      const result = {
        reportId: id,
        customer: { id: response.data.customer.id, name: response.data.customer.cus_name },
        service: { id: response.data.service.id, name: response.data.service.service_name },
        agency: {
          id: response.data.agency.id,
          name: response.data.agency.agency_name,
          phone: response.data.agency.phone,
          address: response.data.agency.address,
        },
        description: response.data.request_description,
      } as any;
      if (response.status === 200) {
        setRequest(result);
      } else {
        if (user!.account.roleName === 'Customer') {
          navigate(PATH_DASHBOARD.customer.request.root);
        }

        if (user!.account.roleName === 'Admin') {
          navigate(PATH_DASHBOARD.admin.request.root);
        }
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

  const title = 'Create Request';

  if (!request) {
    return <div />;
  }

  return (
    <Page title="Request: New">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Request',
              href: PATH_DASHBOARD.admin.request.root,
            },
            { name: title },
          ]}
        />
        <RequestNewEditForm isEdit={false} currentRequest={request} isMaintain={true} />
      </Container>
    </Page>
  );
}
