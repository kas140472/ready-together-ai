
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface CitizenAppConnectProps {
  userProfile: {
    citizenApp?: string;
    location: string;
    socialSupport: string;
    emergencyContacts?: string;
  };
}

export const CitizenAppConnect = ({ userProfile }: CitizenAppConnectProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [sharingEnabled, setSharingEnabled] = useState(false);
  const [nearbyUsers] = useState([
    { id: '1', name: 'Sarah M.', distance: '0.3 mi', verified: true },
    { id: '2', name: 'David L.', distance: '0.5 mi', verified: true },
    { id: '3', name: 'Maria G.', distance: '0.8 mi', verified: false },
  ]);

  const getCitizenAppStatus = () => {
    switch (userProfile.citizenApp) {
      case 'yes-active': return { status: 'Active User', color: 'bg-green-500' };
      case 'yes-occasional': return { status: 'Occasional User', color: 'bg-yellow-500' };
      case 'no-interested': return { status: 'Interested', color: 'bg-blue-500' };
      case 'no-not-interested': return { status: 'Not Interested', color: 'bg-gray-500' };
      default: return { status: 'Unknown', color: 'bg-gray-400' };
    }
  };

  const status = getCitizenAppStatus();

  return (
    <Card className="p-6 space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Community Connections
        </h3>
        <p className="text-sm text-muted-foreground">
          Connect with neighbors for mutual aid and safety
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <div>
              <h4 className="font-medium">Citizen App</h4>
              <div className="flex items-center space-x-2">
                <Badge className={`${status.color} text-white`}>
                  {status.status}
                </Badge>
              </div>
            </div>
          </div>
          {userProfile.citizenApp === 'no-not-interested' ? (
            <Button variant="outline" disabled>
              Not Available
            </Button>
          ) : (
            <Button
              onClick={() => setIsConnected(!isConnected)}
              variant={isConnected ? "default" : "outline"}
            >
              {isConnected ? "Connected" : "Connect"}
            </Button>
          )}
        </div>

        {isConnected && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="sharing">Share location during emergencies</Label>
              <Switch
                id="sharing"
                checked={sharingEnabled}
                onCheckedChange={setSharingEnabled}
              />
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Nearby Hearth Users</h4>
              {nearbyUsers.map(user => (
                <div key={user.id} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-hearth-200 rounded-full flex items-center justify-center">
                      <span className="text-hearth-700 font-medium text-sm">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.distance} away</p>
                    </div>
                    {user.verified && (
                      <Badge variant="outline" className="text-xs">
                        ✓ Verified
                      </Badge>
                    )}
                  </div>
                  <Button size="sm" variant="outline">
                    Connect
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-sage-50 p-4 rounded-lg">
          <h4 className="font-medium text-foreground mb-2">🤝 Community Features</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Share real-time safety updates</p>
            <p>• Coordinate evacuation carpools</p>
            <p>• Offer/request mutual aid</p>
            <p>• Group emergency planning</p>
            {userProfile.socialSupport === 'isolated' && (
              <p className="text-terracotta-600 font-medium">
                • Building local connections can greatly improve your safety
              </p>
            )}
          </div>
        </div>

        {userProfile.socialSupport === 'limited' || userProfile.socialSupport === 'isolated' ? (
          <div className="bg-terracotta-50 p-4 rounded-lg border border-terracotta-200">
            <h4 className="font-medium text-terracotta-800 mb-2">💡 Building Your Network</h4>
            <div className="space-y-2 text-sm text-terracotta-700">
              <p>• Start with one neighbor introduction</p>
              <p>• Join local community groups or apps</p>
              <p>• Attend neighborhood meetings</p>
              <p>• Share preparedness tips with others</p>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-medium text-green-800 mb-2">🌟 Strong Network</h4>
            <p className="text-sm text-green-700">
              Your existing local connections are a huge asset for emergency preparedness!
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
