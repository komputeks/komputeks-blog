'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Mail, Server } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { Button, Card, CardBody, Input, Textarea } from '@/components/ui';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [settings, setSettings] = useState({
    siteName: 'Komputeks Blog',
    siteDescription: 'Modern full-stack technology blog',
    emailFrom: 'noreply@komputeks.com',
    smtpHost: '',
    smtpPort: '587',
    smtpUser: '',
    smtpPass: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleSave = async () => {
    setLoading(true);
    // In a real app, this would save to database
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Settings saved');
    setLoading(false);
  };

  if (authLoading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>;
  }

  if (!user) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>

      <div className="space-y-6">
        <Card>
          <CardBody>
            <h2 className="text-lg font-semibold mb-4 dark:text-white flex items-center gap-2">
              <Server className="w-5 h-5" />
              Site Settings
            </h2>
            <div className="space-y-4">
              <Input
                label="Site Name"
                value={settings.siteName}
                onChange={e => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
              />
              <Textarea
                label="Site Description"
                value={settings.siteDescription}
                onChange={e => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                rows={3}
              />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h2 className="text-lg font-semibold mb-4 dark:text-white flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email Settings
            </h2>
            <div className="space-y-4">
              <Input
                label="From Email"
                type="email"
                value={settings.emailFrom}
                onChange={e => setSettings(prev => ({ ...prev, emailFrom: e.target.value }))}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="SMTP Host"
                  value={settings.smtpHost}
                  onChange={e => setSettings(prev => ({ ...prev, smtpHost: e.target.value }))}
                  placeholder="smtp.example.com"
                />
                <Input
                  label="SMTP Port"
                  value={settings.smtpPort}
                  onChange={e => setSettings(prev => ({ ...prev, smtpPort: e.target.value }))}
                  placeholder="587"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="SMTP Username"
                  value={settings.smtpUser}
                  onChange={e => setSettings(prev => ({ ...prev, smtpUser: e.target.value }))}
                />
                <Input
                  label="SMTP Password"
                  type="password"
                  value={settings.smtpPass}
                  onChange={e => setSettings(prev => ({ ...prev, smtpPass: e.target.value }))}
                />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Supports Resend, Brevo, and Mailgun SMTP configurations.
              </p>
            </div>
          </CardBody>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} loading={loading}>
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
