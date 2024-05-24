import React from 'react';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField, Box } from '@mui/material';

interface UltimateDateRangerProps {
  startDate: Date;
  setStartDate: (date: Date | null) => void;
  endDate: Date;
  setEndDate: (date: Date | null) => void;
}

const UltimateDateRanger: React.FC<UltimateDateRangerProps> = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => (
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <Box display="flex" justifyContent="center" alignItems="center" mb={5} flexGrow={1} gap={2}>
      <DesktopDatePicker
        value={startDate}
        onChange={setStartDate}
        slots={{ textField: TextField }}
        slotProps={{
          textField: {
            label: 'Startdatum',
          },
        }}
      />
      <DesktopDatePicker
        value={endDate}
        onChange={setEndDate}
        slots={{ textField: TextField }}
        slotProps={{
          textField: {
            label: 'Slutdatum',
          },
        }}
      />
    </Box>
  </LocalizationProvider>
);

export default UltimateDateRanger;
