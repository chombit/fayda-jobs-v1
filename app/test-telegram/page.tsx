'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { testTelegramConnection, sendTestJobPost } from '@/lib/telegram-bot';
import { toast } from 'sonner';

export default function TestTelegramPage() {
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testPostStatus, setTestPostStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus('testing');
    
    try {
      const isConnected = await testTelegramConnection();
      
      if (isConnected) {
        setConnectionStatus('success');
        toast.success('✅ Telegram bot connection successful!');
      } else {
        setConnectionStatus('error');
        toast.error('❌ Telegram bot connection failed. Check your bot token and channel ID.');
      }
    } catch (error) {
      setConnectionStatus('error');
      toast.error('❌ Error testing Telegram connection');
      console.error('Telegram connection test error:', error);
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSendTestPost = async () => {
    setIsSendingTest(true);
    setTestPostStatus('sending');
    
    try {
      const isSent = await sendTestJobPost();
      
      if (isSent) {
        setTestPostStatus('success');
        toast.success('✅ Test job post sent to Telegram successfully!');
      } else {
        setTestPostStatus('error');
        toast.error('❌ Failed to send test job post. Check bot permissions and channel access.');
      }
    } catch (error) {
      setTestPostStatus('error');
      toast.error('❌ Error sending test job post');
      console.error('Test post error:', error);
    } finally {
      setIsSendingTest(false);
    }
  };

  const getStatusBadge = (status: 'idle' | 'testing' | 'sending' | 'success' | 'error') => {
    switch (status) {
      case 'idle':
        return <Badge variant="outline">Not Tested</Badge>;
      case 'testing':
      case 'sending':
        return <Badge variant="secondary">Testing...</Badge>;
      case 'success':
        return <Badge variant="default" className="bg-green-500">Success</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Telegram Bot Testing</h1>
          <p className="text-muted-foreground">
            Test your Telegram bot connection and automatic job posting functionality.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Connection Test Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Test Bot Connection
                {getStatusBadge(connectionStatus)}
              </CardTitle>
              <CardDescription>
                Verify that your bot token is valid and can connect to Telegram.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">What this tests:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Bot token validity</li>
                    <li>• Telegram API connectivity</li>
                    <li>• Bot authentication</li>
                  </ul>
                </div>
                <Button 
                  onClick={handleTestConnection}
                  disabled={isTestingConnection}
                  className="w-full"
                >
                  {isTestingConnection ? 'Testing...' : 'Test Connection'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Test Post Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Send Test Job Post
                {getStatusBadge(testPostStatus)}
              </CardTitle>
              <CardDescription>
                Send a sample job post to your Telegram channel to verify posting works.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Sample post content:</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>🔥 NEW JOB OPPORTUNITY</p>
                    <p>📋 Senior Software Engineer</p>
                    <p>🏢 Tech Company Ethiopia</p>
                    <p>📍 Addis Ababa</p>
                    <p>💼 Full-time</p>
                    <p>📂 IT Jobs</p>
                    <p>🔗 View Full Details & Apply</p>
                  </div>
                </div>
                <Button 
                  onClick={handleSendTestPost}
                  disabled={isSendingTest}
                  className="w-full"
                >
                  {isSendingTest ? 'Sending...' : 'Send Test Post'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Configuration Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Configuration Check</CardTitle>
            <CardDescription>
              Verify your environment variables are set correctly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Required Environment Variables:</h4>
                  <div className="space-y-2 text-sm font-mono">
                    <div>TELEGRAM_BOT_TOKEN</div>
                    <div>TELEGRAM_CHANNEL_ID</div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Current Status:</h4>
                  <div className="space-y-2 text-sm">
                    <div>Bot Token: {process.env.NODE_ENV === 'development' ? '✅ Configured' : 'Check .env file'}</div>
                    <div>Channel ID: {process.env.NODE_ENV === 'development' ? '✅ Configured' : 'Check .env file'}</div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-300">📋 Setup Checklist:</h4>
                <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                  <li>✅ Created bot via @BotFather</li>
                  <li>✅ Added bot as admin to @faydajobs channel</li>
                  <li>✅ Set bot permissions (post, edit, delete)</li>
                  <li>✅ Added TELEGRAM_BOT_TOKEN to .env</li>
                  <li>✅ Added TELEGRAM_CHANNEL_ID to .env</li>
                  <li>✅ Test connection above</li>
                  <li>✅ Send test post above</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>
              Once testing is complete, your automatic job posting is ready!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <h4 className="font-semibold mb-2 text-green-700 dark:text-green-300">🎉 What Happens Next:</h4>
                <ul className="text-sm text-green-600 dark:text-green-400 space-y-1">
                  <li>• When you post a job on your website, it automatically appears in Telegram</li>
                  <li>• Limited information is shown to drive traffic to your website</li>
                  <li>• Users click "Apply Now" to view full details on your site</li>
                  <li>• All posts include direct links back to your job pages</li>
                </ul>
              </div>
              
              <div className="flex gap-4">
                <Button asChild>
                  <a href="/admin">Go to Admin Panel</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/TELEGRAM-BOT-SETUP.md" target="_blank">
                    View Setup Guide
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
