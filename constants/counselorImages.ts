// 상담사 이미지 매핑
export const counselorImages: { [key: string]: ReturnType<typeof require> } = {
  'freud.jpg': require('@/assets/counselors/freud.jpg'),
  'jung.jpg': require('@/assets/counselors/jung.jpg'),
  'frankl.jpg': require('@/assets/counselors/frankl.jpg'),
  'socrates.jpg': require('@/assets/counselors/socrates.jpg'),
  'nietzsche.jpg': require('@/assets/counselors/nietzsche.jpg'),
  'kierkegaard.jpg': require('@/assets/counselors/kierkegaard.jpg'),
  'sartre.jpg': require('@/assets/counselors/sartre.jpg'),
  'confucius.jpg': require('@/assets/counselors/confucius.jpg'),
  'adler.jpg': require('@/assets/counselors/adler.jpg'),
  'carnegie.jpg': require('@/assets/counselors/carnegie.jpg'),
  'casanova.jpg': require('@/assets/counselors/casanova.jpg'),
  'ovid.jpg': require('@/assets/counselors/ovid.jpg'),
  'stendhal.jpg': require('@/assets/counselors/stendhal.jpg'),
  'aristotle.jpg': require('@/assets/counselors/aristotle.jpg'),
  'kant.jpg': require('@/assets/counselors/kant.jpg'),
  'buddha.jpg': require('@/assets/counselors/buddha.jpg'),
  'laozi.jpg': require('@/assets/counselors/laozi.jpg'),
  // 현대 상담사들 - .jpeg 확장자
  'gottman.jpeg': require('@/assets/counselors/gottman.jpeg'),
  'covey.jpeg': require('@/assets/counselors/covey.jpeg'),
  'duhigg.jpeg': require('@/assets/counselors/duhigg.jpeg'),
  'david.jpeg': require('@/assets/counselors/david.jpeg'),
  'freudenberger.jpeg': require('@/assets/counselors/freudenberger.jpeg'),
  'kabatzinn.jpeg': require('@/assets/counselors/kabatzinn.jpeg'),
  'newport.jpeg': require('@/assets/counselors/newport.jpeg'),
  'duckworth.jpeg': require('@/assets/counselors/duckworth.jpeg'),
  'brown.jpeg': require('@/assets/counselors/brown.jpeg'),
  'naeunying.jpeg': require('@/assets/counselors/naeunying.jpeg'),
};

// 상담사 이미지 가져오기 헬퍼 함수
export const getCounselorImage = (avatarUrl?: string) => {
  // 로컬 경로에서 파일명 추출해서 require된 이미지 반환
  const imageName = avatarUrl?.split('/').pop();
  return imageName && counselorImages[imageName];
};
