import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Divider, List } from 'react-native-paper';
import { spacing } from '@/constants/theme';

export interface ProfileMenuItem {
  id: string;
  title: string;
  description?: string;
  icon: string;
  onPress: () => void;
  showChevron?: boolean;
  textColor?: string;
}

interface ProfileInfoCardProps {
  items: ProfileMenuItem[];
  style?: object;
}

export const ProfileInfoCard = React.memo(({ items, style }: ProfileInfoCardProps) => {
  const renderItem = (item: ProfileMenuItem, index: number) => {
    const elements = [];

    // Divider 추가 (첫 번째 아이템이 아닌 경우)
    if (index > 0) {
      elements.push(<Divider key={`divider-${item.id}`} />);
    }

    // List.Item 추가
    elements.push(
      <List.Item
        key={`item-${item.id}`}
        title={item.title}
        description={item.description}
        titleStyle={item.textColor ? { color: item.textColor } : undefined}
        left={(props) => <List.Icon {...props} icon={item.icon} color={item.textColor} />}
        right={
          item.showChevron !== false
            ? (props) => <List.Icon {...props} icon="chevron-right" />
            : undefined
        }
        onPress={item.onPress}
      />,
    );

    return elements;
  };

  return (
    <Card style={[styles.card, style]}>
      {items.flatMap((item, index) => renderItem(item, index))}
    </Card>
  );
});

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
});
