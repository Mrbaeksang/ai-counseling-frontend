export type CategoryType = {
  id: string;
  label: string;
  icon: string;
  color: string;
  gradient: [string, string];
};

export const CATEGORIES: CategoryType[] = [
  {
    id: 'self',
    label: '자기돌봄',
    icon: 'head-dots-horizontal',
    color: '#8B5CF6',
    gradient: ['#8B5CF6', '#A78BFA'],
  },
  {
    id: 'emotion',
    label: '감정정리',
    icon: 'emoticon-neutral',
    color: '#EC4899',
    gradient: ['#EC4899', '#F9A8D4'],
  },
  {
    id: 'anxiety',
    label: '마음 가라앉히기',
    icon: 'alert-circle',
    color: '#F59E0B',
    gradient: ['#F59E0B', '#FCD34D'],
  },
  {
    id: 'depression',
    label: '기분전환',
    icon: 'weather-cloudy',
    color: '#6B7280',
    gradient: ['#6B7280', '#9CA3AF'],
  },
  {
    id: 'stress',
    label: '숨 고르기',
    icon: 'lightning-bolt',
    color: '#EF4444',
    gradient: ['#EF4444', '#F87171'],
  },
  {
    id: 'trauma',
    label: '마음정리',
    icon: 'bandage',
    color: '#7C3AED',
    gradient: ['#7C3AED', '#A78BFA'],
  },
  {
    id: 'relationship',
    label: '사람관계',
    icon: 'heart-multiple',
    color: '#F472B6',
    gradient: ['#F472B6', '#FBCFE8'],
  },
  {
    id: 'family',
    label: '우리집 이야기',
    icon: 'home-heart',
    color: '#10B981',
    gradient: ['#10B981', '#6EE7B7'],
  },
  {
    id: 'life',
    label: '일상 아이디어',
    icon: 'school',
    color: '#3B82F6',
    gradient: ['#3B82F6', '#93C5FD'],
  },
  {
    id: 'work',
    label: '일터 토크',
    icon: 'briefcase',
    color: '#6366F1',
    gradient: ['#6366F1', '#A5B4FC'],
  },
  {
    id: 'habit',
    label: '생활 루틴',
    icon: 'sync',
    color: '#14B8A6',
    gradient: ['#14B8A6', '#5EEAD4'],
  },
  {
    id: 'philosophy',
    label: '생각 탐험',
    icon: 'meditation',
    color: '#A855F7',
    gradient: ['#A855F7', '#C084FC'],
  },
];

export const categoryTranslations: Record<string, string> = {
  self: '자기돌봄',
  emotion: '감정정리',
  stress: '숨 고르기',
  life: '일상 아이디어',
  work: '일터 토크',
  anxiety: '마음 가라앉히기',
  depression: '기분전환',
  relationship: '사람관계',
  family: '우리집 이야기',
  trauma: '마음정리',
  habit: '생활 루틴',
  philosophy: '생각 탐험',
  selfEsteem: '자존감 톡',
  identity: '정체성 이야기',
  addiction: '습관 돌아보기',
  loss: '마음 다독이기',
  sleep: '편안한 밤',
  anger: '화 풀기',
  fear: '용기 내보기',
  SELF: '자기돌봄',
  EMOTION: '감정정리',
  STRESS: '숨 고르기',
  LIFE: '일상 아이디어',
  WORK: '일터 토크',
  ANXIETY: '마음 가라앉히기',
  DEPRESSION: '기분전환',
  RELATIONSHIP: '사람관계',
  FAMILY: '우리집 이야기',
  TRAUMA: '마음정리',
  HABIT: '생활 루틴',
};

export const categoryEmojis: Record<string, string> = {
  self: '🪞',
  emotion: '😊',
  stress: '🧘',
  life: '💡',
  work: '💼',
  anxiety: '😰',
  depression: '🌈',
  relationship: '💕',
  family: '🏠',
  trauma: '💔',
  habit: '🔄',
  philosophy: '💭',
};

export const translateCategory = (category: string): string => {
  const trimmed = category.trim();

  if (categoryTranslations[trimmed]) {
    return categoryTranslations[trimmed];
  }

  const uppercase = trimmed.toUpperCase();
  if (categoryTranslations[uppercase]) {
    return categoryTranslations[uppercase];
  }

  const snakeCase = trimmed
    .replace(/([A-Z])/g, '_$1')
    .toUpperCase()
    .replace(/^_/, '');
  if (categoryTranslations[snakeCase]) {
    return categoryTranslations[snakeCase];
  }

  return trimmed;
};

export const getCategoryWithEmoji = (category: string): string => {
  const emoji = categoryEmojis[category] || '📌';
  const label = translateCategory(category);
  return `${emoji} ${label}`;
};
