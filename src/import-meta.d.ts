interface ImportMetaEnv {
  readonly NG_APP_BACKENDLESS_APP_ID: string;
  readonly NG_APP_BACKENDLESS_API_KEY: string;
  readonly NG_APP_BACKENDLESS_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
