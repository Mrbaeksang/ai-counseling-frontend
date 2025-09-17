// 카테고리 타입 정의
export type CategoryType = {
  id: string;
  label: string;
  icon: string;
  color: string;
  gradient: [string, string];
};

// 카테고리 정의 (12개) - 백엔드 InitDataConfig와 일치
export const CATEGORIES: CategoryType[] = [
  {
    id: 'self',
    label: '자기이해·자존감',
    icon: 'head-dots-horizontal',
    color: '#8B5CF6',
    gradient: ['#8B5CF6', '#A78BFA'],
  },
  {
    id: 'emotion',
    label: '감정·정서',
    icon: 'emoticon-neutral',
    color: '#EC4899',
    gradient: ['#EC4899', '#F9A8D4'],
  },
  {
    id: 'anxiety',
    label: '불안',
    icon: 'alert-circle',
    color: '#F59E0B',
    gradient: ['#F59E0B', '#FCD34D'],
  },
  {
    id: 'depression',
    label: '우울',
    icon: 'weather-cloudy',
    color: '#6B7280',
    gradient: ['#6B7280', '#9CA3AF'],
  },
  {
    id: 'stress',
    label: '스트레스·번아웃',
    icon: 'lightning-bolt',
    color: '#EF4444',
    gradient: ['#EF4444', '#F87171'],
  },
  {
    id: 'trauma',
    label: '트라우마·상실',
    icon: 'bandage',
    color: '#7C3AED',
    gradient: ['#7C3AED', '#A78BFA'],
  },
  {
    id: 'relationship',
    label: '관계·연애',
    icon: 'heart-multiple',
    color: '#F472B6',
    gradient: ['#F472B6', '#FBCFE8'],
  },
  {
    id: 'family',
    label: '가족·양육',
    icon: 'home-heart',
    color: '#10B981',
    gradient: ['#10B981', '#6EE7B7'],
  },
  {
    id: 'life',
    label: '학업·진로',
    icon: 'school',
    color: '#3B82F6',
    gradient: ['#3B82F6', '#93C5FD'],
  },
  {
    id: 'work',
    label: '직장·업무',
    icon: 'briefcase',
    color: '#6366F1',
    gradient: ['#6366F1', '#A5B4FC'],
  },
  {
    id: 'habit',
    label: '습관·중독',
    icon: 'sync',
    color: '#14B8A6',
    gradient: ['#14B8A6', '#5EEAD4'],
  },
  {
    id: 'philosophy',
    label: '명상·치유',
    icon: 'meditation',
    color: '#A855F7',
    gradient: ['#A855F7', '#C084FC'],
  },
];

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
