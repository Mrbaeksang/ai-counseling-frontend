import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FavoritesList } from '@/components/favorites/FavoritesList';
import { useFavoriteCharacters, useToggleFavorite } from '@/hooks/useCharacters';
import useAuthStore from '@/store/authStore';

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuthStore();
  const theme = useTheme();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: favoriteCharacters, isLoading, refetch } = useFavoriteCharacters();

  const toggleFavoriteMutation = useToggleFavorite();

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

  const handleFavoriteToggle = useCallback(
    (characterId: number) => {
      toggleFavoriteMutation.mutate({ characterId, isFavorite: true });
    },
    [toggleFavoriteMutation],
  );

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, backgroundColor: theme.colors.background },
      ]}
    >
      <FavoritesList
        favorites={favoriteCharacters || []}
        isLoading={isLoading}
        isRefreshing={isRefreshing}
        isAuthenticated={isAuthenticated}
        onRefresh={handleRefresh}
        onFavoriteToggle={handleFavoriteToggle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
