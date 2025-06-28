
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UserProfile } from '@/pages/Index';

interface OnboardingFlowProps {
  onComplete: (profile: UserProfile) => void;
}

type OnboardingStep = 'intro' | 'basic' | 'housing' | 'mobility' | 'dietary' | 'support' | 'complete';

export const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('intro');
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    dietary: [],
  });

  const handleNext = () => {
    const stepOrder: OnboardingStep[] = ['intro', 'basic', 'housing', 'mobility', 'dietary', 'support', 'complete'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const handleComplete = () => {
    if (profile.name && profile.location && profile.housingType && profile.transportation && 
        profile.mobility && profile.householdSize !== undefined && profile.pets !== undefined && 
        profile.socialSupport) {
      onComplete(profile as UserProfile);
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const toggleDietary = (item: string) => {
    const current = profile.dietary || [];
    if (current.includes(item)) {
      updateProfile({ dietary: current.filter(d => d !== item) });
    } else {
      updateProfile({ dietary: [...current, item] });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'intro':
        return (
          <Card className="p-8 max-w-2xl mx-auto warm-shadow border-none bg-white/90 backdrop-blur-sm">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-sage-200 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-sage-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-foreground">Let's get to know you</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                I'm here to help create a preparedness plan that works for your unique situation. 
                This isn't about judgment or perfection—it's about meeting you where you are and 
                helping you feel more secure.
              </p>
              <p className="text-base text-muted-foreground">
                Your answers help me understand what matters most for your safety and peace of mind.
              </p>
              <Button 
                onClick={handleNext}
                className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-3 rounded-full"
              >
                I'm ready to begin
              </Button>
            </div>
          </Card>
        );

      case 'basic':
        return (
          <Card className="p-8 max-w-2xl mx-auto warm-shadow border-none bg-white/90 backdrop-blur-sm">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground mb-2">Tell me about yourself</h2>
                <p className="text-muted-foreground">What should I call you, and where do you live?</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-base font-medium">What's your name?</Label>
                  <Input
                    id="name"
                    value={profile.name || ''}
                    onChange={(e) => updateProfile({ name: e.target.value })}
                    placeholder="How would you like me to address you?"
                    className="mt-2 gentle-focus"
                  />
                </div>
                
                <div>
                  <Label htmlFor="location" className="text-base font-medium">Where are you located?</Label>
                  <Input
                    id="location"
                    value={profile.location || ''}
                    onChange={(e) => updateProfile({ location: e.target.value })}
                    placeholder="City, State (helps me understand local risks)"
                    className="mt-2 gentle-focus"
                  />
                </div>

                <div>
                  <Label htmlFor="household" className="text-base font-medium">How many people live with you?</Label>
                  <Input
                    id="household"
                    type="number"
                    min="1"
                    value={profile.householdSize || ''}
                    onChange={(e) => updateProfile({ householdSize: parseInt(e.target.value) })}
                    placeholder="Including yourself"
                    className="mt-2 gentle-focus"
                  />
                </div>
              </div>

              <Button 
                onClick={handleNext}
                disabled={!profile.name || !profile.location || !profile.householdSize}
                className="w-full bg-sage-600 hover:bg-sage-700 text-white"
              >
                Continue
              </Button>
            </div>
          </Card>
        );

      case 'housing':
        return (
          <Card className="p-8 max-w-2xl mx-auto warm-shadow border-none bg-white/90 backdrop-blur-sm">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground mb-2">Your living situation</h2>
                <p className="text-muted-foreground">This helps me understand your evacuation options and storage space</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium mb-3 block">What type of housing do you live in?</Label>
                  <RadioGroup 
                    value={profile.housingType} 
                    onValueChange={(value) => updateProfile({ housingType: value })}
                    className="space-y-3"
                  >
                    {[
                      { value: 'house', label: 'House with yard' },
                      { value: 'apartment', label: 'Apartment/Condo' },
                      { value: 'mobile_home', label: 'Mobile home' },
                      { value: 'shared_housing', label: 'Shared housing/Room rental' },
                      { value: 'other', label: 'Other housing situation' }
                    ].map(option => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="font-normal cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base font-medium mb-3 block">Do you have pets?</Label>
                  <RadioGroup 
                    value={profile.pets?.toString()} 
                    onValueChange={(value) => updateProfile({ pets: value === 'true' })}
                    className="flex space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id="pets-yes" />
                      <Label htmlFor="pets-yes" className="font-normal cursor-pointer">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id="pets-no" />
                      <Label htmlFor="pets-no" className="font-normal cursor-pointer">No</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <Button 
                onClick={handleNext}
                disabled={!profile.housingType || profile.pets === undefined}
                className="w-full bg-sage-600 hover:bg-sage-700 text-white"
              >
                Continue
              </Button>
            </div>
          </Card>
        );

      case 'mobility':
        return (
          <Card className="p-8 max-w-2xl mx-auto warm-shadow border-none bg-white/90 backdrop-blur-sm">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground mb-2">Getting around</h2>
                <p className="text-muted-foreground">Understanding your transportation and mobility helps me plan better evacuation options</p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-3 block">What transportation do you typically have access to?</Label>
                  <RadioGroup 
                    value={profile.transportation} 
                    onValueChange={(value) => updateProfile({ transportation: value })}
                    className="space-y-3"
                  >
                    {[
                      { value: 'own_car', label: 'Own car/vehicle' },
                      { value: 'shared_car', label: 'Shared car (family/friends)' },
                      { value: 'public_transport', label: 'Public transportation' },
                      { value: 'bike_walk', label: 'Bike/Walking only' },
                      { value: 'limited', label: 'Very limited transportation options' }
                    ].map(option => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="font-normal cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base font-medium mb-3 block">Do you have any mobility considerations?</Label>
                  <RadioGroup 
                    value={profile.mobility} 
                    onValueChange={(value) => updateProfile({ mobility: value })}
                    className="space-y-3"
                  >
                    {[
                      { value: 'none', label: 'No mobility limitations' },
                      { value: 'some_difficulty', label: 'Some difficulty with stairs/walking' },
                      { value: 'mobility_aid', label: 'Use mobility aid (wheelchair, walker, etc.)' },
                      { value: 'significant', label: 'Significant mobility limitations' }
                    ].map(option => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="font-normal cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>

              <Button 
                onClick={handleNext}
                disabled={!profile.transportation || !profile.mobility}
                className="w-full bg-sage-600 hover:bg-sage-700 text-white"
              >
                Continue
              </Button>
            </div>
          </Card>
        );

      case 'dietary':
        return (
          <Card className="p-8 max-w-2xl mx-auto warm-shadow border-none bg-white/90 backdrop-blur-sm">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground mb-2">Food and dietary needs</h2>
                <p className="text-muted-foreground">This helps me suggest emergency food supplies that work for you</p>
              </div>
              
              <div>
                <Label className="text-base font-medium mb-4 block">
                  Do any of these apply to your household's dietary needs? (Select all that apply)
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    'Vegetarian',
                    'Vegan',
                    'Halal',
                    'Kosher',
                    'Gluten-free',
                    'Dairy-free',
                    'Diabetic-friendly',
                    'Baby formula/food needed'
                  ].map((dietary) => (
                    <div key={dietary} className="flex items-center space-x-2">
                      <Checkbox
                        id={dietary}
                        checked={(profile.dietary || []).includes(dietary)}
                        onCheckedChange={() => toggleDietary(dietary)}
                      />
                      <Label htmlFor={dietary} className="font-normal cursor-pointer">
                        {dietary}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                onClick={handleNext}
                className="w-full bg-sage-600 hover:bg-sage-700 text-white"
              >
                Continue
              </Button>
            </div>
          </Card>
        );

      case 'support':
        return (
          <Card className="p-8 max-w-2xl mx-auto warm-shadow border-none bg-white/90 backdrop-blur-sm">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground mb-2">Your support network</h2>
                <p className="text-muted-foreground">Community connections are vital for resilience and mutual aid</p>
              </div>
              
              <div>
                <Label className="text-base font-medium mb-3 block">
                  How would you describe your local support network?
                </Label>
                <RadioGroup 
                  value={profile.socialSupport} 
                  onValueChange={(value) => updateProfile({ socialSupport: value })}
                  className="space-y-3"
                >
                  {[
                    { value: 'strong', label: 'Strong - I have close neighbors/friends nearby who I can count on' },
                    { value: 'some', label: 'Some - I know a few people in my area but we\'re not very close' },
                    { value: 'limited', label: 'Limited - I don\'t know many people in my immediate area' },
                    { value: 'isolated', label: 'Isolated - I don\'t have strong local connections right now' }
                  ].map(option => (
                    <div key={option.value} className="flex items-start space-x-2">
                      <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                      <Label htmlFor={option.value} className="font-normal cursor-pointer leading-relaxed">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Button 
                onClick={handleNext}
                disabled={!profile.socialSupport}
                className="w-full bg-sage-600 hover:bg-sage-700 text-white"
              >
                Continue
              </Button>
            </div>
          </Card>
        );

      case 'complete':
        return (
          <Card className="p-8 max-w-2xl mx-auto warm-shadow border-none bg-white/90 backdrop-blur-sm">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-terracotta-200 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-terracotta-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-foreground">Thank you, {profile.name}</h2>
              <div className="space-y-4">
                <p className="text-lg text-muted-foreground">
                  I now have what I need to create your personalized preparedness plan. 
                </p>
                <p className="text-base text-muted-foreground">
                  Remember: this is about progress, not perfection. We'll build your resilience step by step, 
                  in a way that fits your life and resources.
                </p>
              </div>
              <Button 
                onClick={handleComplete}
                className="bg-terracotta-600 hover:bg-terracotta-700 text-white px-8 py-3 rounded-full text-lg"
              >
                See My Preparedness Plan
              </Button>
            </div>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl animate-fade-in">
        {renderStep()}
      </div>
    </div>
  );
};
