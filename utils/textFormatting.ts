/**
 * AI 메시지를 자연스럽게 포맷팅
 * 백엔드에서 줄바꿈 없이 오는 텍스트를 분석하여 적절히 줄바꿈 추가
 */
export function formatAIMessage(text: string): string {
  if (!text) return '';

  let formatted = text.trim();

  // 1. 문장 끝(마침표, 물음표, 느낌표) 뒤에 줄바꿈 추가 (단일 줄바꿈)
  formatted = formatted.replace(/([.!?])\s+/g, '$1\n');

  // 2. 접속사나 전환 표현 앞에 줄바꿈 추가 (중요한 전환점에만)
  formatted = formatted.replace(/\s+(그런데|하지만|그러나|따라서|그래서)/g, '\n$1');

  // 3. 긴 문장 후 추가 줄바꿈 (3문장 이상 연속된 경우만)
  const sentences = formatted.split(/(?<=[.!?])\n/);
  let result = '';
  let consecutiveCount = 0;

  sentences.forEach((sentence, index) => {
    result += sentence;
    consecutiveCount++;

    // 3문장마다 추가 줄바꿈
    if (consecutiveCount >= 3 && index < sentences.length - 1) {
      result += '\n\n';
      consecutiveCount = 0;
    } else if (index < sentences.length - 1) {
      result += '\n';
    }
  });
  formatted = result;

  // 4. 리스트나 나열 표현 처리 (리스트는 빈 줄로 구분)
  formatted = formatted.replace(/(첫째|둘째|셋째|넷째|다섯째|첫 번째|두 번째|세 번째)/g, '\n\n$1');
  formatted = formatted.replace(/(\d+\.|[\d가나다라마바사아자차카타파하]\))/g, '\n\n$1');

  // 5. 연속된 줄바꿈 정리 (최대 2개)
  formatted = formatted.replace(/\n{3,}/g, '\n\n');

  // 6. 시작과 끝 정리
  return formatted.trim();
}

/**
 * 사용자 메시지 포맷팅
 */
export function formatUserMessage(text: string): string {
  if (!text) return '';
  return text.trim();
}
