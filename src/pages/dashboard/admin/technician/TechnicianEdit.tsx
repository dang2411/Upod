import { Box, CircularProgress, Container } from '@mui/material';
import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Page from 'src/components/Page';
import useSettings from 'src/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/routes/paths';
import TechnicianNewEditForm from 'src/sections/@dashboard/technician/form/TechnicianNewEditForm';
import axiosInstance from 'src/utils/axios';

export default function TechnicianEdit() {
  const { themeStretch } = useSettings();

  const { id = '' } = useParams();

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState<any>(null);

  const fetch = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/api/technicians/get_technician_details`, {
        params: { id },
      });
      const result = {
        id: response.data.id,
        code: response.data.code,
        name: response.data.technician_name,
        area: {
          id: response.data.area.id,
          name: response.data.area.area_name,
        },
        account: {
          id: response.data.account.id,
          name: response.data.account.username,
        },
        telephone: response.data.telephone,
        breach: response.data.breach,
        email: response.data.email,
        gender: response.data.gender,
        address: response.data.address,
        rating: response.data.rating_avg,
        busy: response.data.is_busy,
        service: response.data.service.map((x) => ({
          id: x.id,
          name: x.service_name,
        })),
      };
      if (response.status === 200) {
        setData(result);
      } else {
        navigate(PATH_DASHBOARD.admin.technician.root);
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

  const title = data?.name || 'Technician';

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
    <Page title="Technician: Edit">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Technician',
              href: PATH_DASHBOARD.admin.technician.root,
            },
            { name: title },
          ]}
        />
        <TechnicianNewEditForm isEdit={true} currentTechnician={data} />
      </Container>
    </Page>
  );
}
