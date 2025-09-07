# Anime Café Chatroom - React Version

A modern React application that replicates an anime-themed virtual café chatroom interface with real-time chat functionality.

## Features

- **Mobile-first Design**: Optimized for mobile devices with iOS-style interface
- **Real-time Chat**: WebSocket-based live messaging system
- **Voice Chat Integration**: Audio mixing and effects support
- **Anime Theme**: Cozy café atmosphere with warm color palette
- **Interactive Elements**: Mute controls, online status indicators, custom avatar frames
- **Multi-language Support**: English, Japanese, Korean text support

## Tech Stack

- **React 18** with Vite
- **Tailwind CSS** for styling
- **Heroicons** for UI icons
- **WebSocket** for real-time communication
- **Custom API integration** for room management

## Project Structure

```
src/
├── components/
│   ├── StatusBar.jsx          # iOS-style status bar
│   ├── RoomHeader.jsx         # Room title and controls
│   ├── HostSection.jsx        # Host information display
│   ├── ParticipantGrid.jsx    # User avatars grid
│   ├── ChatSection.jsx        # Chat messages display
│   ├── RulesBox.jsx          # Room rules display
│   ├── BottomNavigation.jsx   # Bottom controls
│   ├── AdBanner.jsx          # Advertisement banner
│   ├── URLInputPage.jsx      # Initial URL input
│   └── ChatroomInterface.jsx  # Main chatroom layout
├── services/
│   ├── APIService.js         # API communication
│   └── WebSocketService.js   # WebSocket management
├── hooks/
│   └── useWebSocket.js       # WebSocket React hook
└── utils/
    ├── constants.js          # App constants
    └── helpers.js           # Utility functions
```

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## Usage

1. **Enter Room URL**: Input an Amino Apps chat room URL on the initial page
2. **Join Room**: The app will automatically connect to the WebSocket and join the voice chat
3. **Interact**: 
   - Tap user avatars to mute/unmute
   - Use the Talk button to speak
   - View chat messages in real-time
   - Access room rules and settings

## API Integration

The app integrates with existing backend endpoints:
- `/url` - Validate and parse room URLs
- `/get_uid` - Get user ID from profile URL
- WebSocket connection for real-time updates

## Design Features

- **Color Palette**: Orange (#FF9D23), Teal gradient (#00E0C3 → #00F7FF), Purple (#8230FF)
- **Typography**: Plus Jakarta Sans and Noto Sans fonts
- **Responsive**: Mobile-optimized with proper touch interactions
- **Animations**: Smooth transitions and hover effects
- **Accessibility**: Proper ARIA labels and keyboard navigation

## Contributing

1. Follow the component-based architecture
2. Use Tailwind CSS for styling
3. Maintain TypeScript-like prop validation
4. Keep components small and focused
5. Test WebSocket functionality thoroughly