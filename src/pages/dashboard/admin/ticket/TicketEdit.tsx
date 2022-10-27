import { Container } from '@mui/material';
import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Page from 'src/components/Page';
import useSettings from 'src/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/routes/paths';
import TicketNewEditForm from 'src/sections/@dashboard/ticket/form/TicketNewEditForm';
import axiosInstance from 'src/utils/axios';

export default function TicketEdit() {
  const { themeStretch } = useSettings();

  const { id = '' } = useParams();

  const navigate = useNavigate();

  const [data, setData] = useState<any>(null);

  const fetch = useCallback(async (id: string) => {
    try {
      const response = await axiosInstance.get(``, {
        params: { id },
      });
      const result = {};
      if (response.status === 200) {
        setData(result);
      } else {
        navigate(PATH_DASHBOARD.admin.ticket.root);
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

  const title = data?.name || 'Ticket';

  if (!data) {
    return <div />;
  }

  return (
    <Page title="Ticket: Edit">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Ticket',
              href: PATH_DASHBOARD.admin.ticket.root,
            },
            { name: title },
          ]}
        />
        <TicketNewEditForm isEdit={true} currentTicket={data} />
      </Container>
    </Page>
  );
}
