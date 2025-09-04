export interface ScoreboardEntry {
  id: number;
  account_url: string;
  name: string;
  score: number;
  bracket_id: number | null;
  bracket_name: string | null;
  solves: {
    challenge_id: number;
    account_id: number;
    team_id: number | null;
    user_id: number;
    value: number;
    date: string;
  }[];
}

export interface Challenge {
  id: number;
  name: string;
  value: number;
  description: string;
  category: string;
  state: 'visible' | 'hidden';
  max_attempts: number;
  type: string;
  solves: number;
  solved_by_me: boolean;
  files: string;
  tags: number;
  hints: {
    id: number;
    cost: number;
    content: string;
  };
}

export interface Submission {
  id: number;
  user_id: number;
  user: {
    id: number;
    name: string;
  };
  challenge: {
    id: number;
    value: number;
    name: string;
    category: string;
  };
  team_id: number | null;
  date: string;
  provided: string;
  type: 'correct' | 'incorrect';
  challenge_id: number;
  team: any | null;
  ip: string;
}

export interface SubmissionsResponse {
  meta: {
    pagination: {
      page: number;
      next: number | null;
      prev: number | null;
      pages: number;
      per_page: number;
      total: number;
    };
  };
  success: boolean;
  data: Submission[];
}

export interface ConfigItem {
  id: number;
  value: string;
  key: string;
}

export interface ConfigResponse {
  success: boolean;
  data: ConfigItem[];
}

export interface ChallengeSolve {
  account_id: number;
  name: string;
  date: string;
  account_url: string;
}

export interface ChallengeSolvesResponse {
  success: boolean;
  data: ChallengeSolve[];
}