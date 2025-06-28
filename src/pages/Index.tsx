
import { useState } from 'react';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { OnboardingFlow } from '@/components/OnboardingFlow';
import { Dashboard } from '@/components/Dashboard';
import { ChatAssistant } from '@/components/ChatAssistant';

export type UserProfile = {
  name: string;
  location: string;
  housingType: string;
  transportation: string;
  dietary: string[];
  mobility: string;
  householdSize: number;
  pets: boolean;
  socialSupport: string;
  floorPlan?: string;
  foodStock?: string;
  medications?: string;
  emergencyContacts?: string;
  citizenApp?: string;
  concernedDisasters?: string[];
  biggestWorry?: string;
  reminderPreference?: string;
};

const Index = () => {
  const [currentView, setCurrentView] = useState<'welcome' | 'onboarding' | 'dashboard' | 'chat'>('welcome');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const handleStartOnboarding = () => {
    setCurrentView('onboarding');
  };

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setCurrentView('dashboard');
  };

  const handleOpenChat = () => {
    setCurrentView('chat');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-hearth-50 to-sage-50">
      {currentView === 'welcome' && (
        <WelcomeScreen onStart={handleStartOnboarding} />
      )}
      
      {currentView === 'onboarding' && (
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      )}
      
      {currentView === 'dashboard' && userProfile && (
        <Dashboard 
          userProfile={userProfile} 
          onOpenChat={handleOpenChat}
        />
      )}
      
      {currentView === 'chat' && userProfile && (
        <ChatAssistant 
          userProfile={userProfile}
          onBack={handleBackToDashboard}
        />
      )}
    </div>
  );
};

export default Index;
