import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

type Props = {
  open: boolean;
  onConfirm: any;
  onClose: any;
  title: string;
  text: string;
};

export default function ConfirmDialog({ open, onConfirm, onClose, title, text }: Props) {
  return (
    <>
      <Dialog open={open} keepMounted onClose={onClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{text}</DialogContentText>
        </DialogContent>
        <DialogActions>   
          <Button variant="outlined" color="error" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={onConfirm}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
