import { Box, CircularProgress, Container } from '@mui/material';
import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Page from 'src/components/Page';
import useSettings from 'src/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/routes/paths';
import ServiceNewEditForm from 'src/sections/@dashboard/service/form/ServiceNewEditForm';
import axiosInstance from 'src/utils/axios';

export default function ServiceEdit() {
  const { themeStretch } = useSettings();

  const { id = '' } = useParams();

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const [data, setData] = useState<any>(null);

  const fetch = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/api/services/get_service_details`, {
        params: { id },
      });
      const result = {
        id: response.data.id,
        code: response.data.code,
        name: response.data.service_name,
        createDate: response.data.create_date,
        description: response.data.description,
        guideline: response.data.guideline,
      };
      if (response.status === 200) {
        setData(result);
      } else {
        navigate(PATH_DASHBOARD.admin.service.root);
      }
    } catch (e) {
      console.error(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetch(id);
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const title = data?.name || 'Service';

  if (!data) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {<CircularProgress />}
      </Box>
    );
  }
  return (
    <Page title="Service: Edit">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Service',
              href: PATH_DASHBOARD.admin.service.root,
            },
            { name: title },
          ]}
        />
        <ServiceNewEditForm isEdit={true} currentService={data} />
      </Container>
    </Page>
  );
}
