import { StyleSheet, Text, View } from 'react-native';
import { Match } from '../types';
import { formatMatchDate, getStatusInfo } from '../utils/formatters';
import { FavoriteButton } from './FavoriteButton';

type Props = {
  match: Match;
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

export function MatchCard({ match, isFavorite, onToggleFavorite }: Props) {
  const statusInfo = getStatusInfo(match.status, match.minute);
  const formattedDate = formatMatchDate(match.startsAt);

  // Важно: проверяем score на null, так как счёт 0:0 валиден, а 0 в JS приводится к false
  const hasScore =
    match.score !== null &&
    typeof match.score.home === 'number' &&
    typeof match.score.away === 'number';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.meta}>
          <View style={[styles.badge, styles[`badge_${statusInfo.badgeStyle}`]]}>
            <Text style={[styles.badgeText, styles[`badgeText_${statusInfo.badgeStyle}`]]}>
              {statusInfo.label}
            </Text>
          </View>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>

        <FavoriteButton active={isFavorite} onPress={onToggleFavorite} />
      </View>

      <View style={styles.teamsRow}>
        <View style={styles.teamColumn}>
          <Text style={styles.teamName}>{match.home.name}</Text>
          <Text style={styles.cityName}>{match.home.city}</Text>
        </View>

        <View style={styles.scoreContainer}>
          {hasScore ? (
            <Text style={styles.score}>
              {match.score!.home} : {match.score!.away}
            </Text>
          ) : (
            <Text style={styles.noScore}>— : —</Text>
          )}
        </View>

        <View style={[styles.teamColumn, styles.teamColumnRight]}>
          <Text style={[styles.teamName, styles.textRight]}>{match.away.name}</Text>
          <Text style={[styles.cityName, styles.textRight]}>{match.away.city}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingBottom: 8,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badge_live: {
    backgroundColor: '#fee2e2',
  },
  badge_finished: {
    backgroundColor: '#f3f4f6',
  },
  badge_scheduled: {
    backgroundColor: '#e0f2fe',
  },
  badge_postponed: {
    backgroundColor: '#fef3c7',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  badgeText_live: {
    color: '#dc2626',
  },
  badgeText_finished: {
    color: '#4b5563',
  },
  badgeText_scheduled: {
    color: '#0284c7',
  },
  badgeText_postponed: {
    color: '#d97706',
  },
  date: {
    fontSize: 12,
    color: '#6b7280',
  },
  teamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamColumn: {
    flex: 1,
  },
  teamColumnRight: {
    alignItems: 'flex-end',
  },
  teamName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  cityName: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  textRight: {
    textAlign: 'right',
  },
  scoreContainer: {
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  score: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  noScore: {
    fontSize: 16,
    fontWeight: '500',
    color: '#9ca3af',
  },
});
