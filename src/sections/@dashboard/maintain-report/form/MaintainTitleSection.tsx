import { Stack, Typography, Chip, SxProps } from '@mui/material';
import { capitalCase } from 'change-case';

const parseStatus = (status: any) => {
  if (status.toLowerCase() === 'scheduled') {
    return <Chip label="Scheduled" color="info" />;
  } else if (status.toLowerCase() === 'notified') {
    return <Chip label="Notified" color="warning" />;
  } else if (status.toLowerCase() === 'maintaining') {
    return <Chip label="Maintaining" color="success" />;
  } else if (status.toLowerCase() === 'completed') {
    return <Chip label="Complete" />;
  }
  return <Chip label="Default" />;
};

type TitleSectionProps = {
  label: string;
  status: any;
  sx?: SxProps;
};

export function MaintainTitleSection({ label, status, sx }: TitleSectionProps) {
  return (
    <Stack direction="row" spacing={2} sx={sx} alignItems="center">
      <Typography variant="subtitle1">{capitalCase(label)}</Typography>
      {parseStatus(status)}
    </Stack>
  );
}
