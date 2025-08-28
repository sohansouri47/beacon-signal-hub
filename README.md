# Beacon - Your Signal in Any Crisis

A React frontend microservice for emergency communication, built with modern web technologies and designed for crisis situations.

## Features

- **Dark Mode Interface**: Professional dark theme optimized for emergency scenarios
- **Real-time Chat**: AI-powered emergency communication interface
- **Voice Recording**: MediaRecorder API integration for audio messages
- **Emergency Status Tracking**: Visual indicators for crisis severity levels
- **Operator Handoff**: Seamless transition to human operators when needed
- **Secure Authentication**: Descope SDK integration for user management

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Router** for navigation
- **TailwindCSS** for styling with custom dark theme
- **Descope React SDK** for authentication
- **Lucide React** for icons
- **shadcn/ui** components (customized for Beacon theme)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Descope account and project ID

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo-url>
   cd beacon-frontend
   npm install
   ```

2. **Environment setup:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   VITE_DESCOPE_PROJECT_ID=your-descope-project-id
   VITE_API_BASE_URL=http://localhost:3001
   VITE_APP_BASE_URL=http://localhost:8080
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

### Descope Setup

1. Sign up at [Descope](https://www.descope.com/)
2. Create a new project
3. Copy your Project ID to the `.env` file
4. Configure sign-in and sign-up flows in the Descope console

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components (customized)
│   ├── Logo.tsx        # Beacon logo component
│   ├── ChatMessage.tsx # Chat message bubbles
│   ├── StatusBadge.tsx # Emergency status indicators
│   └── ActionCard.tsx  # Emergency action cards
├── pages/              # Main application pages
│   ├── Splash.tsx      # Initial loading screen
│   ├── Login.tsx       # Authentication (Descope)
│   ├── Signup.tsx      # User registration (Descope)
│   └── Chat.tsx        # Main chat interface
├── hooks/              # Custom React hooks
│   └── useAudioRecording.ts # Audio recording logic
├── config/             # Configuration files
│   └── api.ts          # API endpoints and mock helpers
├── lib/                # Utility libraries
│   ├── utils.ts        # General utilities
│   └── descope.ts      # Descope configuration
└── assets/             # Static assets
    └── logo.png        # Beacon logo
```

## API Integration

The frontend is designed to work with your backend API. Key integration points:

### Chat API
```typescript
// Example chat message endpoint
POST /api/chat
{
  "message": "User message text",
  "context": "emergency_level",
  "userId": "user_id"
}
```

### Audio Processing
```typescript
// Example audio transcription endpoint
POST /api/audio/transcribe
Content-Type: multipart/form-data
Body: audio file (WebM format)
```

### Emergency Alerts
```typescript
// Example emergency alert endpoint
POST /api/emergency/alert
{
  "level": "high",
  "location": "user_location",
  "contacts": ["emergency_contact_ids"]
}
```

## Customization

### Logo Replacement
Replace `src/assets/logo.png` with your logo. The component automatically handles responsive sizing.

### Theme Customization
Edit `src/index.css` and `tailwind.config.ts` to customize:
- Colors (emergency status colors, brand colors)
- Glowing effects and animations
- Typography and spacing

### Mock Data
During development, the app uses mock API responses. Replace mock calls in:
- `src/config/api.ts` - `mockApiCall` function
- `src/pages/Chat.tsx` - Replace mock responses with actual API calls

## Emergency Status Levels

- **Low** (Green): Normal operation, basic assistance
- **Medium** (Amber): Urgent situation requiring attention
- **High** (Red): Critical emergency, immediate response needed

## Audio Recording

The app supports browser-based audio recording:
- Uses MediaRecorder API
- Records in WebM format
- Configurable max duration (5 minutes default)
- Automatic transcription via backend API

## Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting platform

3. **Environment variables** for production:
   - Set `VITE_API_BASE_URL` to your production API
   - Set `VITE_DESCOPE_PROJECT_ID` to your Descope project
   - Configure CORS on your backend for the frontend domain

## Security Considerations

- All authentication handled by Descope
- Audio data transmitted securely to backend
- Emergency data requires encrypted transmission
- Consider implementing rate limiting for API calls

## Development Notes

- Dark mode is forced throughout the application
- All colors use semantic tokens from the design system
- Components are fully typed with TypeScript
- Mock API calls ready for backend integration

## Contributing

1. Follow the existing code structure and naming conventions
2. Update types when adding new features
3. Test audio recording functionality across browsers
4. Ensure emergency status changes are properly reflected in UI

## License

[Your License Here]