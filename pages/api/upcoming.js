export default async function handler(req, res) {
  try {
    const upcomingEndpoint = process.env.UPCOMING_ENDPOINT_URL;
    
    if (!upcomingEndpoint) {
      return res.status(500).json({ 
        error: 'UPCOMING_ENDPOINT_URL environment variable is not configured' 
      });
    }

    const response = await fetch(upcomingEndpoint, {
      method: req.method,
      headers: {
        'User-Agent': 'XML-Proxy/1.0',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `Failed to fetch from upcoming endpoint: ${response.statusText}` 
      });
    }

    const data = await response.text();
    
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.status(200).send(data);
    
  } catch (error) {
    console.error('Upcoming endpoint error:', error);
    res.status(500).json({ 
      error: 'Failed to proxy upcoming endpoint request' 
    });
  }
}