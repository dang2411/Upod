import { Button, Dialog, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
type Props = {
  open: boolean;
  onClose: VoidFunction;
  onReject: (description: string) => void;
  title: string;
};
export default function RequestRejectDialog({ open, onClose, onReject, title }: Props) {
  const [value, setValue] = useState('');

  const handleCancel = () => {
    onClose();
  };

  const handleConfirm = () => {
    onReject(value);
    onClose();
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <Stack direction="row" alignItems="center" justifyContent="start" sx={{ py: 2.5, px: 3 }}>
        <Typography variant="h6">{title}</Typography>
      </Stack>

      <Stack sx={{ p: 3, pt: 0 }} spacing={2}>
        <TextField
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Reason"
          multiline
          minRows={5}
        />
        <Stack sx={{ width: '100%' }} direction="row" justifyContent="end" spacing={2}>
          <Button onClick={handleCancel} color="error" variant="outlined">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleConfirm}>
            Confirm
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}
