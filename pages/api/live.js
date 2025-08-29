export default async function handler(req, res) {
  try {
    const liveEndpoint = process.env.LIVE_ENDPOINT_URL;
    
    if (!liveEndpoint) {
      return res.status(500).json({ 
        error: 'LIVE_ENDPOINT_URL environment variable is not configured' 
      });
    }

    const response = await fetch(liveEndpoint, {
      method: req.method,
      headers: {
        'User-Agent': 'XML-Proxy/1.0',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `Failed to fetch from live endpoint: ${response.statusText}` 
      });
    }

    const data = await response.text();
    
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.status(200).send(data);
    
  } catch (error) {
    console.error('Live endpoint error:', error);
    res.status(500).json({ 
      error: 'Failed to proxy live endpoint request' 
    });
  }
}