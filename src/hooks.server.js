import { startDevCleanup } from '$lib/dataStore';

// Initialize development cleanup on server startup
if (process.env.NODE_ENV === 'development') {
  startDevCleanup();
} 