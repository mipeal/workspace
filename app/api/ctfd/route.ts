import { NextRequest, NextResponse } from 'next/server';

// Helper function to add exponential backoff retry logic
async function fetchWithRetry(
  url: string, 
  options: RequestInit, 
  retries = 3, 
  backoff = 300
): Promise<Response> {
  try {
    const response = await fetch(url, options);
    
    // If we get rate limited (429) and have retries left, retry with backoff
    if (response.status === 429 && retries > 0) {
      console.warn(`Rate limited when accessing ${url}. Retrying after ${backoff}ms...`);
      
      // Wait for backoff period
      await new Promise(resolve => setTimeout(resolve, backoff));
      
      // Retry with increased backoff (exponential)
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    
    return response;
  } catch (error) {
    if (retries > 0) {
      console.warn(`Error fetching ${url}, retrying...`, error);
      
      // Wait for backoff period
      await new Promise(resolve => setTimeout(resolve, backoff));
      
      // Retry with increased backoff
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { endpoint, apiUrl, apiToken } = await request.json();

    if (!endpoint || !apiUrl || !apiToken) {
      return NextResponse.json(
        { error: 'Missing required parameters: endpoint, apiUrl, or apiToken' },
        { status: 400 }
      );
    }

    // Construct the full URL
    const fullUrl = `${apiUrl}/api/v1${endpoint}`;

    // Use our retry function with exponential backoff
    const response = await fetchWithRetry(
      fullUrl,
      {
        headers: {
          'Authorization': `Token ${apiToken}`,
          'Content-Type': 'application/json',
        },
        // Add cache control headers to respect rate limits better
        cache: 'no-cache',
      },
      3, // 3 retries
      300 // Starting backoff of 300ms
    );

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `CTFd API Error: ${response.status} ${response.statusText}`;
      
      // Special handling for rate limit errors
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        errorMessage = `Rate limit exceeded. ${retryAfter ? `Try again after ${retryAfter} seconds.` : 'Try increasing the refetch interval in Dev Tools.'}`; 
      }
      
      return NextResponse.json(
        { 
          error: errorMessage, 
          details: errorText,
          isRateLimit: response.status === 429
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // CTFd wraps responses in a 'data' property, but we'll return the full response
    // to allow the client to handle success/error states
    return NextResponse.json(data);

  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Internal proxy error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'This endpoint only accepts POST requests' },
    { status: 405 }
  );
}
