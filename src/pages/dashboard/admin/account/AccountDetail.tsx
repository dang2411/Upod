import { Container } from '@mui/material';
import { useState, useCallback, useEffect } from 'react';

import { useNavigate, useParams } from 'react-router-dom';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Page from 'src/components/Page';
import useSettings from 'src/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/routes/paths';
import AccountNewEditForm from 'src/sections/@dashboard/account/form/AccountNewEditForm';
import axiosInstance from 'src/utils/axios';

export default function AccountDetail() {
  const { themeStretch } = useSettings();

  const { id = '' } = useParams();

  const navigate = useNavigate();

  const [data, setData] = useState<any>(null);

  const fetch = useCallback(async (id: string) => {
    try {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const title = data?.code || 'Account';

  if (!data) {
    return <div />;
  }

  return (
    <Page title="Account: Detail">
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
        <AccountNewEditForm isEdit={false} currentAccount={data} />
      </Container>
    </Page>
  );
}
