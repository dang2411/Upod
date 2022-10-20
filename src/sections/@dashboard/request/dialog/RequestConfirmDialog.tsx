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
};

export default function RequestConfirmDialog({ open, onClose, onSelect }: Props) {
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
      const response = await axios.get('/api/technicians/get_list_technicians');
      if (response.data) {
        setData(
          response.data.map((x) => ({
            id: x.id,
            name: x.technician_name,
            address: x.address,
            skills: x.service.map((e) => e.service_name),
          }))
        );
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const options = data.filter((option: Technician) => {
    var result = option.name.toLowerCase().includes(search.toLowerCase());
    if (option.address) {
      return result || option.address.toLowerCase().includes(search.toLowerCase());
    }
    return result;
  });

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

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
        <Scrollbar sx={{ p: 1.5, pt: 0, maxHeight: 80 * 8 }}>
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
              <Typography variant="subtitle2">{technician.name}</Typography>

              <Typography
                variant="caption"
                sx={{ color: 'primary.main', my: 0.5, fontWeight: 'fontWeightMedium' }}
              >
                {technician.skills.join(', ')}
              </Typography>

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {technician.address}
              </Typography>
            </ListItemButton>
          ))}
        </Scrollbar>
      )}
    </Dialog>
  );
}
