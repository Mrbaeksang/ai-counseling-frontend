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
  return (
    <Card style={[styles.card, style]}>
      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          {index > 0 && <Divider />}
          <List.Item
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
          />
        </React.Fragment>
      ))}
    </Card>
  );
});

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
});
