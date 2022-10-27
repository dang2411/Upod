import { Stack, TextField } from '@mui/material';

type Props = {
  filterText: string;
  onFilterText: (value: string) => void;
};
export default function AccountTableToolbar({ filterText, onFilterText }: Props) {
  return (
    <Stack sx={{ px: 2.5, py: 3 }}>
      <TextField
        variant="outlined"
        fullWidth
        onChange={(event) => onFilterText(event.target.value)}
        value={filterText}
        label="Search"
        sx={{ maxWidth: 240, textTransform: 'capitalize' }}
      />
    </Stack>
  );
}
