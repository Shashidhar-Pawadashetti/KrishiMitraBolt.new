import { useState, useRef, useEffect } from 'react';
import { Send, Mic, Plus, Loader } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../services/supabase';

const AIChat = () => {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const quickQuestions = [
    { key: 'pestControl', label: t('aiChat.pestControl') },
    { key: 'monsoonTips', label: t('aiChat.monsoonTips') },
    { key: 'cropRotation', label: t('aiChat.cropRotation') },
    { key: 'fertilizer', label: t('aiChat.fertilizer') },
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = { role: 'user', content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

      let aiResponse;

      if (!geminiApiKey) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        aiResponse = getDemoResponse(text);
      } else {
        const languageInstruction = {
          en: 'Respond in English',
          hi: 'Respond in Hindi (Devanagari script)',
          kn: 'Respond in Kannada',
        }[language];

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: `You are an expert agricultural advisor for Karnataka, India. ${languageInstruction}. Provide practical, actionable farming advice. Question: ${text}`
                }]
              }]
            })
          }
        );

        const data = await response.json();
        aiResponse = data.candidates[0].content.parts[0].text;
      }

      const aiMessage = { role: 'ai', content: aiResponse, timestamp: new Date() };
      setMessages((prev) => [...prev, aiMessage]);

      const allMessages = [...messages, userMessage, aiMessage];
      await supabase.from('chat_conversations').upsert({
        session_id: sessionId,
        messages: allMessages,
        language,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'session_id' });
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        role: 'ai',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const getDemoResponse = (question) => {
    const responses = {
      en: {
        pest: "For effective pest control in Karnataka:\n\n1. Use neem-based organic pesticides (Azadirachtin 0.15%)\n2. Install pheromone traps for early detection\n3. Practice crop rotation to break pest cycles\n4. Maintain proper field sanitation\n5. Use biological control agents like Trichogramma\n\nFor severe infestations, consider Imidacloprid 17.8% SL at 0.3ml/liter. Always follow safety guidelines.",
        monsoon: "Monsoon farming tips for Karnataka:\n\n1. Ensure proper drainage channels to prevent waterlogging\n2. Plant monsoon-friendly crops: Rice, Ragi, Jowar\n3. Apply fungicides preventively for disease control\n4. Store fertilizers in dry places\n5. Check weather forecasts regularly using apps\n6. Harvest mature crops before heavy rains\n\nBest time to prepare fields: Early June before monsoon onset.",
        rotation: "Crop rotation recommendations for Karnataka:\n\n**Kharif Season (June-Oct):**\n- Rice → Pulses (Tur/Green gram)\n- Cotton → Jowar/Bajra\n- Sugarcane → Vegetables\n\n**Rabi Season (Oct-Feb):**\n- Wheat → Sunflower\n- Groundnut → Bengal gram\n\nBenefits:\n✓ Improves soil fertility\n✓ Reduces pest buildup\n✓ Better water utilization\n✓ Increased yields",
        fertilizer: "Fertilizer recommendations:\n\n**For Rice:**\n- Basal: 60kg Urea + 125kg DAP per acre\n- Top dress: 40kg Urea at 30 days\n\n**For Cotton:**\n- 50kg Urea + 100kg DAP + 25kg MOP per acre\n\n**Organic alternatives:**\n- Vermicompost: 2-3 tons/acre\n- Neem cake: 200kg/acre\n- Green manure with Sesbania\n\nSoil test before application. NPK ratio matters!",
        default: "I'm your AI farming advisor for Karnataka! I can help with:\n\n• Crop disease identification\n• Pest management solutions\n• Fertilizer recommendations\n• Irrigation scheduling\n• Market price trends\n• Government schemes\n• Weather-based advice\n\nAsk me anything about farming!"
      }
    };

    const lowerQuestion = question.toLowerCase();
    if (lowerQuestion.includes('pest') || lowerQuestion.includes('insect')) {
      return responses.en.pest;
    } else if (lowerQuestion.includes('monsoon') || lowerQuestion.includes('rain')) {
      return responses.en.monsoon;
    } else if (lowerQuestion.includes('rotation') || lowerQuestion.includes('crop cycle')) {
      return responses.en.rotation;
    } else if (lowerQuestion.includes('fertilizer') || lowerQuestion.includes('nutrient')) {
      return responses.en.fertilizer;
    }
    return responses.en.default;
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'kn' ? 'kn-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.start();

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };

      recognition.onerror = () => {
        alert('Voice input not supported or permission denied');
      };
    } else {
      alert('Voice input not supported in your browser');
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            {t('aiChat.title')}
          </h1>
          <button
            onClick={handleNewChat}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>{t('aiChat.newChat')}</span>
          </button>
        </div>

        {messages.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {t('aiChat.quickQuestions')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickQuestions.map((q) => (
                <button
                  key={q.key}
                  onClick={() => sendMessage(q.label)}
                  className="px-4 py-3 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors text-left font-medium"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg mb-6 h-[500px] flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400">
                <p className="text-center">
                  Start a conversation with your AI farming advisor
                </p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-3 rounded-lg flex items-center space-x-2">
                  <Loader className="w-4 h-4 animate-spin text-primary-600" />
                  <span className="text-gray-600">{t('aiChat.typing')}</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage(input)}
                placeholder={t('aiChat.placeholder')}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={loading}
              />
              <button
                onClick={handleVoiceInput}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={loading}
              >
                <Mic className="w-5 h-5" />
              </button>
              <button
                onClick={() => sendMessage(input)}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-400"
                disabled={loading || !input.trim()}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
