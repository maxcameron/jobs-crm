// Will contain validation functions and type guards
export function validateEnvironmentVariables(): void {
    const requiredVars = [
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY',
      'VITE_APP_ENV'
    ];
  
    const missingVars = requiredVars.filter(
      (key) => !import.meta.env[key]
    );
  
    if (missingVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingVars.join(', ')}`
      );
    }
  }  