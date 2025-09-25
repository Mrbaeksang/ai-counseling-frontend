import type { IMessage } from 'react-native-gifted-chat';
import type { MessageItem } from '@/services/sessions/types';

export type ChatMessage = IMessage & {
  original: MessageItem;
};
