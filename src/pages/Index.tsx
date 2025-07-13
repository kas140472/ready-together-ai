
import { useState, useEffect } from 'react';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { OnboardingFlow } from '@/components/OnboardingFlow';
import { Dashboard } from '@/components/Dashboard';
import { ChatAssistant } from '@/components/ChatAssistant';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

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
  const { user, loading, signOut, isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<'welcome' | 'onboarding' | 'dashboard' | 'chat'>('welcome');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = '/auth';
    }
  }, [loading, isAuthenticated]);

  // Load user profile from database
  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading profile:', error);
        return;
      }

      if (data) {
        // Convert database format to UserProfile format
        const profile: UserProfile = {
          name: data.name,
          location: data.location,
          housingType: data.housing_type,
          transportation: data.transportation,
          dietary: data.dietary || [],
          mobility: data.mobility,
          householdSize: data.household_size,
          pets: data.pets,
          socialSupport: data.social_support,
          floorPlan: data.floor_plan,
          foodStock: data.food_stock,
          medications: data.medications,
          emergencyContacts: data.emergency_contacts,
          citizenApp: data.citizen_app,
          concernedDisasters: data.concerned_disasters || [],
          biggestWorry: data.biggest_worry,
          reminderPreference: data.reminder_preference,
        };
        setUserProfile(profile);
        setCurrentView('dashboard');
      } else {
        setCurrentView('welcome');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleStartOnboarding = () => {
    setCurrentView('onboarding');
  };

  const handleOnboardingComplete = async (profile: UserProfile) => {
    if (!user) return;

    try {
      // Save profile to database
      const { error } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          name: profile.name,
          location: profile.location,
          housing_type: profile.housingType,
          transportation: profile.transportation,
          dietary: profile.dietary,
          mobility: profile.mobility,
          household_size: profile.householdSize,
          pets: profile.pets,
          social_support: profile.socialSupport,
          floor_plan: profile.floorPlan,
          food_stock: profile.foodStock,
          medications: profile.medications,
          emergency_contacts: profile.emergencyContacts,
          citizen_app: profile.citizenApp,
          concerned_disasters: profile.concernedDisasters,
          biggest_worry: profile.biggestWorry,
          reminder_preference: profile.reminderPreference,
        });

      if (error) {
        console.error('Error saving profile:', error);
        return;
      }

      setUserProfile(profile);
      setCurrentView('dashboard');
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleOpenChat = () => {
    setCurrentView('chat');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-hearth-50 to-sage-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-hearth-50 to-sage-50">
      {/* Sign out button */}
      {isAuthenticated && (
        <div className="absolute top-4 right-4 z-10">
          <Button variant="outline" size="sm" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      )}

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
