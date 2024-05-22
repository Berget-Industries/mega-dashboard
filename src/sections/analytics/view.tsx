import { useCallback, useEffect, useState } from 'react';
import {
  startOfMonth,
  endOfMonth,
  getMonth,
  endOfToday,
  getYear,
  startOfDay,
  endOfDay,
} from 'date-fns';

import { Stack } from '@mui/system';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useSelectedOrgContext } from 'src/layouts/common/context/org-menu-context';

import { useSettingsContext } from 'src/components/settings';

import { IMessage } from 'src/types/message';

import UltimateDateRanger from './UltimateDateRanger';
import AnalyticsSimpleWidget from './analytics-simple-widget';
import AnalyticsTicketTypesPie from './analytics-ticket-types-pie';
import { useGetOrganizationMessages } from '../../api/organization';
import AnalyticsTicketsTimeRangeChart from './analytics-tickets-time-range-chart';

// ----------------------------------------------------------------------

export default function OverviewAnalyticsView() {
  const settings = useSettingsContext();
  const [selectedOrg] = useSelectedOrgContext();

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(endOfToday());

  const handleStartDateChange = (date: Date | null) => {
    if (date) {
      setStartDate(date);
    }
  };

  const { messages } = useGetOrganizationMessages({
    organization: selectedOrg?._id || '',
    startDate: startOfDay(startDate),
    endDate: endOfDay(startDate),
  });

  const [savedTime, setSavedTime] = useState<number>(0);
  const [usedTokens, setUsedTokens] = useState<number>(0);
  const [averageResponse, setAverageResponse] = useState<number>(0);
  const [numberOfProcessedTickets, setNumberOfProcessedTickets] = useState<number>(0);
  const [sortedTickets, setSortedTickets] = useState<{
    typeNewBooking: IMessage[][];
    typeChangeBooking: IMessage[][];
    typeRemoveBooking: IMessage[][];
    typeQuestion: IMessage[][];
  }>({
    typeNewBooking: [],
    typeChangeBooking: [],
    typeRemoveBooking: [],
    typeQuestion: [],
  });

  const groupItemsByDay = useCallback(
    (items: IMessage[]) => {
      const start = startOfMonth(startDate);
      const end = endOfMonth(endDate);
      const daysInRange = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      const allDays = Array.from({ length: daysInRange }, (_, index) => {
        const day = new Date(start.getTime() + index * 1000 * 60 * 60 * 24);
        return { day, tickets: [] as IMessage[] };
      });

      items.forEach((item) => {
        const date = new Date(item.createdAt);
        const dayIndex = Math.floor((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        if (dayIndex >= 0 && dayIndex < daysInRange) {
          allDays[dayIndex].tickets.push(item);
        }
      });

      return allDays;
    },
    [startDate, endDate]
  );

  useEffect(() => {
    if (!messages) return;

    const splitByMonth = groupItemsByDay(messages);
    setSortedTickets({
      typeNewBooking: splitByMonth.map((_) =>
        _.tickets.filter((message) =>
          message.llmOutput.some((llmOutput) =>
            llmOutput.actions.find((x) => x.type === 'skapa-reservation')
          )
        )
      ),
      typeChangeBooking: splitByMonth.map((_) =>
        _.tickets.filter((message) =>
          message.llmOutput.some((llmOutput) =>
            llmOutput.actions.find((x) => x.type === 'redigera-reservation')
          )
        )
      ),
      typeRemoveBooking: splitByMonth.map((_) =>
        _.tickets.filter((message) =>
          message.llmOutput.some((llmOutput) =>
            llmOutput.actions.find((x) => x.type === 'avboka-reservation')
          )
        )
      ),
      typeQuestion: splitByMonth.map((_) =>
        _.tickets.filter((message) =>
          message.llmOutput.some((llmOutput) => llmOutput.actions.length === 0)
        )
      ),
    });

    const newSavedTime = messages.reduce(
      (c, n) => c + n.llmOutput.reduce((cc, nn) => cc + nn.responseTime / 1000, 0),
      0
    );
    const newUsedTokens = messages.reduce(
      (c, n) => c + n.llmOutput.reduce((cc, nn) => cc + nn.usedTokens.total, 0),
      0
    );
    const newAverageResponseTime =
      messages.reduce(
        (c, n) => c + n.llmOutput.reduce((cc, nn) => cc + nn.responseTime / 1000, 0),
        0
      ) / messages.length;
    const newNumberOfProcessedTickets = messages.length;

    setSavedTime(newSavedTime);
    setUsedTokens(newUsedTokens);
    setAverageResponse(newAverageResponseTime);
    setNumberOfProcessedTickets(newNumberOfProcessedTickets);
  }, [messages, groupItemsByDay]);

  const getLabels = () => {
    const start = startOfMonth(startDate);
    const end = endOfMonth(endDate);
    const daysInRange = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    return Array.from({ length: daysInRange }, (_, index) => {
      const day = new Date(start.getTime() + index * 1000 * 60 * 60 * 24);
      return `${getYear(day)}/${getMonth(day) + 1}/${day.getDate()}`;
    });
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
        <Typography
          variant="h4"
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          Statistik 📈📉
        </Typography>
        <Stack>
          <UltimateDateRanger startDate={startDate} setStartDate={handleStartDateChange} />
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsSimpleWidget
            title="Hanterade ärenden"
            total={numberOfProcessedTickets !== 0 ? numberOfProcessedTickets : '-'}
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsSimpleWidget
            title="Sparad tid"
            unit="min"
            total={
              numberOfProcessedTickets !== 0
                ? (60 * 5 * numberOfProcessedTickets - savedTime) / 60
                : '-'
            }
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsSimpleWidget
            title="Använda tokens"
            total={usedTokens !== 0 ? usedTokens : '-'}
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsSimpleWidget
            unit="s"
            title="Genomsnittlig svarstid"
            total={averageResponse !== 0 ? averageResponse : '-'}
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
          />
        </Grid>

        <Grid xs={12} md={8}>
          <AnalyticsTicketsTimeRangeChart
            title="Hanterade Ärenden"
            subheader=""
            chart={{
              labels: getLabels(),
              series: [
                {
                  name: 'Skapade bokningar',
                  type: 'line',
                  fill: 'solid',
                  data: sortedTickets.typeNewBooking.map((_) => _.length),
                },
                {
                  name: 'Bokningsändringar',
                  type: 'line',
                  fill: 'solid',
                  data: sortedTickets.typeChangeBooking.map((_) => _.length),
                },
                {
                  name: 'Frågor',
                  type: 'line',
                  fill: 'solid',
                  data: sortedTickets.typeQuestion.map((_) => _.length),
                },
                {
                  name: 'Avbokningar',
                  type: 'line',
                  fill: 'solid',
                  data: sortedTickets.typeRemoveBooking.map((_) => _.length),
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AnalyticsTicketTypesPie
            title="Ärendefördelning"
            chart={{
              series: [
                {
                  label: 'Skapade bokningar',
                  value: sortedTickets.typeNewBooking
                    .map((_) => _.length)
                    .reduce((c, n) => c + n, 0),
                },
                {
                  label: 'Frågor',
                  value: sortedTickets.typeQuestion.map((_) => _.length).reduce((c, n) => c + n, 0),
                },
                {
                  label: 'Avbokningar',
                  value: sortedTickets.typeRemoveBooking
                    .map((_) => _.length)
                    .reduce((c, n) => c + n, 0),
                },
                {
                  label: 'Bokningsändringar',
                  value: sortedTickets.typeRemoveBooking
                    .map((_) => _.length)
                    .reduce((c, n) => c + n, 0),
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={8}>
          <AnalyticsTicketsTimeRangeChart
            title="Använda Tokens"
            subheader="asjdjklahsdjkha"
            chart={{
              labels: getLabels(),
              series: [
                {
                  name: 'Input',
                  type: 'line',
                  fill: 'solid',
                  data: groupItemsByDay(messages).map((_) =>
                    _.tickets.reduce(
                      (c, n) => c + n.llmOutput.reduce((cc, nn) => cc + nn.usedTokens.input, 0),
                      0
                    )
                  ),
                },
                {
                  name: 'Output',
                  type: 'line',
                  fill: 'solid',
                  data: groupItemsByDay(messages).map((_) =>
                    _.tickets.reduce(
                      (c, n) => c + n.llmOutput.reduce((cc, nn) => cc + nn.usedTokens.output, 0),
                      0
                    )
                  ),
                },
                {
                  name: 'Total',
                  type: 'line',
                  fill: 'solid',
                  data: groupItemsByDay(messages).map((_) =>
                    _.tickets.reduce(
                      (c, n) => c + n.llmOutput.reduce((cc, nn) => cc + nn.usedTokens.total, 0),
                      0
                    )
                  ),
                },
              ],
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
