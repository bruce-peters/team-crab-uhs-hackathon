export * from './canvas';

export interface ExtensionMessage {
  type: 'GET_ASSIGNMENTS' | 'GET_COURSES' | 'GEMINI_QUERY' | 'SETTINGS_UPDATE';
  payload?: unknown;
}

export interface ExtensionResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}