import { IChatMessage, IChatParticipant } from 'src/types/chat';

// ----------------------------------------------------------------------

type Props = {
  message: IChatMessage;
  currentUserId: string;
  participants: IChatParticipant[];
};

export default function useGetMessage({ message, participants, currentUserId }: Props) {
  const sender = participants.find((participant) => participant.id === message.senderId);

  console.log(participants);
  console.log(message);

  const senderDetails =
    message.senderId === 'eva'
      ? {
          type: 'me',
        }
      : {
          avatarUrl: sender?.avatarUrl,
          firstName: sender?.name.split(' ')[0],
        };

  const me = senderDetails.type === 'me';

  const hasImage = message.contentType === 'image';

  return {
    hasImage,
    me,
    senderDetails,
  };
}
