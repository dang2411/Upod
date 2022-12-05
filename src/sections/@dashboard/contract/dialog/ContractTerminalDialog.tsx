import { LoadingButton } from '@mui/lab';
import { Dialog, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
type Props = {
  open: boolean;
  onClose: VoidFunction;
  onReject: (description: string) => void;
  text: string ;
  title: string;
};
export default function ContractTerminalDialog({ open, onClose, onReject, title, text }: Props) {
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
          placeholder={text}
          multiline
          minRows={5}
        />
        <Stack sx={{ width: '100%' }} direction="row" justifyContent="end" spacing={2}>
          <LoadingButton onClick={handleCancel} color="error" variant="outlined">
            Cancel
          </LoadingButton>
          <LoadingButton variant="contained" onClick={handleConfirm}>
            Confirm
          </LoadingButton>
        </Stack>
      </Stack>
    </Dialog>
  );
}
