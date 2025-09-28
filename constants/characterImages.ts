// AI 캐릭터 이미지 매핑
export const characterImages: { [key: string]: ReturnType<typeof require> } = {
  'freud.jpg': require('@/assets/characters/freud.jpg'),
  'jung.jpg': require('@/assets/characters/jung.jpg'),
  'frankl.jpg': require('@/assets/characters/frankl.jpg'),
  'socrates.jpg': require('@/assets/characters/socrates.jpg'),
  'nietzsche.jpg': require('@/assets/characters/nietzsche.jpg'),
  'kierkegaard.jpg': require('@/assets/characters/kierkegaard.jpg'),
  'sartre.jpg': require('@/assets/characters/sartre.jpg'),
  'confucius.jpg': require('@/assets/characters/confucius.jpg'),
  'adler.jpg': require('@/assets/characters/adler.jpg'),
  'carnegie.jpg': require('@/assets/characters/carnegie.jpg'),
  'casanova.jpg': require('@/assets/characters/casanova.jpg'),
  'ovid.jpg': require('@/assets/characters/ovid.jpg'),
  'stendhal.jpg': require('@/assets/characters/stendhal.jpg'),
  'aristotle.jpg': require('@/assets/characters/aristotle.jpg'),
  'kant.jpg': require('@/assets/characters/kant.jpg'),
  'buddha.jpg': require('@/assets/characters/buddha.jpg'),
  'laozi.jpg': require('@/assets/characters/laozi.jpg'),
  // 현대 AI 캐릭터들 - .jpeg 확장자
  'gottman.jpeg': require('@/assets/characters/gottman.jpeg'),
  'covey.jpeg': require('@/assets/characters/covey.jpeg'),
  'duhigg.jpeg': require('@/assets/characters/duhigg.jpeg'),
  'david.jpeg': require('@/assets/characters/david.jpeg'),
  'freudenberger.jpeg': require('@/assets/characters/freudenberger.jpeg'),
  'kabatzinn.jpeg': require('@/assets/characters/kabatzinn.jpeg'),
  'newport.jpeg': require('@/assets/characters/newport.jpeg'),
  'duckworth.jpeg': require('@/assets/characters/duckworth.jpeg'),
  'brown.jpeg': require('@/assets/characters/brown.jpeg'),
  'naeunying.jpeg': require('@/assets/characters/naeunying.jpeg'),
};

// AI 캐릭터 이미지 가져오기 헬퍼 함수
export const getCharacterImage = (avatarUrl?: string) => {
  // avatarUrl이 없거나 string이 아닌 경우 null 반환
  if (!avatarUrl || typeof avatarUrl !== 'string') {
    return null;
  }

  // 로컬 경로에서 파일명 추출해서 require된 이미지 반환
  const imageName = avatarUrl.split('/').pop();
  return imageName ? characterImages[imageName] : null;
};
