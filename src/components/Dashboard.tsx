
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { UserProfile } from '@/pages/Index';

interface DashboardProps {
  userProfile: UserProfile;
  onOpenChat: () => void;
}

interface ChecklistItem {
  id: string;
  task: string;
  category: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  explanation: string;
}

export const Dashboard = ({ userProfile, onOpenChat }: DashboardProps) => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: '1',
      task: 'Create emergency contact list',
      category: 'Communication',
      completed: false,
      priority: 'high',
      explanation: 'Having contacts readily available when phone service may be limited is crucial.'
    },
    {
      id: '2',
      task: 'Assemble 3-day water supply',
      category: 'Water & Food',
      completed: false,
      priority: 'high',
      explanation: `Store 1 gallon per person per day. For your household of ${userProfile.householdSize}, that's ${userProfile.householdSize * 3} gallons total.`
    },
    {
      id: '3',
      task: 'Prepare emergency food kit',
      category: 'Water & Food',
      completed: false,
      priority: 'high',
      explanation: userProfile.dietary.length > 0 
        ? `Non-perishable foods that fit your dietary needs: ${userProfile.dietary.join(', ')}.`
        : 'Non-perishable foods like canned goods, dried fruits, and energy bars.'
    },
    {
      id: '4',
      task: 'Identify evacuation routes',
      category: 'Transportation',
      completed: false,
      priority: 'high',
      explanation: userProfile.transportation === 'own_car' 
        ? 'Plan multiple routes by car in case primary roads are blocked.'
        : 'Identify public transit routes and walking paths from your location.'
    },
    {
      id: '5',
      task: 'Assemble first aid kit',
      category: 'Medical',
      completed: false,
      priority: 'medium',
      explanation: 'Include medications, bandages, antiseptic, and any mobility-specific supplies you need.'
    },
    {
      id: '6',
      task: 'Create important documents backup',
      category: 'Documents',
      completed: false,
      priority: 'medium',
      explanation: 'Digital copies of ID, insurance, medical records stored securely online or on waterproof USB.'
    },
    {
      id: '7',
      task: 'Connect with neighbors',
      category: 'Community',
      completed: false,
      priority: userProfile.socialSupport === 'isolated' ? 'high' : 'medium',
      explanation: 'Building local connections strengthens everyone\'s resilience. Start with just one neighbor.'
    },
    {
      id: '8',
      task: 'Prepare emergency lighting',
      category: 'Supplies',
      completed: false,
      priority: 'medium',
      explanation: 'Flashlights, battery-powered or hand-crank radio, and extra batteries.'
    }
  ]);

  const completedTasks = checklist.filter(item => item.completed).length;
  const completionPercentage = Math.round((completedTasks / checklist.length) * 100);

  const toggleTask = (id: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-terracotta-600 bg-terracotta-50 border-terracotta-200';
      case 'medium': return 'text-hearth-600 bg-hearth-50 border-hearth-200';
      case 'low': return 'text-sage-600 bg-sage-50 border-sage-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getWelcomeMessage = () => {
    const time = new Date().getHours();
    const greeting = time < 12 ? 'Good morning' : time < 18 ? 'Good afternoon' : 'Good evening';
    
    return `${greeting}, ${userProfile.name}! Let's continue building your resilience today.`;
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-hearth-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-terracotta-400 to-terracotta-600 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <h1 className="text-xl font-bold text-foreground">Hearth</h1>
            </div>
            
            <Button 
              onClick={onOpenChat}
              className="bg-sage-600 hover:bg-sage-700 text-white rounded-full px-6"
            >
              Chat with Assistant
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            {getWelcomeMessage()}
          </h2>
          <p className="text-lg text-muted-foreground">
            Here's your personalized preparedness plan for {userProfile.location}.
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="p-6 mb-8 warm-shadow border-none bg-white/90 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-foreground">Your Progress</h3>
            <span className="text-2xl font-bold text-terracotta-600">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="mb-4" />
          <p className="text-muted-foreground">
            You've completed {completedTasks} of {checklist.length} preparedness tasks. Every step makes you more resilient.
          </p>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Checklist */}
          <div className="lg:col-span-2">
            <Card className="p-6 warm-shadow border-none bg-white/90 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-foreground mb-6">Your Preparedness Checklist</h3>
              
              <div className="space-y-4">
                {checklist
                  .sort((a, b) => {
                    if (a.completed !== b.completed) return a.completed ? 1 : -1;
                    const priorityOrder = { high: 0, medium: 1, low: 2 };
                    return priorityOrder[a.priority] - priorityOrder[b.priority];
                  })
                  .map((item) => (
                    <div 
                      key={item.id} 
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        item.completed 
                          ? 'bg-sage-50 border-sage-200 opacity-75' 
                          : 'bg-white border-gray-200 hover:border-sage-300'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id={item.id}
                          checked={item.completed}
                          onCheckedChange={() => toggleTask(item.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <label 
                              htmlFor={item.id}
                              className={`font-medium cursor-pointer ${
                                item.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                              }`}
                            >
                              {item.task}
                            </label>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(item.priority)}`}>
                              {item.priority} priority
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {item.explanation}
                          </p>
                          <span className="text-xs text-sage-600 font-medium">
                            {item.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="p-6 warm-shadow border-none bg-white/90 backdrop-blur-sm">
              <h4 className="font-semibold text-foreground mb-4">Your Profile</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium">{userProfile.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Household:</span>
                  <span className="font-medium">{userProfile.householdSize} people</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Housing:</span>
                  <span className="font-medium capitalize">{userProfile.housingType.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transportation:</span>
                  <span className="font-medium capitalize">{userProfile.transportation.replace('_', ' ')}</span>
                </div>
              </div>
            </Card>

            {/* Encouragement */}
            <Card className="p-6 warm-shadow border-none bg-gradient-to-br from-sage-50 to-hearth-50">
              <div className="text-center">
                <div className="w-12 h-12 bg-terracotta-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-terracotta-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-foreground mb-2">You're doing great!</h4>
                <p className="text-sm text-muted-foreground">
                  Every small step you take builds your resilience. Remember, this is about progress, not perfection.
                </p>
              </div>
            </Card>

            {/* Community Connection */}
            <Card className="p-6 warm-shadow border-none bg-white/90 backdrop-blur-sm">
              <h4 className="font-semibold text-foreground mb-3">Community</h4>
              <p className="text-sm text-muted-foreground mb-4">
                {userProfile.socialSupport === 'strong' 
                  ? "Your strong community connections are a huge asset for resilience!"
                  : "Building local connections strengthens everyone's ability to weather challenges together."
                }
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full border-sage-300 text-sage-700 hover:bg-sage-50"
              >
                Find Local Resources
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
