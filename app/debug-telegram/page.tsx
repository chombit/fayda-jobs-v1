'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function DebugTelegramPage() {
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const testTelegramAPI = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      console.log('🧪 Testing Telegram API route...');
      
      const response = await fetch('/api/test-telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      
      console.log('📊 Telegram API test result:', result);
      setTestResult(result);
      
      if (result.success) {
        toast.success('✅ Telegram API test completed! Check console for details.');
        if (result.telegramResult) {
          toast.success('📤 Telegram post sent successfully!');
        }
      } else {
        toast.error(`❌ Telegram API test failed: ${result.error}`);
      }
    } catch (error: any) {
      console.error('❌ Error testing Telegram API:', error);
      toast.error(`❌ Error: ${error.message}`);
      setTestResult({ error: error.message });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Telegram Debug Tool</h1>
          <p className="text-muted-foreground">
            Debug automatic Telegram job posting functionality.
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Test Telegram Posting</CardTitle>
            <CardDescription>
              Test if the server-side Telegram posting is working correctly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button 
                onClick={testTelegramAPI}
                disabled={isTesting}
                className="w-full"
              >
                {isTesting ? 'Testing...' : 'Test Telegram API'}
              </Button>
              
              {testResult && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Test Result:</h4>
                  <pre className="text-xs overflow-auto bg-background p-2 rounded border">
                    {JSON.stringify(testResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Troubleshooting Steps</CardTitle>
            <CardDescription>
              If Telegram posting isn't working, follow these steps:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">1. Check Environment Variables</h4>
                <p className="text-sm text-muted-foreground">
                  Make sure TELEGRAM_BOT_TOKEN and TELEGRAM_CHANNEL_ID are set in Vercel.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">2. Check Bot Permissions</h4>
                <p className="text-sm text-muted-foreground">
                  Ensure the bot is admin of @faydajobs with posting permissions.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">3. Check Console Logs</h4>
                <p className="text-sm text-muted-foreground">
                  Open browser dev tools and check console for error messages.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">4. Test Manual Posting</h4>
                <p className="text-sm text-muted-foreground">
                  Use the test button above to verify the API is working.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
