export async function handler(event) {
  const appId = process.env.BACKENDLESS_APP_ID;
  const apiKey = process.env.BACKENDLESS_API_KEY;
  const baseUrl = process.env.BACKENDLESS_BASE_URL || 'https://api.backendless.com';

  const backendlessBase = `${baseUrl}/${appId}/${apiKey}`;

  const path = event.path.replace('/api', '');
  const query = event.queryStringParameters
    ? '?' + new URLSearchParams(event.queryStringParameters).toString()
    : '';

  const url = `${backendlessBase}${path}${query}`;

  const fetchOptions = {
    method: event.httpMethod,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (!['GET', 'HEAD'].includes(event.httpMethod) && event.body) {
    fetchOptions.body = event.body;
  }

  try {
    const response = await fetch(url, fetchOptions);
    const data = await response.text();

    return {
      statusCode: response.status,
      body: data,
    };
  } catch (error) {
    return {
      statusCode: 502,
      body: `Proxy error: ${error.message}`,
    };
  }
}
