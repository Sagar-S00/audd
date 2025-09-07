export const COLORS = {
  ORANGE: '#FF9D23',
  TEAL_START: '#00E0C3',
  TEAL_END: '#00F7FF',
  PURPLE: '#8230FF',
  DARK_PURPLE: '#3A1D64',
  WHITE: '#FFFFFF',
  BLACK: '#000000',
}

export const API_ENDPOINTS = {
  CHECK_URL: '/url',
  GET_UID: '/get_uid',
  GET_SID: 'https://proxy-gamma-bice.vercel.app/get-sid/yato',
  WEBSOCKET: 'wss://yoee.2o8bynlc5s.workers.dev'
}

export const MESSAGE_TYPES = {
  SYSTEM: 'system',
  USER: 'user',
  WELCOME: 'welcome'
}

export const WEBSOCKET_EVENTS = {
  USER_LIST: [102, 101],
  USER_JOIN_LEAVE: [106, 107],
  VOICE_CHAT_TOKEN: 201,
  CHAT_MESSAGE: 1000
}