import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X, Smartphone } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for successful installation
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowInstallBanner(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
      setDeferredPrompt(null);
    }
  };

  // Don't show if already installed or no prompt available
  if (isInstalled || !showInstallBanner || !deferredPrompt) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 mb-6 relative" data-testid="card-install-pwa">
      <button
        onClick={() => setShowInstallBanner(false)}
        className="absolute top-2 right-2 text-white/80 hover:text-white"
        aria-label="Close install banner"
        data-testid="button-close-install-banner"
      >
        <X className="h-4 w-4" />
      </button>
      
      <div className="flex items-start gap-4">
        <div className="p-3 bg-white/20 rounded-lg">
          <Smartphone className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1" data-testid="text-install-title">
            Install The FR2P Club App
          </h3>
          <p className="text-sm text-white/90 mb-3" data-testid="text-install-description">
            Install our app on your phone to easily share your affiliate link and recruit new members on the go!
          </p>
          <Button
            onClick={handleInstallClick}
            className="bg-white text-blue-600 hover:bg-white/90"
            size="sm"
            data-testid="button-install-app"
          >
            <Download className="h-4 w-4 mr-2" />
            Install Now
          </Button>
        </div>
      </div>
    </Card>
  );
}
