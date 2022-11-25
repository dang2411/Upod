// @mui
import {
  Box,
  CircularProgress,
  Dialog,
  ListItemButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { Technician } from 'src/@types/user';
import axios from 'src/utils/axios';
import Scrollbar from '../../../../components/Scrollbar';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  onSelect?: (value: Technician) => void;
  id: string | null;
  isMaintain?: boolean;
};

export default function TechnicianDialog({
  open,
  onClose,
  onSelect,
  id,
  isMaintain = false,
}: Props) {
  const handleSelect = (value: Technician) => {
    if (onSelect) {
      onSelect(value);
    }
    onClose();
  };

  const [loading, setLoading] = useState(true);

  const [data, setData] = useState<Technician[]>([]);

  const [search, setSearch] = useState('');

  const fetch = useCallback(async () => {
    try {
      let response: any;
      if (isMaintain) {
        response = await axios.get('/api/requests/get_technicians_by_id_report_service', {
          params: { id },
        });
      } else {
        response = await axios.get('/api/requests/get_technicians_by_id_request', {
          params: { id },
        });
      }
      setLoading(false);
      if (response.data) {
        setData(
          response.data.map((x) => ({
            id: x.id,
            tech_name: x.technician_name,
            number_of_requests: x.number_of_requests,
            // skills: x.service.map((e) => e.service_name),
          }))
        );
      }
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const options = data.filter((option: Technician) => {
    var result = option!.tech_name!.toLowerCase().includes(search.toLowerCase());
    if (option.number_of_requests) {
      return result || option.number_of_requests;
    }
    return result;
  });

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  if (id === null) {
    return <div />;
  }
  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <Stack direction="row" alignItems="center" justifyContent="start" sx={{ py: 2.5, px: 3 }}>
        <Typography variant="h6"> Select technician </Typography>
      </Stack>

      <TextField
        sx={{ mx: 3, mb: 2 }}
        value={search}
        onChange={handleSearch}
        variant="outlined"
        placeholder="Technician"
      />
      {loading && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          width={'100%'}
          minHeight={'300px'}
        >
          <CircularProgress />
        </Box>
      )}
      {!loading && (
        <Scrollbar sx={{ p: 1.5, pt: 0, maxHeight: 80 * 6 }}>
          {options.map((technician: Technician) => (
            <ListItemButton
              key={technician.id}
              onClick={() => handleSelect(technician)}
              sx={{
                p: 1.5,
                borderRadius: 1,
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}
            >
              <Typography variant="subtitle2">{technician.tech_name}</Typography>

              {/* <Typography
                variant="caption"
                sx={{ color: 'primary.main', my: 0.5, fontWeight: 'fontWeightMedium' }}
              >
                {technician.skills.join(', ')}
              </Typography> */}

              <Typography variant="body2" sx={{ p: 1.5, pt: 0, color: 'black' }}>
                Requests in month: 
                {technician.number_of_requests || 0}
              </Typography>            
            </ListItemButton>
          ))}
        </Scrollbar>
      )}
    </Dialog>
  );
}
