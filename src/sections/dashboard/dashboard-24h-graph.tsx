import Box from '@mui/material/Box';
import CardHeader from '@mui/material/CardHeader';
import Card, { CardProps } from '@mui/material/Card';

import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  data: number[];
}

export default function Dashboard24hGraph({ title, subheader, data, ...other }: Props) {
  const chartOptions = useChart({
    legend: {
      position: 'top',
      horizontalAlign: 'right',
    },
    xaxis: {
      categories: [
        '00',
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
        '20',
        '21',
        '22',
        '23',
      ],
    },
  });

  return (
    <>
      <Card {...other}>
        <CardHeader title={title} subheader={subheader} />

        <Box sx={{ mt: 3, mx: 3 }}>
          <Chart
            dir="ltr"
            type="area"
            series={[{ data }]}
            options={chartOptions}
            width="100%"
            height={364}
          />
        </Box>
      </Card>
    </>
  );
}
