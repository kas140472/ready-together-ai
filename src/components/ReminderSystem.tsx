
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface Reminder {
  id: string;
  title: string;
  description: string;
  type: 'weekly' | 'monthly' | 'seasonal' | 'weather' | 'immediate';
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  dueDate?: Date;
  category: string;
}

interface ReminderSystemProps {
  userProfile: {
    location: string;
    reminderPreference: string;
    concernedDisasters?: string[];
    medications?: string;
  };
}

export const ReminderSystem = ({ userProfile }: ReminderSystemProps) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const generatePersonalizedReminders = (): Reminder[] => {
    const base: Reminder[] = [
      {
        id: '1',
        title: 'Check emergency kit',
        description: 'Review and update your emergency supplies',
        type: 'monthly',
        priority: 'medium',
        completed: false,
        category: 'Supplies'
      },
      {
        id: '2',
        title: 'Test smoke detectors',
        description: 'Replace batteries if needed',
        type: 'monthly',
        priority: 'high',
        completed: false,
        category: 'Safety'
      },
      {
        id: '3',
        title: 'Update emergency contacts',
        description: 'Make sure everyone has current contact info',
        type: 'seasonal',
        priority: 'medium',
        completed: false,
        category: 'Communication'
      },
      {
        id: '4',
        title: 'Review evacuation routes',
        description: 'Walk through your escape routes with household members',
        type: 'seasonal',
        priority: 'high',
        completed: false,
        category: 'Planning'
      }
    ];

    // Add location-specific reminders
    if (userProfile.location?.toLowerCase().includes('california')) {
      base.push({
        id: '5',
        title: 'Wildfire season prep',
        description: 'Check defensible space and go-bag',
        type: 'seasonal',
        priority: 'high',
        completed: false,
        category: 'Wildfire'
      });
    }

    // Add medication reminders if applicable
    if (userProfile.medications) {
      base.push({
        id: '6',
        title: 'Check medication supplies',
        description: 'Ensure you have at least 2 weeks of medications',
        type: 'weekly',
        priority: 'high',
        completed: false,
        category: 'Medical'
      });
    }

    // Weather-based reminders
    base.push({
      id: '7',
      title: 'Weather alert check',
      description: 'Review local weather conditions and warnings',
      type: 'weather',
      priority: 'medium',
      completed: false,
      category: 'Weather'
    });

    return base;
  };

  useEffect(() => {
    setReminders(generatePersonalizedReminders());
  }, [userProfile]);

  const toggleReminder = (id: string) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === id 
          ? { ...reminder, completed: !reminder.completed }
          : reminder
      )
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-terracotta-500 text-white';
      case 'low': return 'bg-sage-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'weekly': return '📅';
      case 'monthly': return '🗓️';
      case 'seasonal': return '🍂';
      case 'weather': return '🌤️';
      case 'immediate': return '⚠️';
      default: return '📋';
    }
  };

  const activeReminders = reminders.filter(r => !r.completed);
  const completedReminders = reminders.filter(r => r.completed);

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Smart Reminders
          </h3>
          <p className="text-sm text-muted-foreground">
            Personalized prep tasks for your situation
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="notifications" className="text-sm">
            Notifications
          </Label>
          <Switch
            id="notifications"
            checked={notificationsEnabled}
            onCheckedChange={setNotificationsEnabled}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-3">
          <h4 className="font-medium text-foreground flex items-center">
            📋 Active Tasks ({activeReminders.length})
          </h4>
          {activeReminders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>🎉 All caught up!</p>
              <p className="text-sm">Great job staying prepared.</p>
            </div>
          ) : (
            activeReminders.map(reminder => (
              <div
                key={reminder.id}
                className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <button
                  onClick={() => toggleReminder(reminder.id)}
                  className="w-5 h-5 border-2 border-primary rounded flex items-center justify-center mt-0.5 hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {reminder.completed && <span className="text-xs">✓</span>}
                </button>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium text-foreground">
                      {getTypeIcon(reminder.type)} {reminder.title}
                    </h5>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityColor(reminder.priority)}>
                        {reminder.priority}
                      </Badge>
                      <Badge variant="outline">
                        {reminder.category}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {reminder.description}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {completedReminders.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-muted-foreground flex items-center">
              ✅ Completed ({completedReminders.length})
            </h4>
            {completedReminders.map(reminder => (
              <div
                key={reminder.id}
                className="flex items-start space-x-3 p-4 border rounded-lg bg-muted/20 opacity-60"
              >
                <button
                  onClick={() => toggleReminder(reminder.id)}
                  className="w-5 h-5 bg-primary text-primary-foreground rounded flex items-center justify-center mt-0.5"
                >
                  <span className="text-xs">✓</span>
                </button>
                
                <div className="flex-1">
                  <h5 className="font-medium text-foreground line-through">
                    {getTypeIcon(reminder.type)} {reminder.title}
                  </h5>
                  <p className="text-sm text-muted-foreground line-through">
                    {reminder.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-hearth-50 p-4 rounded-lg">
        <h4 className="font-medium text-foreground mb-2">🔔 Reminder Settings</h4>
        <p className="text-sm text-muted-foreground mb-3">
          Based on your preference: <strong>{userProfile.reminderPreference}</strong>
        </p>
        <div className="space-y-2 text-sm">
          {userProfile.reminderPreference === 'gentle' && (
            <p className="text-sage-700">• Soft notifications, no pressure</p>
          )}
          {userProfile.reminderPreference === 'urgent' && (
            <p className="text-terracotta-700">• Only critical weather alerts</p>
          )}
          <p className="text-muted-foreground">• Tailored to your location and needs</p>
          <p className="text-muted-foreground">• Sync with weather alerts in your area</p>
        </div>
      </div>
    </Card>
  );
};
