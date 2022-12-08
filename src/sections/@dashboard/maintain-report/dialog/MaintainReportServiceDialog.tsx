import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Dialog, Grid, InputAdornment, Stack, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/Iconify';
import ReportNewEditImageFormField from '../card/ReportNewEditImageFormField';
type Props = {
  open: boolean;
  onClose: VoidFunction;
  data: any;
};
export default function MaintainReportServiceDialog({ open, onClose, data }: Props) {
  const methods = useForm({});

  const handleCancel = () => {
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="lg">
        <Stack mt={3} direction="row" justifyContent="end" textAlign="end" mr={3} spacing={2}>
          <Button sx={{ cursor: 'pointer' }} onClick={handleCancel} color="inherit">
            <Iconify icon="charm:cross" sx={{ width: 35, height: 35 }} />
          </Button>
        </Stack>
        <Box sx={{ width: '1000px', py: 5 }}>
          <FormProvider methods={methods}>
            <Grid container>
              <Grid item md={6} xs={12}>
                <ReportNewEditImageFormField listImage={data.img} />
              </Grid>
              <Grid item md={6} xs={12}>
                <Stack spacing={3}>
                  <TextField
                    name="code"
                    label="Code"
                    value={data.code}
                    variant="outlined"
                    disabled={true}
                    fullWidth
                  />
                  <TextField
                    name="service_name"
                    label="Service name"
                    value={data.service_name}
                    variant="outlined"
                    disabled={true}
                    fullWidth
                  />
                  <TextField
                    name="description"
                    label="Description"
                    value={data.description}
                    variant="outlined"
                    disabled={true}
                    fullWidth
                  />
                  {(data.is_resolved && (
                    <RHFTextField
                      name=""
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Iconify
                              icon="akar-icons:circle-check"
                              sx={{ width: 20, height: 20, color: 'success.main' }}
                            />
                          </InputAdornment>
                        ),
                      }}
                      label="Resolved"
                      disabled={true}
                    />
                  )) ||
                    (!data.is_resolved && (
                      <RHFTextField
                        name=""
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Iconify
                                icon="charm:circle-cross"
                                sx={{ width: 20, height: 20, color: 'error.main' }}
                              />
                            </InputAdornment>
                          ),
                        }}
                        label="Resolved"
                        disabled={true}
                      />
                    ))}
                </Stack>
              </Grid>
            </Grid>
          </FormProvider>
        </Box>
      </Dialog>
    </>
  );
}
