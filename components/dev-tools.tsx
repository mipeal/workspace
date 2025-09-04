import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FirstBloodAnimation } from '@/components/first-blood-animation';
import { LiquidAnimation } from '@/components/liquid-animation';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useConfig } from '@/contexts/config-context';
import { ChallengeSolve } from '@/types/ctfd';

/**
 * DevTools component providing testing functionality for developers
 */
export function DevTools() {
  // State management outside of Dialog component's scope
  const [showFirstBloodAnimation, setShowFirstBloodAnimation] = useState(false);
  const [showLeaderChangeAnimation, setShowLeaderChangeAnimation] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { config, setConfig } = useConfig();
  const [refetchInterval, setRefetchInterval] = useState(config.refetchInterval / 1000);
  
  // Mock data for testing first blood animation
  const mockSolve: ChallengeSolve = {
    account_id: 1234,
    name: "TestUser",
    date: new Date().toISOString(),
    account_url: "/users/1234"
  };
  
  const mockChallengeName = "Super Hard Challenge";
  
  // Mock data for testing leader change animation
  const mockLeaderChangeData = {
    previousLeader: {
      name: "OldChampion",
      score: 4850
    },
    newLeader: {
      name: "NewChampion",
      score: 5200
    }
  };
  
  // Handler functions
  const handleTestFirstBlood = useCallback(() => {
    // First close the dialog
    setDialogOpen(false);
    
    // Small delay to ensure dialog closes first
    setTimeout(() => {
      setShowFirstBloodAnimation(true);
    }, 100);
  }, []);

  const handleCloseFirstBlood = useCallback(() => {
    setShowFirstBloodAnimation(false);
  }, []);
  
  const handleTestLeaderChange = useCallback(() => {
    // First close the dialog
    setDialogOpen(false);
    
    // Small delay to ensure dialog closes first
    setTimeout(() => {
      setShowLeaderChangeAnimation(true);
    }, 100);
  }, []);

  const handleCloseLeaderChange = useCallback(() => {
    setShowLeaderChangeAnimation(false);
  }, []);
  
  const handleRefetchIntervalChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const valueInSeconds = Number(e.target.value) || 30;
    setRefetchInterval(valueInSeconds);
  }, []);
  
  const updateRefetchInterval = useCallback(() => {
    const intervalInMs = refetchInterval * 1000;
    setConfig({
      ...config,
      refetchInterval: intervalInMs
    });
  }, [config, refetchInterval, setConfig]);

  return (
    <>
      {/* Floating dev tools button with controlled dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            size="sm" 
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            <Settings className="h-4 w-4 mr-2" /> Dev Tools
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Development Tools</DialogTitle>
            <DialogDescription>
              Tools for testing application features in development mode
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="animations" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="animations">Animations</TabsTrigger>
              <TabsTrigger value="api">API Settings</TabsTrigger>
              <TabsTrigger value="other">Other</TabsTrigger>
            </TabsList>
            
            <TabsContent value="animations">
              <Card>
                <CardHeader>
                  <CardTitle>Animation Tests</CardTitle>
                  <CardDescription>Trigger UI animations manually</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">First Blood Animation</h3>
                      <Button 
                        onClick={handleTestFirstBlood} 
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Test First Blood Animation
                      </Button>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2">Leader Change Animation</h3>
                      <Button 
                        onClick={handleTestLeaderChange} 
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        Test Leader Change Animation
                      </Button>
                    </div>
                    {/* Add more animation tests here */}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="api">
              <Card>
                <CardHeader>
                  <CardTitle>API Rate Limit Controls</CardTitle>
                  <CardDescription>Adjust API polling settings to avoid rate limiting</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="refetch-interval">
                        Refetch Interval (seconds)
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="refetch-interval"
                          type="number"
                          min="5"
                          value={refetchInterval}
                          onChange={handleRefetchIntervalChange}
                          className="w-32"
                        />
                        <Button onClick={updateRefetchInterval}>
                          Update
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Current interval: {config.refetchInterval / 1000}s. Increase this value if you&apos;re experiencing rate limiting.
                      </p>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-1">Rate Limiting Tips</h3>
                      <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1">
                        <li>Recommended: 30+ seconds during active use</li>
                        <li>Use 60+ seconds for background monitoring</li>
                        <li>CTFd API has rate limits that vary by server</li>
                        <li>Changes apply to all polling requests</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="other">
              <Card>
                <CardHeader>
                  <CardTitle>Other Development Tools</CardTitle>
                  <CardDescription>Additional testing utilities</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    No additional tools yet. Add more dev features here as needed.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* First Blood Animation for testing */}
      <FirstBloodAnimation 
        isVisible={showFirstBloodAnimation}
        solve={mockSolve}
        challengeName={mockChallengeName}
        onClose={handleCloseFirstBlood}
      />
      
      {/* Leader Change Animation for testing */}
      <LiquidAnimation
        isVisible={showLeaderChangeAnimation}
        onAnimationComplete={handleCloseLeaderChange}
        previousLeader={mockLeaderChangeData.previousLeader}
        newLeader={mockLeaderChangeData.newLeader}
      />
    </>
  );
}
