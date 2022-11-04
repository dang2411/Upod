import { Box, Button, Card, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useCallback, useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/Iconify';
import axios from 'src/utils/axios';

export default function RequestNewEditTicketForm({ requestId, agencyId, editable }: any) {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({ control, name: 'ticket' });

  const theme = useTheme();

  const [devices, setDevices] = useState([]);

  const [ticket, setTicket] = useState([]);

  const handleAppend = () => {
    append({ frequencyMaintain: 0 });
  };

  const handleRemove = (index: number) => {
    remove(index);
  };

  const fetchTicket = useCallback(async (id: string) => {
    try {
      const response = await axios.get('/api/technicians/get_ticket_by_request_id', {
        params: { id, pageSize: 10000, pageNumber: 1 },
      });
      setTicket(
        response.data.map((x) => ({
          id: x.ticket_id,
          device: { id: x.device_id, name: x.name },
          solution: x.solution,
          description: x.description,
        }))
      );
      setValue('ticket', ticket);
    } catch (error) {
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDevices = useCallback(async (id: string) => {
    try {
      const response = await axios.get('/api/devices/get_list_devices_by_agency_id', {
        params: { id, pageSize: 10000, pageNumber: 1 },
      });
      setDevices(
        response.data.map((x) => ({
          id: x.id,
          name: x.device_name,
        }))
      );
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchTicket(requestId);
    fetchDevices(agencyId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agencyId]);

//   const deviceList = devices.filter(
//     (x: { id: string; name: string }) => !fields.find((y: any) => y.value?.id === x.id)
//   ) as any[];
  return (
    <>
      {fields && (
        <Card sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Typography variant="h6" fontWeight={600}>
              Ticket
            </Typography>
            {fields.map((item: any, index) => (
              <>
                <Stack
                  spacing={1}
                  sx={{
                    pt: 3,
                    pb: 2.5,
                    borderBottom: 1,
                    borderBottomStyle: 'dashed',
                    borderBottomColor: theme.palette.divider,
                  }}
                  key={index}
                >
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Box
                      display="grid"
                      sx={{ gridTemplateColumns: 'auto auto auto', flexGrow: 1, gap: 2 }}
                    >
                      <RHFAutocomplete
                        name={`ticket[${index}].device`}
                        label="Device"
                        variant="outlined"
                        // options={item?.value ? [item!.value, ...deviceList] : deviceList}
                        options={devices}
                        fullWidth
                      />
                      <RHFTextField name={`ticket[${index}].solution`} label="Solution" fullWidth />
                      <RHFTextField
                        name={`ticket[${index}].description`}
                        label="Description"
                        fullWidth
                      />
                    </Box>
                  </Box>
                  <Box textAlign="end">
                    <Button variant="text" onClick={() => handleRemove(index)} color="error">
                      <Stack direction="row" spacing={1} alignItems="center">
                        Delete
                        <Iconify
                          icon="fluent:delete-12-regular"
                          sx={{ width: 20, height: 20, ml: 1, color: 'error.main' }}
                        />
                      </Stack>
                    </Button>
                  </Box>
                </Stack>
              </>
            ))}
            {errors.service?.message && (
              <Typography variant="body1" color="error">
                {`${errors.ticket?.message ?? 'Invalid'}`}
              </Typography>
            )}
          </Stack>
          <Stack mt={2} direction="row" justifyContent="start" textAlign="start" spacing={2}>
            <Button variant="outlined" color="info" onClick={handleAppend}>
              Add
            </Button>
          </Stack>
        </Card>
      )}
    </>
  );
}
