import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import { _bookings, _bookingNew, _bookingReview } from 'src/_mock';
import {
  BookingIllustration,
  CheckInIllustration,
  CheckoutIllustration,
  UploadIllustration,
} from 'src/assets/illustrations';
import { useGetOrganizationConversations, useGetOrganizationMessages } from 'src/api/organization';

import { useSettingsContext } from 'src/components/settings';

import { useSelectedOrgContext } from 'src/layouts/common/context/org-menu-context';

import TicketSummaryCard from '../ticket-summary-card';
import TicketsTable from '../ticket-table';

// ----------------------------------------------------------------------

const SPACING = 3;

export default function OverviewBookingView() {
  const theme = useTheme();

  const settings = useSettingsContext();

  const [selectedOrg] = useSelectedOrgContext();

  const {
    conversations,
    conversationsLoading,
    conversationsError,
    conversationsValidating,
    conversationsEmpty,
  } = useGetOrganizationConversations(selectedOrg?._id || '');

  const [numberOfProcessedTickets, setNumberOfProcessedTickets] = useState<number>(0);
  const [numberOfTicketsInQueue, setNumberOfTicketsInQueue] = useState<number>(0);
  const [numberOfSentMail, setNumberOfSentMail] = useState<number>(0);

  useEffect(() => {
    const filteredConversations = conversations.filter((conversation) =>
      conversation.messages.some((message) =>
        message.llmOutput.some((output) => output.name === 'chain-starter')
      )
    );

    setNumberOfProcessedTickets(conversations.length);
    setNumberOfSentMail(filteredConversations.length);
    setNumberOfTicketsInQueue(0);
  }, [conversations]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={SPACING} disableEqualOverflow>
        <Grid xs={12} md={4}>
          <TicketSummaryCard
            title="Hanterade ärenden"
            total={numberOfProcessedTickets}
            icon={<BookingIllustration />}
          />
        </Grid>
        <Grid xs={12} md={4}>
          <TicketSummaryCard
            title="Väntar på hantering"
            total={numberOfTicketsInQueue}
            icon={<CheckoutIllustration />}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <TicketSummaryCard
            title="Mail utskickat"
            total={numberOfSentMail}
            icon={<UploadIllustration />}
          />
        </Grid>

        <Grid xs={12}>
          <TicketsTable conversations={conversations} />
        </Grid>
      </Grid>
    </Container>
  );
}
