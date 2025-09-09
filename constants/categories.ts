// 카테고리 영어 -> 한글 매핑
export const categoryTranslations: { [key: string]: string } = {
  // 백엔드에서 실제로 오는 카테고리 (소문자)
  self: '자아·정체성',
  emotion: '감정·정서',
  stress: '스트레스',
  life: '삶의 의미',
  work: '진로·직장',
  anxiety: '불안',
  depression: '우울',
  relationship: '인간관계',
  family: '가족',
  trauma: '트라우마',
  habit: '습관·중독',

  // 추가 매핑 (혹시 모를 대비)
  selfEsteem: '자존감',
  identity: '정체성',
  addiction: '중독',
  loss: '상실·애도',
  sleep: '수면',
  anger: '분노',
  fear: '공포',

  // 대문자 매핑 (혹시 모를 대비)
  SELF: '자아·정체성',
  EMOTION: '감정·정서',
  STRESS: '스트레스',
  LIFE: '삶의 의미',
  WORK: '진로·직장',
  ANXIETY: '불안',
  DEPRESSION: '우울',
  RELATIONSHIP: '인간관계',
  FAMILY: '가족',
  TRAUMA: '트라우마',
  HABIT: '습관·중독',
};

// 카테고리를 한글로 변환하는 헬퍼 함수
export const translateCategory = (category: string): string => {
  const trimmed = category.trim();

  // 먼저 정확한 매칭 시도
  if (categoryTranslations[trimmed]) {
    return categoryTranslations[trimmed];
  }

  // 대문자 변환 시도
  const uppercase = trimmed.toUpperCase();
  if (categoryTranslations[uppercase]) {
    return categoryTranslations[uppercase];
  }

  // camelCase를 UPPER_SNAKE_CASE로 변환 시도
  const snakeCase = trimmed
    .replace(/([A-Z])/g, '_$1')
    .toUpperCase()
    .replace(/^_/, '');
  if (categoryTranslations[snakeCase]) {
    return categoryTranslations[snakeCase];
  }

  // 매칭 실패 시 원본 반환
  return trimmed;
};
