# KrishiMitra - AI-Powered Farming Companion for Karnataka

KrishiMitra is a comprehensive agricultural advisory application designed to empower Karnataka farmers with AI-powered disease detection, real-time market prices, and expert farming guidance in multiple languages.

## Features

### 1. Disease Detection
- Upload crop images or capture photos directly
- AI-powered disease identification using Google Gemini Vision API
- Detailed results including confidence level, severity, symptoms
- Treatment recommendations (organic & chemical methods)
- Prevention tips
- Scan history storage in Supabase

### 2. Market Prices Intelligence
- Real-time mandi price data for Karnataka districts
- Searchable and sortable price comparison table
- Price trend charts showing 30-day historical data
- Best price recommendations
- Export data to CSV
- Filter by district and crop name

### 3. AI Chat Advisor
- 24/7 agricultural advisory chatbot powered by Gemini 2.0 Flash
- Multi-language support (English, Hindi, Kannada)
- Quick question templates for common queries
- Voice input support using Web Speech API
- Conversation history stored in Supabase
- Context-aware responses

### 4. Multi-Language Support
- Complete UI translation for English, Hindi, and Kannada
- Language preference persistence
- AI responses in user's selected language

## Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Styling
- **React Router** - Navigation
- **Recharts** - Data visualization
- **Lucide React** - Icon library
- **React Query** - Server state management

### Backend
- **Node.js + Express** - API server
- **Supabase** - PostgreSQL database
- **Google Gemini 2.0 Flash** - AI model for disease detection and chat

### Database Schema
- `disease_scans` - Disease detection history
- `chat_conversations` - Chat message history
- `market_prices` - Mandi price data with 15 sample crops
- `user_preferences` - User settings and language preferences

## Installation

### Prerequisites
- Node.js 18+ and npm
- Google Gemini API key (optional - app works with demo data)

### Setup Steps

1. **Clone and install dependencies:**
```bash
npm install
cd server && npm install
```

2. **Configure environment variables:**
Copy `.env.example` to `.env` and add your Gemini API key:
```
VITE_GEMINI_API_KEY=your_api_key_here
```

Get your Gemini API key from: https://makersuite.google.com/app/apikey

3. **Database is already configured:**
The Supabase database is pre-configured with sample data. No additional setup required.

4. **Start development servers:**

Frontend:
```bash
npm run dev
```

Backend (in separate terminal):
```bash
cd server
npm start
```

5. **Build for production:**
```bash
npm run build
```

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── layout/          # Navbar, Footer
│   │   └── features/        # Feature-specific components
│   ├── contexts/            # React contexts (Language)
│   ├── pages/               # Page components
│   │   ├── Home.jsx
│   │   ├── DiseaseScanner.jsx
│   │   ├── MarketPrices.jsx
│   │   └── AIChat.jsx
│   ├── services/            # API and service layer
│   │   └── supabase.js
│   ├── utils/               # Utilities and translations
│   │   └── translations.js
│   ├── App.jsx
│   └── main.jsx
├── server/
│   └── index.js             # Express API server
├── public/
└── package.json
```

## Usage

### Disease Detection
1. Navigate to "Disease Scanner" from the navbar
2. Upload an image or capture a photo using your device camera
3. Click "Analyze Disease" to get AI-powered detection results
4. View detailed symptoms, treatment options, and prevention tips
5. Results are automatically saved to your scan history

### Market Prices
1. Go to "Market Prices" section
2. Use search bar to filter by crop name
3. Select district from dropdown to see local prices
4. Click column headers to sort the table
5. View price trends in the chart below
6. Export data using the "Export CSV" button

### AI Chat
1. Open "AI Chat" from navigation
2. Select your preferred language from the navbar
3. Type your farming question or use quick question templates
4. Use the microphone button for voice input
5. Get instant AI-powered advice in your language

### Language Switching
1. Click the language dropdown in the navbar
2. Select English, Hindi (हिन्दी), or Kannada (ಕನ್ನಡ)
3. The entire interface updates to your chosen language
4. Your preference is saved automatically

## API Endpoints

### Backend Server (Port 5000)

- `POST /api/disease-detect` - Analyze crop disease from image
- `GET /api/market-prices` - Fetch mandi price data
- `POST /api/chat` - Process chat messages
- `GET /api/weather` - Get weather information
- `GET /health` - Server health check

## Demo Mode

The application works without a Gemini API key by using pre-configured demo data:
- Disease detection returns sample bacterial leaf blight analysis
- AI chat provides realistic farming advice responses
- All features remain functional for testing

## Database Features

- Row Level Security (RLS) enabled on all tables
- Public access policies for demo purposes
- Automatic timestamp tracking
- JSON storage for flexible nested data
- Indexed columns for fast queries

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

- User authentication and personalized history
- Weather-based crop recommendations
- Soil health monitoring integration
- Government scheme notifications
- Offline mode with Progressive Web App
- Integration with Karnataka mandi APIs
- Multi-region support beyond Karnataka

## Contributing

This is a demonstration project for Karnataka farmers. Contributions welcome for:
- Additional language translations
- Improved AI prompt engineering
- Mobile app development
- Real-time mandi API integration

## License

MIT License

## Support

For issues or questions:
- Email: support@krishimitra.com
- Phone: +91 80 1234 5678

---

**Built with ❤️ for Karnataka Farmers**
