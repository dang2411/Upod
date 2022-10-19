import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Card, Container, Grid, MenuItem, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Page from 'src/components/Page';
import useSettings from 'src/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/routes/paths';
import axios from 'src/utils/axios';
import * as Yup from 'yup';
import { FormProvider, RHFTextField } from '../../../../components/hook-form';

const PRIORITY = [
  { text: 'Low', value: 1 },
  { text: 'Medium', value: 2 },
  { text: 'High', value: 3 },
];

export default function RequestNew() {
  const RequestSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email(),
    phoneNumber: Yup.string().required('Phone number is required'),
    address: Yup.string().required('Address is required'),
    country: Yup.string().required('country is required'),
    company: Yup.string().required('Company is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    role: Yup.string().required('Role Number is required'),
    avatarUrl: Yup.mixed().test('required', 'Avatar is required', (value) => value !== ''),
  });
  const { themeStretch } = useSettings();
  const methods = useForm<any>({
    resolver: yupResolver(RequestSchema),
  });

  const handleSubmit = async (
    agency: string,
    service: string,
    description: string,
    name: string,
    priority: number
  ) => {
    const response = await axios.post('/api/requests/create_request', {
      agency_id: agency,
      service_id: service,
      request_description: description,
      request_name: name,
      priority: priority,
    });
    
    if (response.status === 201) alert('Create success!');
  };

  const [name, setName] = useState('');
  const [agency, setAgency] = useState('');
  const [priority, setPriority] = useState('');
  const [service, setService] = useState('');
  const [description, setDescription] = useState('');

  return (
    <Page title="Request: Create">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Request: Create"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Request',
              href: PATH_DASHBOARD.customer.request.root,
            },
            { name: 'Create' },
          ]}
        />
        <FormProvider methods={methods}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <RHFTextField
                    name="name"
                    label="Name"
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFTextField
                    name="agency"
                    label="Agency"
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => setAgency(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFTextField
                    name="service"
                    label="Service"
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => setService(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  {/* <InputLabel id="lable">Priority</InputLabel> */}

                  <TextField
                    select
                    name="priority"
                    variant="outlined"
                    label="Priority"
                    fullWidth
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    {PRIORITY.map((option: { text: string; value: number }) => (
                      <MenuItem key={option.text} value={option.value}>
                        {option.text}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFTextField
                    name="description"
                    label="Description"
                    variant="outlined"
                    multiline
                    minRows={6}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Grid>
                <Box display="flex" justifyContent="center" m={1} width="100%">
                  <Button
                    variant="contained"
                    onClick={() =>
                      handleSubmit(agency, service, description, name, parseInt(priority))
                    }
                  >
                    Create
                  </Button>
                </Box>
              </Grid>
            </Card>
          </Stack>
        </FormProvider>
      </Container>
    </Page>
  );
}
