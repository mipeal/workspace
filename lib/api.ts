import { 
  ScoreboardEntry,
  Challenge,
  SubmissionsResponse,
  ConfigResponse,
  ChallengeSolvesResponse
} from '@/types/ctfd';

interface ApiConfig {
  apiUrl: string;
  apiToken: string;
}

// Rate limit tracking
let lastRateLimitTime: number | null = null;
let rateLimitCount = 0;

async function fetchFromCTFd<T>(endpoint: string, config: ApiConfig): Promise<T> {
  // Check if we've been rate limited recently and slow down requests
  if (lastRateLimitTime && Date.now() - lastRateLimitTime < 60000) {
    // Wait longer if we've had multiple rate limits recently
    const delayTime = Math.min(1000 * Math.pow(2, rateLimitCount), 10000);
    await new Promise(resolve => setTimeout(resolve, delayTime));
  }
  
  const res = await fetch('/api/ctfd', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      endpoint,
      apiUrl: config.apiUrl,
      apiToken: config.apiToken,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
    
    // Track rate limiting
    if (res.status === 429 || (errorData && errorData.isRateLimit)) {
      lastRateLimitTime = Date.now();
      rateLimitCount = Math.min(rateLimitCount + 1, 5);
    }
    
    throw new Error(errorData.error || `Failed to fetch ${endpoint}: ${res.statusText}`);
  }

  const json = await res.json();
  
  if (json.success === false) {
    throw new Error(json.errors?.join(', ') || 'API request failed');
  }
  
  if (rateLimitCount > 0 && (!lastRateLimitTime || Date.now() - lastRateLimitTime > 60000)) {
    rateLimitCount = Math.max(0, rateLimitCount - 1);
  }
  
  return json.data;
}

async function fetchSubmissionsFromCTFd(endpoint: string, config: ApiConfig): Promise<SubmissionsResponse> {
  // Check if we've been rate limited recently and slow down requests
  if (lastRateLimitTime && Date.now() - lastRateLimitTime < 60000) {
    // Wait longer if we've had multiple rate limits recently
    const delayTime = Math.min(1000 * Math.pow(2, rateLimitCount), 10000);
    await new Promise(resolve => setTimeout(resolve, delayTime));
  }

  const res = await fetch('/api/ctfd', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      endpoint,
      apiUrl: config.apiUrl,
      apiToken: config.apiToken,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
    
    // Track rate limiting
    if (res.status === 429 || (errorData && errorData.isRateLimit)) {
      lastRateLimitTime = Date.now();
      rateLimitCount = Math.min(rateLimitCount + 1, 5);
    }
    
    throw new Error(errorData.error || `Failed to fetch ${endpoint}: ${res.statusText}`);
  }

  const json = await res.json();
  
  if (json.success === false) {
    throw new Error(json.errors?.join(', ') || 'API request failed');
  }
  
  if (rateLimitCount > 0 && (!lastRateLimitTime || Date.now() - lastRateLimitTime > 60000)) {
    rateLimitCount = Math.max(0, rateLimitCount - 1);
  }
  
  return json;
}

// Specific API functions - these now require config to be passed
export const getScoreboard = (config: ApiConfig): Promise<{ data: Record<string, ScoreboardEntry> }> => 
  fetchFromCTFd<Record<string, ScoreboardEntry>>('/scoreboard/top/10', config).then(data => ({ data }));

export const getFullScoreboard = (config: ApiConfig): Promise<ScoreboardEntry[]> => 
  fetchFromCTFd<ScoreboardEntry[]>('/scoreboard', config);

export const getChallenges = (config: ApiConfig): Promise<Challenge[]> => 
  fetchFromCTFd('/challenges', config);

export const getChallengeById = (id: number, config: ApiConfig): Promise<Challenge> => 
  fetchFromCTFd(`/challenges/${id}`, config);

export const getSubmissions = (config: ApiConfig, params?: {
  type?: 'correct' | 'incorrect';
  per_page?: number;
  page?: number;
  challenge_id?: number;
  user_id?: number;
}): Promise<SubmissionsResponse> => {
  const searchParams = new URLSearchParams();
  if (params?.type) searchParams.set('type', params.type);
  if (params?.per_page) searchParams.set('per_page', params.per_page.toString());
  if (params?.page) searchParams.set('page', params.page.toString());
  if (params?.challenge_id) searchParams.set('challenge_id', params.challenge_id.toString());
  if (params?.user_id) searchParams.set('user_id', params.user_id.toString());

  const endpoint = `/submissions${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  return fetchSubmissionsFromCTFd(endpoint, config);
};

export const getCtfConfig = async (key: string, config: ApiConfig): Promise<string | null> => {
  try {
    const response: ConfigResponse = await fetch('/api/ctfd', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: `/configs?key=${key}`,
        apiUrl: config.apiUrl,
        apiToken: config.apiToken,
      }),
    }).then(res => res.json());

    if (response.success && response.data && response.data.length > 0) {
      return response.data[0].value;
    }
    return null;
  } catch {
    return null;
  }
};

export const getCtfName = (config: ApiConfig): Promise<string | null> => 
  getCtfConfig('ctf_name', config);

export const getCtfStart = (config: ApiConfig): Promise<number | null> => 
  getCtfConfig('start', config).then(value => value ? parseInt(value, 10) : null);

export const getCtfEnd = (config: ApiConfig): Promise<number | null> => 
  getCtfConfig('end', config).then(value => value ? parseInt(value, 10) : null);

export const getChallengeSolves = async (config: ApiConfig, challengeId: number): Promise<ChallengeSolvesResponse> => {
  const res = await fetch('/api/ctfd', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      endpoint: `/challenges/${challengeId}/solves`,
      apiUrl: config.apiUrl,
      apiToken: config.apiToken,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `Failed to fetch challenge solves: ${res.statusText}`);
  }

  return res.json();
};