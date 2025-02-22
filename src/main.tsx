import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { validateEnvironmentVariables } from '@/lib/env-validation'

console.log('[main] Starting app initialization...');
console.log('[main] Environment:', import.meta.env.VITE_APP_ENV);

// Validate environment variables before any other initialization
try {
  validateEnvironmentVariables();
  console.log('[main] Environment validation successful');
} catch (error) {
  // Create an error element to show if validation fails
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = 'padding: 20px; color: red; text-align: center;';
  errorDiv.innerHTML = `Environment Error: ${error.message}`;
  document.body.appendChild(errorDiv);
  console.error('[main] Environment validation failed:', error);
  throw error; // Re-throw to also show in console
}

// Only render if validation passes
createRoot(document.getElementById("root")!).render(<App />);
