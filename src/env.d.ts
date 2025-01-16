// Define the type of the environment variables.
declare interface Env {
  readonly NODE_ENV: string;
  NG_APP_EBIRD_API_KEY: string;
}

// use ImportMeta to access the environment variables.
declare interface ImportMeta {
  readonly env: Env;
}
