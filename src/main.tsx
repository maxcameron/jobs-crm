import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { validateEnvironmentVariables } from '@/lib/env-validation'

// Validate environment variables before rendering
try {
  validateEnvironmentVariables();
} catch (error) {
  // Create an error element to show if validation fails
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = 'padding: 20px; color: red; text-align: center;';
  errorDiv.innerHTML = `Environment Error: ${error.message}`;
  document.body.appendChild(errorDiv);
  throw error; // Re-throw to also show in console
}

// Only render if validation passes
createRoot(document.getElementById("root")!).render(<App />);
