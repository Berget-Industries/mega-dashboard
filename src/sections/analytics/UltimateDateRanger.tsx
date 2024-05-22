import React from 'react';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField, Box } from '@mui/material';

interface UltimateDateRangerProps {
  startDate: Date;
  setStartDate: (date: Date | null) => void;
}

const UltimateDateRanger: React.FC<UltimateDateRangerProps> = ({ startDate, setStartDate }) => (
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <Box display="flex" justifyContent="center" alignItems="center" mb={5} flexGrow={1}>
      <DesktopDatePicker
        value={startDate}
        onChange={setStartDate}
        slots={{ textField: TextField }}
        slotProps={{
          textField: {
            label: 'Välj datum',
          },
        }}
      />
    </Box>
  </LocalizationProvider>
);

export default UltimateDateRanger;
