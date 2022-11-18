import { Stack, Typography, Chip, SxProps } from '@mui/material';
import { MaintainStatus } from 'src/@types/maintain';

const parseStatus = (status: MaintainStatus) => {
  if (status.toLowerCase() === 'problem') {
    return <Chip label="Problem" />;
  } else if (status.toLowerCase() === 'noproblem') {
    return <Chip label="No Problem" />;
  } else if (status.toLowerCase() === 'processing') {
    return <Chip label="Processing" color="info" />;
  }
  return <Chip label="Default" />;
};

type TitleSectionProps = {
  label: string;
  status: MaintainStatus;
  sx?: SxProps;
};

export function TitleSection({ label, status, sx }: TitleSectionProps) {
  return (
    <Stack direction="row" spacing={2} sx={sx}>
      <Typography variant="subtitle1">{label}</Typography>
      {parseStatus(status)}
    </Stack>
  );
}
