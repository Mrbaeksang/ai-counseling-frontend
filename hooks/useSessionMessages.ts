import { useEffect, useState } from 'react';
import { getSessionDetail, getSessionMessages } from '@/services/sessions';
import type { MessageItem, Session } from '@/services/sessions/types';

interface characterInfo {
  characterId?: number;
  characterName?: string;
  avatarUrl?: string;
}

export const useSessionMessages = (sessionId: number, initialcharacterInfo?: characterInfo) => {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [characterInfo, setcharacterInfo] = useState<characterInfo | null>(
    initialcharacterInfo || null,
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
          // characterId는 백엔드에서 안 보내주므로 초기값 사용
          setcharacterInfo({
            characterId: initialcharacterInfo?.characterId,
            characterName: sessionDetail.characterName,
            avatarUrl: sessionDetail.avatarUrl || undefined,
          });
        } else if (initialcharacterInfo) {
          // 세션 정보를 못 가져왔지만 초기 정보가 있는 경우
          setcharacterInfo(initialcharacterInfo);
        }
      } catch (error: unknown) {
        void error; // 명시적 무시
        // 에러 발생 시 초기 정보 유지
        if (initialcharacterInfo) {
          setcharacterInfo(initialcharacterInfo);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (sessionId) {
      loadMessages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, initialcharacterInfo]);

  const addMessage = (message: MessageItem) => {
    setMessages((prev) => [...prev, message]);
  };

  const replaceLastMessage = (message: MessageItem) => {
    setMessages((prev) => {
      if (prev.length === 0) {
        return [message];
      }
      const next = [...prev];
      next[next.length - 1] = message;
      return next;
    });
  };

  const removeLastMessage = () => {
    setMessages((prev) => prev.slice(0, -1));
  };

  return {
    messages,
    addMessage,
    replaceLastMessage,
    removeLastMessage,
    characterInfo,
    sessionInfo,
    isLoading,
  };
};
