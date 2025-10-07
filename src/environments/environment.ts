export const environment = {
  production: true,
  backendless: {
    appId: import.meta.env['NG_APP_BACKENDLESS_APP_ID'] || '',
    apiKey: import.meta.env['NG_APP_BACKENDLESS_API_KEY'] || '',
    baseUrl: import.meta.env['NG_APP_BACKENDLESS_BASE_URL'] || '',
  },
};
