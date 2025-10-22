const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

const upload = multer({ storage: multer.memoryStorage() });

const genAI = process.env.VITE_GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY)
  : null;

app.post('/api/disease-detect', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    if (!genAI) {
      return res.json({
        disease_name: 'Bacterial Leaf Blight',
        confidence: 92.5,
        crop_type: 'Rice',
        severity: 'Moderate',
        symptoms: [
          'Water-soaked lesions on leaves',
          'Yellow to white stripes along leaf veins',
          'Wilting of seedlings in severe cases',
          'Bacterial ooze visible in morning dew'
        ],
        treatment: {
          organic: [
            'Remove and destroy infected plant parts',
            'Apply neem oil spray (5ml per liter of water)',
            'Use copper-based fungicides',
            'Maintain proper field drainage'
          ],
          chemical: [
            'Spray Streptocycline (100 ppm) + Copper Oxychloride (0.3%)',
            'Apply Plantomycin at 0.1% concentration',
            'Use Zinc Sulphate spray (0.25%) for nutrient balance'
          ]
        },
        prevention: [
          'Use disease-resistant rice varieties',
          'Practice crop rotation with non-host crops',
          'Avoid excessive nitrogen fertilizer',
          'Maintain optimal plant spacing for air circulation',
          'Remove weed hosts that harbor bacteria'
        ]
      });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const imageParts = [{
      inlineData: {
        data: req.file.buffer.toString('base64'),
        mimeType: req.file.mimetype
      }
    }];

    const prompt = 'You are an expert agricultural AI. Analyze this crop image and identify any diseases. Respond in JSON format with: disease_name, confidence (percentage), crop_type, severity (Low/Moderate/High), symptoms (array), treatment (object with organic and chemical arrays), prevention (array). If no disease found, indicate healthy crop.';

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const diseaseData = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);

    res.json(diseaseData);
  } catch (error) {
    console.error('Disease detection error:', error);
    res.status(500).json({ error: 'Failed to analyze image' });
  }
});

app.get('/api/market-prices', async (req, res) => {
  try {
    const { district, crop } = req.query;

    const mockPrices = [
      { crop_name: 'Rice', mandi_name: 'Bengaluru City Market', district: 'Bengaluru Urban', price_per_quintal: 2850, price_change_percentage: 2.5 },
      { crop_name: 'Wheat', mandi_name: 'Mysuru APMC', district: 'Mysuru', price_per_quintal: 2200, price_change_percentage: -1.2 },
      { crop_name: 'Cotton', mandi_name: 'Raichur APMC', district: 'Raichur', price_per_quintal: 5800, price_change_percentage: 4.2 },
    ];

    let filtered = mockPrices;
    if (district) filtered = filtered.filter(p => p.district === district);
    if (crop) filtered = filtered.filter(p => p.crop_name.toLowerCase().includes(crop.toLowerCase()));

    res.json(filtered);
  } catch (error) {
    console.error('Market prices error:', error);
    res.status(500).json({ error: 'Failed to fetch market prices' });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, language } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'No message provided' });
    }

    if (!genAI) {
      const demoResponse = "I'm your AI farming advisor! I can help with crop diseases, pest control, fertilizer recommendations, and market trends. Ask me anything about farming in Karnataka.";
      return res.json({ response: demoResponse });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const languageInstruction = {
      en: 'Respond in English',
      hi: 'Respond in Hindi (Devanagari script)',
      kn: 'Respond in Kannada',
    }[language || 'en'];

    const prompt = `You are an expert agricultural advisor for Karnataka, India. ${languageInstruction}. Provide practical, actionable farming advice. Question: ${message}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ response: text });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

app.get('/api/weather', async (req, res) => {
  try {
    const mockWeather = {
      location: 'Bengaluru, Karnataka',
      temperature: 28,
      condition: 'Partly Cloudy',
      humidity: 65,
      rainfall: 0,
      forecast: [
        { day: 'Today', temp: 28, condition: 'Partly Cloudy', rainfall: 0 },
        { day: 'Tomorrow', temp: 27, condition: 'Cloudy', rainfall: 5 },
        { day: 'Day 3', temp: 26, condition: 'Rainy', rainfall: 15 },
      ]
    };

    res.json(mockWeather);
  } catch (error) {
    console.error('Weather error:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'KrishiMitra API Server Running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Gemini API: ${genAI ? 'Configured' : 'Not configured (using demo data)'}`);
});
