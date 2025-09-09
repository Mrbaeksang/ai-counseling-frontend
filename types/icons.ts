import type { MaterialCommunityIcons } from '@expo/vector-icons';

// MaterialCommunityIcons의 타입 안전한 이름 타입
export type IconName = keyof typeof MaterialCommunityIcons.glyphMap;
