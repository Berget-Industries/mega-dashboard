import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { IMessage } from 'src/types/message';

import { alpha, useTheme } from '@mui/material/styles';
import { useSettingsContext } from 'src/components/settings';
import { startOfMonth, endOfMonth, getMonth, lastDayOfMonth, getDay, getDate } from 'date-fns';

import AnalyticsTicketTypesPie from './analytics-ticket-types-pie';
import AnalyticsSimpleWidget from './analytics-simple-widget';
import AnalyticsTicketsTimeRangeChart from './analytics-tickets-time-range-chart';

import { useGetOrganizationMessages } from '../../api/organization';

// ----------------------------------------------------------------------

const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = getMonth(today);
const currentDay = getDate(today);
const lastDayOfCurrentMonth = lastDayOfMonth(currentMonth).getDate();
const firstDayOfCurrentMonth = 1;

export default function OverviewAnalyticsView() {
  const settings = useSettingsContext();
  const theme = useTheme();

  const startDate = new Date(currentYear, currentMonth, firstDayOfCurrentMonth, 0, 0, 0);
  const endDate = new Date(currentYear, currentMonth, lastDayOfCurrentMonth, 23, 59, 59);

  const { messages, messagesLoading, messagesError, messagesValidating, messagesEmpty } =
    useGetOrganizationMessages({
      organization: '6567688da895a324a728385d',
      startDate,
      endDate,
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

  function groupItemsByDay(items: any[]) {
    const allDays: { day: number; tickets: IMessage[] }[] = [...Array(currentDay)].map((_) => ({
      day: new Date().setDate(_),
      tickets: [],
    }));

    items.forEach((item) => {
      const date = new Date(item.createdAt);
      const day = date.getDate();
      allDays[day - 1].tickets.push(item);
    });

    return allDays;
  }

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
  }, [messages]);

  const getLabels = () =>
    [...Array(lastDayOfCurrentMonth)].map((_, i) => `${currentYear}/${currentMonth + 1}/${i + 1}`);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography
        variant="h4"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        Statistik 📈📉
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsSimpleWidget
            title="Hanterade ärenden"
            total={numberOfProcessedTickets}
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsSimpleWidget
            title="Sparad tid"
            unit="min"
            total={(60 * 5 * numberOfProcessedTickets - savedTime) / 60}
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsSimpleWidget
            title="Använda tokens"
            total={usedTokens}
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsSimpleWidget
            unit="s"
            title="Genomsnittlig svarstid"
            total={averageResponse}
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
