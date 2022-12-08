import { Box, CircularProgress, Container } from '@mui/material';
import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Page from 'src/components/Page';
import useSettings from 'src/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/routes/paths';
import AccountNewEditForm from 'src/sections/@dashboard/account/form/AccountNewEditForm';
import axiosInstance from 'src/utils/axios';

export default function AccountEdit() {
  const { themeStretch } = useSettings();

  const { id = '' } = useParams();

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const [data, setData] = useState<any>(null);

  const fetch = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/api/accounts/search_accounts_by_id`, {
        params: { id },
      });
      const result = {
        id: response.data.id,
        code: response.data.code,
        role: {
          id: response.data.role.id,
          name: response.data.role.role_name,
        },
        password: response.data.password,
        is_assign: response.data.is_assign,
        username: response.data.username,
        isDelete: response.data.is_delete,
      };
      if (response.status === 200) {
        setData(result);
      } else {
        navigate(PATH_DASHBOARD.admin.account.root);
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

  const title = data?.code || 'Account';

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
    <Page title="Account: Edit">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Account',
              href: PATH_DASHBOARD.admin.account.root,
            },
            { name: title },
          ]}
        />
        <AccountNewEditForm isEdit={true} currentAccount={data} />
      </Container>
    </Page>
  );
}
