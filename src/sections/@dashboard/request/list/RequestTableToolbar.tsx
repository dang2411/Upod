import { capitalize, ListItem, Stack, TextField } from '@mui/material';

type Props = {
  filterText: string;
  onFilterText: (value: string) => void;
  filterStatus: string;
  onChangeFilterStatus: (value: string) => void;
};
const STATUS_OPTIONS = [
  'all',
  'pending',
  'preparing',
  'resolving',
  'resolved',
  'warning',
  'rejected',
  'canceled',
  'completed'
];
export default function RequestTableToolbar({
  filterText,
  onFilterText,
  filterStatus,
  onChangeFilterStatus,
}: Props) {
  return (
    <Stack sx={{ px: 2.5, py: 3 }} spacing={2} direction="row">
      <TextField
        label="Status"
        select
        sx={{ minWidth: 260 }}
        value={filterStatus}
        onChange={(event) => onChangeFilterStatus(event.target.value)}
        SelectProps={{ native: true }}
      >
        {STATUS_OPTIONS.map((value) => (
          <ListItem component="option" key={value} value={value}>
            {capitalize(value)}
          </ListItem>
        ))}
      </TextField>
      <TextField
        variant="outlined"
        fullWidth
        onChange={(event) => onFilterText(event.target.value)}
        value={filterText}
        label="Search"
        sx={{ textTransform: 'capitalize' }}
      />
    </Stack>
  );
}
