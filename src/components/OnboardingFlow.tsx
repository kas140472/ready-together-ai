
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { UserProfile } from '@/pages/Index';

interface OnboardingFlowProps {
  onComplete: (profile: UserProfile) => void;
}

export const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    dietary: [],
    householdSize: 1,
    pets: false,
  });

  const steps = [
    'Basic Info',
    'Living Situation',
    'Transportation',
    'Diet & Health',
    'Connections',
    'Emergency Priorities'
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(profile as UserProfile);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-foreground mb-2">Let's get to know you</h2>
              <p className="text-muted-foreground">This helps us create your personalized disaster plan</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">What should we call you?</Label>
                <Input
                  id="name"
                  value={profile.name || ''}
                  onChange={(e) => updateProfile({ name: e.target.value })}
                  placeholder="Your first name"
                  className="gentle-focus"
                />
              </div>
              
              <div>
                <Label htmlFor="location">Where do you live?</Label>
                <Input
                  id="location"
                  value={profile.location || ''}
                  onChange={(e) => updateProfile({ location: e.target.value })}
                  placeholder="City, State or ZIP code"
                  className="gentle-focus"
                />
              </div>

              <div>
                <Label>How many people live with you? (including yourself)</Label>
                <div className="px-3 py-2">
                  <Slider
                    value={[profile.householdSize || 1]}
                    onValueChange={(value) => updateProfile({ householdSize: value[0] })}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>1 person</span>
                    <span className="font-medium">{profile.householdSize || 1} people</span>
                    <span>10+ people</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-foreground mb-2">Your living situation</h2>
              <p className="text-muted-foreground">This helps us plan evacuation routes and safety measures</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label>What type of home do you live in?</Label>
                <RadioGroup
                  value={profile.housingType || ''}
                  onValueChange={(value) => updateProfile({ housingType: value })}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="apartment" id="apartment" />
                    <Label htmlFor="apartment">Apartment/Condo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="house" id="house" />
                    <Label htmlFor="house">Single-family house</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mobile" id="mobile" />
                    <Label htmlFor="mobile">Mobile home/RV</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="shared" id="shared" />
                    <Label htmlFor="shared">Shared housing/Room rental</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pets"
                  checked={profile.pets || false}
                  onCheckedChange={(checked) => updateProfile({ pets: checked as boolean })}
                />
                <Label htmlFor="pets">I have pets that would need to evacuate with me</Label>
              </div>

              <div>
                <Label htmlFor="floorplan">Describe your home layout (optional)</Label>
                <Textarea
                  id="floorplan"
                  value={profile.floorPlan || ''}
                  onChange={(e) => updateProfile({ floorPlan: e.target.value })}
                  placeholder="e.g., 2-bedroom apartment on 3rd floor, main exit through front door, fire escape on back balcony..."
                  className="gentle-focus"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-foreground mb-2">How you get around</h2>
              <p className="text-muted-foreground">Transportation affects your evacuation options</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label>What's your primary transportation?</Label>
                <RadioGroup
                  value={profile.transportation || ''}
                  onValueChange={(value) => updateProfile({ transportation: value })}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="own-car" id="own-car" />
                    <Label htmlFor="own-car">I have my own car</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="public-transit" id="public-transit" />
                    <Label htmlFor="public-transit">Public transportation</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rideshare" id="rideshare" />
                    <Label htmlFor="rideshare">Rideshare/Taxi</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bike-walk" id="bike-walk" />
                    <Label htmlFor="bike-walk">Bike/Walking</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rely-others" id="rely-others" />
                    <Label htmlFor="rely-others">Rely on friends/family</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label>Mobility considerations</Label>
                <RadioGroup
                  value={profile.mobility || ''}
                  onValueChange={(value) => updateProfile({ mobility: value })}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="none" />
                    <Label htmlFor="none">No mobility limitations</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="some" id="some" />
                    <Label htmlFor="some">Some difficulty walking/stairs</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="wheelchair" id="wheelchair" />
                    <Label htmlFor="wheelchair">Use wheelchair/mobility aid</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="assistance" id="assistance" />
                    <Label htmlFor="assistance">Need assistance to evacuate</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-foreground mb-2">Diet and health needs</h2>
              <p className="text-muted-foreground">Helps us plan your emergency food and medical supplies</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label>Dietary preferences/restrictions (check all that apply)</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    'Vegetarian', 'Vegan', 'Kosher', 'Halal', 
                    'Gluten-free', 'Dairy-free', 'Nut allergies', 'Diabetic'
                  ].map((diet) => (
                    <div key={diet} className="flex items-center space-x-2">
                      <Checkbox
                        id={diet}
                        checked={profile.dietary?.includes(diet) || false}
                        onCheckedChange={(checked) => {
                          const current = profile.dietary || [];
                          if (checked) {
                            updateProfile({ dietary: [...current, diet] });
                          } else {
                            updateProfile({ dietary: current.filter(d => d !== diet) });
                          }
                        }}
                      />
                      <Label htmlFor={diet} className="text-sm">{diet}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>How many days of food do you typically keep at home?</Label>
                <RadioGroup
                  value={profile.foodStock || ''}
                  onValueChange={(value) => updateProfile({ foodStock: value })}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1-2-days" id="1-2-days" />
                    <Label htmlFor="1-2-days">1-2 days (eat out often)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3-5-days" id="3-5-days" />
                    <Label htmlFor="3-5-days">3-5 days (some cooking)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1-2-weeks" id="1-2-weeks" />
                    <Label htmlFor="1-2-weeks">1-2 weeks (regular grocery trips)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="month-plus" id="month-plus" />
                    <Label htmlFor="month-plus">3+ weeks (bulk shopper)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="medications">Any critical medications or medical equipment?</Label>
                <Textarea
                  id="medications"
                  value={profile.medications || ''}
                  onChange={(e) => updateProfile({ medications: e.target.value })}
                  placeholder="e.g., insulin, inhaler, blood pressure medication, CPAP machine..."
                  className="gentle-focus"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-foreground mb-2">Your support network</h2>
              <p className="text-muted-foreground">Building connections makes everyone safer</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label>How would you describe your local connections?</Label>
                <RadioGroup
                  value={profile.socialSupport || ''}
                  onValueChange={(value) => updateProfile({ socialSupport: value })}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="strong" id="strong" />
                    <Label htmlFor="strong">Strong - I know my neighbors and have local friends/family</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="some" id="some" />
                    <Label htmlFor="some">Some - I know a few people in the area</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="limited" id="limited" />
                    <Label htmlFor="limited">Limited - I'm newer here or keep to myself</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="isolated" id="isolated" />
                    <Label htmlFor="isolated">I feel pretty isolated in my community</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="emergency-contacts">Who would you contact in an emergency?</Label>
                <Textarea
                  id="emergency-contacts"
                  value={profile.emergencyContacts || ''}
                  onChange={(e) => updateProfile({ emergencyContacts: e.target.value })}
                  placeholder="Family members, close friends, neighbors you trust..."
                  className="gentle-focus"
                />
              </div>

              <div>
                <Label htmlFor="citizen-app">Do you use the Citizen app or similar safety apps?</Label>
                <RadioGroup
                  value={profile.citizenApp || ''}
                  onValueChange={(value) => updateProfile({ citizenApp: value })}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes-active" id="yes-active" />
                    <Label htmlFor="yes-active">Yes, I use it regularly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes-occasional" id="yes-occasional" />
                    <Label htmlFor="yes-occasional">Yes, but only occasionally</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no-interested" id="no-interested" />
                    <Label htmlFor="no-interested">No, but I'm interested</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no-not-interested" id="no-not-interested" />
                    <Label htmlFor="no-not-interested">No, not interested</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-foreground mb-2">What worries you most?</h2>
              <p className="text-muted-foreground">Let's prioritize your preparations</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label>What disasters are you most concerned about in your area?</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    'Wildfire', 'Earthquake', 'Flood', 'Hurricane', 
                    'Power outage', 'Water shortage', 'Civil unrest', 'Other'
                  ].map((disaster) => (
                    <div key={disaster} className="flex items-center space-x-2">
                      <Checkbox
                        id={disaster}
                        checked={profile.concernedDisasters?.includes(disaster) || false}
                        onCheckedChange={(checked) => {
                          const current = profile.concernedDisasters || [];
                          if (checked) {
                            updateProfile({ concernedDisasters: [...current, disaster] });
                          } else {
                            updateProfile({ concernedDisasters: current.filter(d => d !== disaster) });
                          }
                        }}
                      />
                      <Label htmlFor={disaster} className="text-sm">{disaster}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="biggest-worry">What's your biggest worry about being prepared?</Label>
                <Textarea
                  id="biggest-worry"
                  value={profile.biggestWorry || ''}
                  onChange={(e) => updateProfile({ biggestWorry: e.target.value })}
                  placeholder="e.g., I don't know where to start, it's too expensive, I live alone, I don't have storage space..."
                  className="gentle-focus"
                />
              </div>

              <div>
                <Label>How do you prefer to receive reminders?</Label>
                <RadioGroup
                  value={profile.reminderPreference || ''}
                  onValueChange={(value) => updateProfile({ reminderPreference: value })}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="gentle" id="gentle" />
                    <Label htmlFor="gentle">Gentle nudges - don't stress me out</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="regular" id="regular" />
                    <Label htmlFor="regular">Regular check-ins</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="urgent" id="urgent" />
                    <Label htmlFor="urgent">Only when there's immediate risk</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="minimal" id="minimal" />
                    <Label htmlFor="minimal">Minimal - I'll check in myself</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm font-medium text-primary">
              {steps[currentStep]}
            </span>
          </div>
          <div className="w-full bg-muted h-2 rounded-full">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        <Card className="p-8 mb-6 warm-shadow border-none bg-white/80 backdrop-blur-sm">
          {renderStep()}
        </Card>

        {/* Navigation buttons */}
        <div className="flex justify-between">
          <Button
            onClick={handleBack}
            variant="outline"
            disabled={currentStep === 0}
            className="px-6"
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            className="bg-terracotta-600 hover:bg-terracotta-700 text-white px-6"
          >
            {currentStep === steps.length - 1 ? "Complete Setup" : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
};
