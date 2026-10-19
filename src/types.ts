export type MatchStatus = 'finished' | 'live' | 'scheduled' | 'postponed';

export type Team = {
  id: string;
  name: string;
  city: string;
};

export type MatchScore = {
  home: number;
  away: number;
};

export type Match = {
  id: string;
  startsAt: string | null;
  status: MatchStatus;
  minute?: number;
  home: Team;
  away: Team;
  score: MatchScore | null;
};

export type MatchesResponse = {
  round: number;
  matches: Match[];
};

export type FilterType = 'all' | 'upcoming' | 'finished';
