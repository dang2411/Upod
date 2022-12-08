import { Box, CircularProgress, Container } from '@mui/material';
import { format } from 'date-fns';
import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Page from 'src/components/Page';
import useSettings from 'src/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/routes/paths';
import ContractNewEditForm from 'src/sections/@dashboard/contract/form/ContractNewEditForm';
import axiosInstance from 'src/utils/axios';

export default function ContractDetail() {
  const { themeStretch } = useSettings();

  const { id = '' } = useParams();

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const [data, setData] = useState<any>(null);

  const fetch = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/api/contracts/get_contract_details_by_id`, {
        params: { id },
      });
      const result = {
        id: response.data.id,
        code: response.data.code,
        name: response.data.contract_name,
        customer: {
          id: response.data.customer.id,
          name: response.data.customer.cus_name,
        },
        contractPrice: response.data.contract_price,
        startDate: response.data.start_date,
        endDate: response.data.end_date,
        attachment: response.data.attachment,
        img: response.data.img,
        is_expire: response.data.is_expire,
        is_accepted: response.data.is_accepted,
        reject_reason: response.data.reject_reason,
        terminal_content: response.data.terminal_content,
        terminal_time: format(new Date(response.data.terminal_time), 'HH:mm dd/MM/yyyy'),
        description: response.data.description,
        frequencyMaintain: response.data.frequency_maintain_time,
        service: response.data.service.map((x) => ({
          id: x.id,
          name: x.service_name,
        })),
      };
      if (response.status === 200) {
        setData(result);
      } else {
        navigate(PATH_DASHBOARD.customer.contract.list);
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

  const title = data?.name || 'Contract';

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
    <Page title="Contract: Detail">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Contract',
              href: PATH_DASHBOARD.customer.contract.list,
            },
            { name: title },
          ]}
        />
        <ContractNewEditForm isEdit={false} currentContract={data} />
      </Container>
    </Page>
  );
}
