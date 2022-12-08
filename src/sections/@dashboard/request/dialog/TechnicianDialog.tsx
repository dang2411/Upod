// @mui
import {
  Box,
  Chip,
  CircularProgress,
  Dialog,
  ListItemButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { Technician } from 'src/@types/user';
import Iconify from 'src/components/Iconify';
import axios from 'src/utils/axios';
import { pxToRem } from 'src/utils/getFontValue';
import Scrollbar from '../../../../components/Scrollbar';

// ----------------------------------------------------------------------

type SkillChipProps = {
  text: string;
};

const SkillChip = ({ text }: SkillChipProps) => (
  <Chip
    label={
      <Typography variant="caption" fontSize={pxToRem(11)} color="grey.600">
        {text}
      </Typography>
    }
    size="small"
  />
);

type Props = {
  open: boolean;
  onClose: VoidFunction;
  onSelect?: (value: Technician) => void;
  id: string | null;
  agencyId: string | null;
  serviceId: string | null;
  isAdminCreate?: boolean;
  ismaintain?: boolean;
};

export default function TechnicianDialog({
  open,
  onClose,
  onSelect,
  id,
  agencyId,
  serviceId,
  ismaintain = false,
  isAdminCreate = false,
}: Props): JSX.Element {
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
      if (isAdminCreate) {
        response = await axios.get('/api/requests/get_technicians_by_id_report_service', {
          params: { agency_id: agencyId, service_id: serviceId },
        });
      } else if (ismaintain) {
        response = await axios.get(
          '/api/maintenance_schedules/get_technician_maintenance_schedule_by_id',
          {
            params: { id },
          }
        );
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
            skills: x.skills,
            area: x.area,
            number_of_requests: x.number_of_requests || 0,
            // skills: x.service.map((e) => e.service_name),
          }))
        );
      }
    } catch (error) {
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, serviceId, agencyId]);

  useEffect(() => {
    if (open) fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, serviceId, agencyId]);

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
            // eslint-disable-next-line react/jsx-key
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
              <Typography variant="subtitle2" sx={{ pb: 1 }}>
                {technician.tech_name}
              </Typography>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Iconify icon="material-symbols:check-circle-outline" />
                <Typography variant="body2">
                  {technician.number_of_requests
                    ? `Resolve ${technician.number_of_requests!} requests in the current month.`
                    : `Have not resolved any request.`}
                </Typography>
              </Stack>
              {technician.area && (
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Iconify icon="material-symbols:location-on" />
                  <Typography variant="body2">{technician.area}</Typography>
                </Stack>
              )}
              {technician.skills && (
                <Box display="flex" flexWrap="wrap" gap={1} pt={1}>
                  {Array.from(technician.skills || []).map((x, index) => (
                    <SkillChip text={x} key={index} />
                  ))}
                </Box>
              )}
            </ListItemButton>
          ))}
        </Scrollbar>
      )}
    </Dialog>
  );
}
