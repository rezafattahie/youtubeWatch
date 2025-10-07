export async function handler(event) {
  const backendlessBase = 'https://api.backendless.com/ED04C550-BD52-4725-B4B2-A6EA07C2BB58/3949C5B6-D203-4C3B-82F6-3CACBACE5474';

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
