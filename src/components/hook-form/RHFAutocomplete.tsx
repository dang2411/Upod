// form
import { Controller, useFormContext } from 'react-hook-form';
// @mui
import { Autocomplete, TextField } from '@mui/material';

// ----------------------------------------------------------------------

// type IProps = {
//   name: string;
//   options: any[];
//   [key: string]: any;
// };

// type Props = IProps & TextFieldProps;

export default function RHFAutocomplete({
  name,
  keyIdentifier = 'id',
  valueIdentifier = 'name',
  options,
  label,
  disabled = false,
  ...other
}: any) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <Autocomplete
          isOptionEqualToValue={(option: any, value: any) => option[keyIdentifier] === value[valueIdentifier]}
          getOptionLabel={(option: any) => option[valueIdentifier]}
          options={options}
          onChange={(event: any, newValue: any) => {
            onChange(newValue);
          }}
          disableClearable
          disabled={disabled}
          value={value}
          renderInput={(params) => (
            <TextField
              {...other}
              {...params}
              error={!!error}
              helperText={error?.message}
              label={label}
              InputProps={{
                ...params.InputProps,
                endAdornment: <>{params.InputProps.endAdornment}</>,
              }}
            />
          )}
        />
      )}
    />
  );
}
