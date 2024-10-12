// src/config/apiConfig.ts

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000'; // Fallback to localhost for local development

export default BASE_URL;
