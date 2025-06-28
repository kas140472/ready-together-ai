
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { UserProfile } from '@/pages/Index';

interface ChatAssistantProps {
  userProfile: UserProfile;
  onBack: () => void;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export const ChatAssistant = ({ userProfile, onBack }: ChatAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hi ${userProfile.name}! I'm here to help you with your disaster preparedness journey. I understand you're in ${userProfile.location} and live in a ${userProfile.housingType.replace('_', ' ')}. What would you like to talk about today? I can help with specific preparedness questions, explain why certain steps are important, or just be here to listen if you're feeling overwhelmed.`,
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Context-aware responses based on user profile
    if (lowerMessage.includes('water') || lowerMessage.includes('thirsty')) {
      return `For your household of ${userProfile.householdSize} people, I recommend storing at least ${userProfile.householdSize * 3} gallons of water (1 gallon per person per day for 3 days). Since you live in a ${userProfile.housingType.replace('_', ' ')}, consider stackable water containers that fit your space. You can also fill bathtubs and sinks as backup if you get advance warning.`;
    }
    
    if (lowerMessage.includes('food') || lowerMessage.includes('eat')) {
      const dietaryNote = userProfile.dietary.length > 0 
        ? ` I notice you have dietary considerations (${userProfile.dietary.join(', ')}), so make sure your emergency food supplies accommodate these needs.`
        : '';
      return `Focus on non-perishable foods that don't require cooking - canned goods, dried fruits, nuts, energy bars, and peanut butter are great options.${dietaryNote} Aim for a 3-day supply that includes familiar comfort foods. What foods does your household typically enjoy that could work in an emergency?`;
    }
    
    if (lowerMessage.includes('evacuat') || lowerMessage.includes('leave') || lowerMessage.includes('escape')) {
      const transportNote = userProfile.transportation === 'own_car' 
        ? 'Since you have access to your own vehicle, plan multiple driving routes in case your primary route is blocked.'
        : userProfile.transportation === 'limited' 
          ? 'I understand you have limited transportation options. This makes it even more important to connect with neighbors or community resources who might be able to help with evacuation if needed.'
          : 'Consider both public transit routes and walking paths from your location.';
      return `${transportNote} Practice your evacuation route during normal conditions, and always have a backup plan. Know where you'll go - whether that's a friend's house, shelter, or evacuation center. Do you have a safe place identified where you could stay?`;
    }
    
    if (lowerMessage.includes('scare') || lowerMessage.includes('afraid') || lowerMessage.includes('anxious') || lowerMessage.includes('worry')) {
      return `It's completely normal to feel anxious about disasters - it shows you care about your safety and your loved ones. These feelings are valid, and preparing actually helps reduce anxiety by giving you some control. Take it one small step at a time. You don't have to do everything at once. What feels like the most manageable thing you could work on today?`;
    }
    
    if (lowerMessage.includes('money') || lowerMessage.includes('expensive') || lowerMessage.includes('cost') || lowerMessage.includes('afford')) {
      return `I understand that finances can be tight, and preparedness shouldn't break the bank. Start with free or low-cost steps: fill containers with tap water, make a contact list, plan evacuation routes. Build your supplies gradually - even adding one extra can of food each grocery trip helps. Many community organizations also have emergency supply drives or can connect you with resources. What's your biggest concern about costs?`;
    }
    
    if (lowerMessage.includes('neighbor') || lowerMessage.includes('community') || lowerMessage.includes('help')) {
      const socialNote = userProfile.socialSupport === 'isolated' 
        ? "I know building connections can feel challenging, but even small interactions matter. "
        : "Your existing community connections are really valuable. ";
      return `${socialNote}Consider introducing yourself to just one neighbor, or joining a local community group. Mutual aid makes everyone stronger - you might be surprised how much you can offer others too, whether it's sharing information, checking on someone, or pooling resources. Community resilience benefits everyone.`;
    }
    
    if (lowerMessage.includes('pets') || lowerMessage.includes('animal')) {
      const petNote = userProfile.pets 
        ? "Since you have pets, they're definitely part of your family's emergency plan! "
        : "Even without pets currently, it's good to know about animal safety. ";
      return `${petNote}Pets need their own emergency supplies: food, water, medications, carriers, leashes, and comfort items. Not all shelters accept pets, so identify pet-friendly evacuation locations or friends who could help. Keep a recent photo and medical records for your pets too.`;
    }
    
    if (lowerMessage.includes('thanks') || lowerMessage.includes('thank you')) {
      return `You're so welcome, ${userProfile.name}! I'm really proud of you for taking these steps to prepare. Remember, you're not alone in this - I'm here whenever you need support or have questions. You're building resilience not just for yourself, but for your whole community.`;
    }
    
    // Default supportive responses
    const responses = [
      `That's a great question, ${userProfile.name}. Let me think about how this applies to your specific situation in ${userProfile.location}...`,
      `I'm here to help you work through this. Given that you live in a ${userProfile.housingType.replace('_', ' ')}, let's think about what makes the most sense for you.`,
      `Every situation is unique, and I want to make sure my advice fits your life. Can you tell me a bit more about what's concerning you most?`,
      `You're asking all the right questions. Preparedness is about adapting general advice to your specific needs and circumstances.`,
      `I appreciate you sharing this with me. Let's work together to find an approach that feels manageable and realistic for you.`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: generateResponse(newMessage),
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-hearth-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                onClick={onBack}
                className="text-sage-700 hover:bg-sage-100"
              >
                ← Back to Dashboard
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-sage-400 to-sage-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span className="font-medium text-foreground">Your Assistant</span>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] ${message.sender === 'user' ? '' : 'flex items-start space-x-3'}`}>
                {message.sender === 'assistant' && (
                  <div className="w-8 h-8 bg-gradient-to-br from-sage-400 to-sage-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                )}
                <Card
                  className={`p-4 ${
                    message.sender === 'user'
                      ? 'bg-terracotta-600 text-white border-none'
                      : 'bg-white border-sage-200 warm-shadow'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </Card>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3 max-w-[70%]">
                <div className="w-8 h-8 bg-gradient-to-br from-sage-400 to-sage-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white animate-gentle-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <Card className="p-4 bg-white border-sage-200 warm-shadow">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-sage-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-sage-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-sage-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </Card>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-hearth-200 sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex space-x-3">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about disaster preparedness..."
              className="flex-1 gentle-focus"
              disabled={isTyping}
            />
            <Button
              onClick={sendMessage}
              disabled={!newMessage.trim() || isTyping}
              className="bg-terracotta-600 hover:bg-terracotta-700 text-white px-6"
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
