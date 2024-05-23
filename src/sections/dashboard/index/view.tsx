import { useMemo, useState, useCallback, useTransition } from 'react';
import {
  endOfWeek,
  endOfToday,
  endOfMonth,
  startOfWeek,
  startOfToday,
  startOfMonth,
} from 'date-fns';

import { Stack } from '@mui/system';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { useGetOrganizationMessages } from 'src/api/organization';
import { useSelectedOrgContext } from 'src/layouts/common/context/org-menu-context';

import { useSettingsContext } from 'src/components/settings';

import { IMessage } from 'src/types/message';

import DateRanger from '../dateRanger';
import Dashboard24hGraph from '../dashboard-24h-graph';
import DashboardOnlineStatus from '../dashboard-online-status';
import DashboardWidgetSummaryToday from '../dashboard-widget-summary-today';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function OverviewAnalyticsView() {
  const settings = useSettingsContext();
  const theme = useTheme();
  const [selectedOrg] = useSelectedOrgContext();
  const [isPending, startTransition] = useTransition();

  const [range, setRange] = useState<'today' | 'week' | 'month'>('today');

  const dates = useMemo(() => {
    switch (range) {
      case 'week':
        return { startDate: startOfWeek(new Date()), endDate: endOfWeek(new Date()) };
      case 'month':
        return { startDate: startOfMonth(new Date()), endDate: endOfMonth(new Date()) };
      default:
        return { startDate: startOfToday(), endDate: endOfToday() };
    }
  }, [range]);

  const { messages } = useGetOrganizationMessages({
    organization: selectedOrg?._id || '',
    startDate: dates.startDate,
    endDate: dates.endDate,
  });

  const filter = useMemo(() => messages, [messages]);

  const groupItemsByHour = useCallback(
    (items: IMessage[]) => {
      const allHours = Array.from({ length: 24 }, (_, hour) => ({
        hour,
        tickets: [] as IMessage[],
      }));

      items.forEach((item) => {
        const date = new Date(item.createdAt);
        if (date >= dates.startDate && date <= dates.endDate) {
          const hour = date.getHours();
          if (allHours[hour]) {
            allHours[hour].tickets.push(item);
          }
        }
      });

      return allHours;
    },
    [dates]
  );

  const handleRangeChange = useCallback(
    (newRange: React.SetStateAction<'today' | 'week' | 'month'>) => {
      startTransition(() => {
        setRange(newRange);
      });
    },
    [startTransition]
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Stack flexDirection="row">
        <Typography
          variant="h4"
          sx={{
            mb: { xs: 3, md: 5 },
          }}
          flexGrow={1}
        >
          Tjena, tjena 👋
          <br />
          Välkommen tillbaka!
        </Typography>
        <Stack justifyContent="space-between">
          <DateRanger range={range} setRange={handleRangeChange} />
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <DashboardWidgetSummaryToday
            unit="st"
            title="Hanterade ärenden"
            percent={2.6}
            total={filter.length}
            chart={{
              series: groupItemsByHour(filter).map((_) => _.tickets.length),
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <DashboardWidgetSummaryToday
            title="Sparad tid"
            unit=" minuter"
            percent={-0.1}
            total={
              (60 * 5 * filter.length -
                filter.reduce(
                  (c, n) => c + n.llmOutput.reduce((cc, nn) => cc + nn.responseTime / 1000, 0),
                  0
                )) /
              60
            }
            chart={{
              colors: [theme.palette.info.light, theme.palette.info.main],
              series: groupItemsByHour(filter).map((_) =>
                _.tickets.reduce(
                  (c, n) =>
                    c + n.llmOutput.reduce((cc, nn) => cc + nn.responseTime / (1000 * 60), 0),
                  0
                )
              ),
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <DashboardWidgetSummaryToday
            title="Förbrukning"
            unit=" tokens"
            percent={0.6}
            total={filter.reduce(
              (c, n) => c + n.llmOutput.reduce((cc, nn) => cc + nn.usedTokens.total, 0),
              0
            )}
            chart={{
              colors: [theme.palette.warning.light, theme.palette.warning.main],
              series: groupItemsByHour(filter).map((_) =>
                _.tickets.reduce(
                  (c, n) => c + n.llmOutput.reduce((cc, nn) => cc + nn.usedTokens.total, 0),
                  0
                )
              ),
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <Dashboard24hGraph
            title="Hanterade Ärenden"
            subheader="(+43%) mer än igår"
            data={groupItemsByHour(filter).map((_) => _.tickets.length)}
          />
        </Grid>
        <Grid xs={12} md={6} lg={4}>
          <DashboardOnlineStatus
            title="Status"
            total={714000}
            chart={{
              series: [{ label: 'Eva', value: 100 }],
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
