import { useEffect, useState } from 'react';
import { getSessionMessages } from '@/services/sessions';
import type { MessageItem, Session } from '@/services/sessions/types';

interface CounselorInfo {
  counselorId?: number;
  counselorName?: string;
  avatarUrl?: string;
}

export const useSessionMessages = (sessionId: number) => {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [counselorInfo, setCounselorInfo] = useState<CounselorInfo | null>(null);
  const [sessionInfo, setSessionInfo] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        setIsLoading(true);
        const response = await getSessionMessages(sessionId);
        setMessages(response.content);

        // TODO: 세션 정보와 상담사 정보를 가져오는 API 호출 추가
        // 현재는 임시 데이터 설정
        setSessionInfo({
          sessionId,
          title: '상담 세션',
          counselorName: '철학자',
          lastMessageAt: new Date().toISOString(),
          isBookmarked: false,
        });

        setCounselorInfo({
          counselorName: '철학자',
          avatarUrl: '/assets/counselors/socrates.jpg',
        });
      } catch (_error) {
      } finally {
        setIsLoading(false);
      }
    };

    if (sessionId) {
      loadMessages();
    }
  }, [sessionId]);

  const addMessage = (message: MessageItem) => {
    setMessages((prev) => [...prev, message]);
  };

  return {
    messages,
    addMessage,
    counselorInfo,
    sessionInfo,
    isLoading,
  };
};
