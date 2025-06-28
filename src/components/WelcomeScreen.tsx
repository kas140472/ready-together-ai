
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full text-center animate-fade-in">
        {/* Hearth Logo/Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-terracotta-400 to-terracotta-600 rounded-full flex items-center justify-center mb-6 warm-shadow">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Welcome to <span className="text-terracotta-600">Hearth</span>
          </h1>
          <p className="text-xl text-muted-foreground font-medium">
            Your Personal Disaster Companion
          </p>
        </div>

        {/* Main Message Card */}
        <Card className="p-8 mb-8 warm-shadow border-none bg-white/80 backdrop-blur-sm">
          <div className="space-y-6 text-left">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-foreground mb-3">
                You are cared for
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Disasters don't affect everyone equally. That's why Hearth creates a personalized preparedness plan that understands your unique situation, needs, and community.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-sage-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-sage-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Personalized</h3>
                <p className="text-sm text-muted-foreground">
                  Based on your location, living situation, and specific needs
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-hearth-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-hearth-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Actionable</h3>
                <p className="text-sm text-muted-foreground">
                  Clear steps and reminders that fit into your daily life
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-terracotta-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-terracotta-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Community-Centered</h3>
                <p className="text-sm text-muted-foreground">
                  Connect with neighbors and build mutual support networks
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Call to Action */}
        <div className="space-y-4">
          <Button 
            onClick={onStart}
            size="lg"
            className="bg-terracotta-600 hover:bg-terracotta-700 text-white px-8 py-4 text-lg font-medium rounded-full transition-all duration-200 hover:scale-105 warm-shadow"
          >
            Let's Get Started
          </Button>
          <p className="text-sm text-muted-foreground">
            Takes about 3 minutes • Your information stays private
          </p>
        </div>
      </div>
    </div>
  );
};
