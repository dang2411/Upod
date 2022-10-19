// @mui
import { Dialog, ListItemButton, Stack, Typography, Button, Chip } from '@mui/material';
import { Technician } from 'src/@types/user';
import Iconify from '../../../../components/Iconify';
import Scrollbar from '../../../../components/Scrollbar';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  selected: (selectedId: string) => boolean;
  onClose: VoidFunction;
  onSelect?: (value: Technician) => void;
  options: Technician[];
};

export default function RequestConfirmDialog({
  open,
  selected,
  onClose,
  onSelect,
  options,
}: Props) {
  const handleSelect = (value: Technician) => {
    if (onSelect) {
      onSelect(value);
    }
    onClose();
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ py: 2.5, px: 3 }}
      >
        <Typography variant="h6"> Select technician </Typography>

        <Button
          size="small"
          variant="outlined"
          startIcon={<Iconify icon="eva:plus-fill" />}
          sx={{ alignSelf: 'flex-end' }}
        >
          Add New
        </Button>
      </Stack>

      <Scrollbar sx={{ p: 1.5, pt: 0, maxHeight: 80 * 8 }}>
        {options.map((technician: Technician) => (
          <ListItemButton
            key={technician.id}
            selected={selected(technician.id)}
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
    </Dialog>
  );
}
