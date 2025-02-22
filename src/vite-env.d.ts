/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_ENV: 'development' | 'staging' | 'production'
    readonly VITE_SUPABASE_URL: string
    readonly VITE_SUPABASE_ANON_KEY: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
  
  declare const __APP_ENV__: ImportMetaEnv['VITE_APP_ENV']
  