import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FavoritesList } from '@/components/favorites/FavoritesList';
import { useFavoriteCounselors, useToggleFavorite } from '@/hooks/useCounselors';
import useAuthStore from '@/store/authStore';

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuthStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: favoriteCounselors, isLoading, refetch } = useFavoriteCounselors();

  const toggleFavoriteMutation = useToggleFavorite();

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

  const handleFavoriteToggle = useCallback(
    (counselorId: number) => {
      toggleFavoriteMutation.mutate({ counselorId, isFavorite: true });
    },
    [toggleFavoriteMutation],
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FavoritesList
        favorites={favoriteCounselors || []}
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
    backgroundColor: '#F9FAFB',
  },
});
