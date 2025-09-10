import { useEffect, useState } from 'react';
import { getSessionDetail, getSessionMessages } from '@/services/sessions';
import type { MessageItem, Session } from '@/services/sessions/types';

interface CounselorInfo {
  counselorId?: number;
  counselorName?: string;
  avatarUrl?: string;
}

export const useSessionMessages = (sessionId: number, initialCounselorInfo?: CounselorInfo) => {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [counselorInfo, setCounselorInfo] = useState<CounselorInfo | null>(
    initialCounselorInfo || null,
  );
  const [sessionInfo, setSessionInfo] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        setIsLoading(true);

        // 메시지 목록과 세션 정보를 병렬로 가져오기
        const [messagesResponse, sessionDetail] = await Promise.all([
          getSessionMessages(sessionId),
          getSessionDetail(sessionId),
        ]);

        setMessages(messagesResponse.content);

        // 실제 세션 정보 설정
        if (sessionDetail) {
          setSessionInfo(sessionDetail);

          // 백엔드에서 제공하는 avatarUrl 직접 사용
          // counselorId는 백엔드에서 안 보내주므로 초기값 사용
          setCounselorInfo({
            counselorId: initialCounselorInfo?.counselorId,
            counselorName: sessionDetail.counselorName,
            avatarUrl: sessionDetail.avatarUrl || undefined,
          });
        } else if (initialCounselorInfo) {
          // 세션 정보를 못 가져왔지만 초기 정보가 있는 경우
          setCounselorInfo(initialCounselorInfo);
        }
      } catch (_error: unknown) {
        // 에러 발생 시 초기 정보 유지
        if (initialCounselorInfo) {
          setCounselorInfo(initialCounselorInfo);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (sessionId) {
      loadMessages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
