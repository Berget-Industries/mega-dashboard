import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { IMessage } from 'src/types/message';

import { alpha, useTheme } from '@mui/material/styles';
import { useSettingsContext } from 'src/components/settings';
import { useGetOrganizationMessages } from 'src/api/organization';
import { useEffect, useState } from 'react';
import { startOfToday, endOfToday } from 'date-fns';
import { useSelectedOrgContext } from 'src/layouts/common/context/org-menu-context';

import DashboardOnlineStatus from '../dashboard-online-status';
import DashboardWidgetSummaryToday from '../dashboard-widget-summary-today';
import Dashboard24hGraph from '../dashboard-24h-graph';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function OverviewAnalyticsView() {
  const settings = useSettingsContext();
  const theme = useTheme();
  const { selectedOrg } = useSelectedOrgContext();

  const { messages, messagesLoading, messagesError, messagesValidating, messagesEmpty } =
    useGetOrganizationMessages({
      organization: selectedOrg?._id || '',
      startDate: startOfToday(),
      endDate: endOfToday(),
    });

  const [filter, setFilter] = useState<IMessage[]>([]);

  const isToday = (_: Date | string) => {
    const today = new Date();
    const __ = typeof _ === 'string' ? new Date(_) : _;

    const isSameDay = __.getDate() === today.getDate();
    const isSameMonth = __.getMonth() === today.getMonth();
    const isSameYear = __.getFullYear() === today.getFullYear();

    // console.log(__, __.getDate(), __.getMonth(), __.getFullYear());

    const result = isSameDay && isSameMonth && isSameYear;

    return result;
  };

  function groupItemsByHour(items: IMessage[]) {
    const today = new Date();
    const currentHour = today.getHours();
    const allHours: { hour: number; tickets: IMessage[] }[] = [...Array(currentHour + 1)].map(
      (_) => ({
        hour: _,
        tickets: [],
      })
    );

    items.forEach((item) => {
      const date = new Date(item.createdAt);
      if (isToday(date)) {
        const hour = date.getHours();
        console.log(hour, item);
        allHours[hour].tickets.push(item);
      }
    });

    return allHours;
  }

  useEffect(() => {
    if (messages.length > 0) {
      const newFilter = messages.filter((_) => isToday(_.createdAt));
      setFilter(newFilter);
    }
  }, [messages]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography
        variant="h4"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        Tjena, tjena 👋
        <br />
        Välkommen tillbaka!
      </Typography>

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
              options: {
                // labels: ['Progress'],
              },
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
