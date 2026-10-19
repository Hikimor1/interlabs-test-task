import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MatchCard } from '../components/MatchCard';
import { UpdatedAgo } from '../components/UpdatedAgo';
import { MATCHES_URL } from '../config';
import { useFavorites } from '../hooks/useFavorites';
import { FilterType, Match, MatchesResponse } from '../types';

const FILTERS: { type: FilterType; label: string }[] = [
  { type: 'all', label: 'Все' },
  { type: 'upcoming', label: 'Предстоящие' },
  { type: 'finished', label: 'Завершённые' },
];

export function MatchesScreen() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [round, setRound] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');

  const { isFavorite, toggle } = useFavorites();

  const loadMatches = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const response = await fetch(MATCHES_URL);
      if (!response.ok) {
        throw new Error(`Ошибка загрузки данных (${response.status})`);
      }
      const data: MatchesResponse = await response.json();
      setMatches(data.matches ?? []);
      setRound(data.round ?? null);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить данные');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  const filteredMatches = useMemo(() => {
    if (filter === 'upcoming') {
      // К предстоящим относим несыгранные матчи, а также live (актуальные для тура)
      return matches.filter(
        (m) => m.status === 'scheduled' || m.status === 'live' || m.status === 'postponed'
      );
    }
    if (filter === 'finished') {
      return matches.filter((m) => m.status === 'finished');
    }
    return matches;
  }, [matches, filter]);

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0284c7" />
        <Text style={styles.loadingText}>Загружаем матчи...</Text>
      </View>
    );
  }

  if (error && matches.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Что-то пошло не так</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={() => loadMatches()}>
          <Text style={styles.retryButtonText}>Повторить</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Матчи тура</Text>
          {round !== null && <Text style={styles.roundSubtitle}>{round} тур</Text>}
        </View>

        <View style={styles.refreshBlock}>
          {lastUpdated && <UpdatedAgo since={lastUpdated} />}
          <Pressable
            style={({ pressed }) => [styles.refreshBtn, pressed && styles.refreshBtnPressed]}
            onPress={() => loadMatches(true)}
            hitSlop={8}
          >
            <Text style={styles.refreshBtnText}>Обновить</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.filterContainer}>
        {FILTERS.map((item) => {
          const isActive = filter === item.type;
          return (
            <Pressable
              key={item.type}
              style={[styles.filterTab, isActive && styles.filterTabActive]}
              onPress={() => setFilter(item.type)}
            >
              <Text
                style={[styles.filterTabText, isActive && styles.filterTabTextActive]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={filteredMatches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MatchCard
            match={item}
            isFavorite={isFavorite(item.id)}
            onToggleFavorite={() => toggle(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadMatches(true)}
            tintColor="#0284c7"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Матчи не найдены</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingHorizontal: 16,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  roundSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  refreshBlock: {
    alignItems: 'flex-end',
    gap: 4,
  },
  refreshBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#e0f2fe',
    borderRadius: 6,
  },
  refreshBtnPressed: {
    opacity: 0.7,
  },
  refreshBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0284c7',
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    padding: 3,
    marginBottom: 12,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  filterTabActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6b7280',
  },
  filterTabTextActive: {
    color: '#111827',
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#9ca3af',
  },
});
