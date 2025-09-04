'use client';

import { useState } from 'react';
import { useConfig } from '@/contexts/config-context';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';

export function ConfigDialog() {
  const { config, setConfig } = useConfig();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    apiUrl: config.apiUrl,
    apiToken: config.apiToken,
    refetchInterval: config.refetchInterval / 1000, // Store in seconds for UI
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!formData.apiUrl.trim() || !formData.apiToken.trim()) {
      alert('Please fill in both API URL and Token');
      return;
    }

    // Validate refetch interval
    const interval = Number(formData.refetchInterval);
    if (isNaN(interval) || interval < 5 || interval > 300) {
      alert('Refetch interval must be between 5 and 300 seconds');
      return;
    }

    // Remove trailing slash from URL if present
    const cleanUrl = formData.apiUrl.replace(/\/$/, '');
    
    setConfig({
      apiUrl: cleanUrl,
      apiToken: formData.apiToken.trim(),
      refetchInterval: interval * 1000, // Convert to milliseconds
    });
    
    setOpen(false);
  };

  const handleInputChange = (field: 'apiUrl' | 'apiToken' | 'refetchInterval') => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      // Reset form data to current config when dialog opens
      if (newOpen) {
        setFormData({
          apiUrl: config.apiUrl,
          apiToken: config.apiToken,
          refetchInterval: config.refetchInterval / 1000,
        });
      }
    }}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="fixed top-4 right-4 z-50 shadow-lg"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>CTFd Configuration</DialogTitle>
          <DialogDescription>
            Configure your CTFd instance API URL and token to connect to the scoreboard.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiUrl">API URL</Label>
            <Input
              id="apiUrl"
              type="url"
              placeholder="https://your-ctfd-instance.com"
              value={formData.apiUrl}
              onChange={handleInputChange('apiUrl')}
              required
            />
            <p className="text-xs text-muted-foreground">
              The base URL of your CTFd instance (without /api/v1)
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="apiToken">API Token</Label>
            <Input
              id="apiToken"
              type="password"
              placeholder="Your CTFd API token"
              value={formData.apiToken}
              onChange={handleInputChange('apiToken')}
              required
            />
            <p className="text-xs text-muted-foreground">
              You can find this in your CTFd admin panel under Settings → Security
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="refetchInterval">Auto-refresh Interval (seconds)</Label>
            <Input
              id="refetchInterval"
              type="number"
              min="5"
              max="300"
              placeholder="30"
              value={formData.refetchInterval}
              onChange={handleInputChange('refetchInterval')}
              required
            />
            <p className="text-xs text-muted-foreground">
              How often to refresh data automatically (5-300 seconds)
            </p>
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Configuration
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
