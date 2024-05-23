import React from 'react';

import { Container, ButtonGroup, Button } from '@mui/material';

type RangeType = 'today' | 'week' | 'month';

interface DateRangerProps {
  range: RangeType;
  setRange: React.Dispatch<React.SetStateAction<RangeType>>;
}

const DateRanger: React.FC<DateRangerProps> = React.memo(({ range, setRange }: DateRangerProps) => (
  <Container>
    <ButtonGroup>
      <Button
        onClick={() => setRange('today')}
        variant={range === 'today' ? 'contained' : 'outlined'}
      >
        Idag
      </Button>
      <Button
        onClick={() => setRange('week')}
        variant={range === 'week' ? 'contained' : 'outlined'}
      >
        Den här veckan
      </Button>
      <Button
        onClick={() => setRange('month')}
        variant={range === 'month' ? 'contained' : 'outlined'}
      >
        Den här månaden
      </Button>
    </ButtonGroup>
  </Container>
));

export default DateRanger;
