
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AdminInvitation } from '@/types/database';
import { Mail, Plus, Trash2 } from 'lucide-react';

export function AdminInvitations() {
  const { toast } = useToast();
  const [invitations, setInvitations] = useState<AdminInvitation[]>([]);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingInvite, setSendingInvite] = useState(false);
  
  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('admin_invitations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvitations(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch invitations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSendingInvite(true);
    try {
      const response = await supabase.functions.invoke('send-admin-invitation', {
        body: { email },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to send invitation');
      }

      toast({
        title: "Success",
        description: "Admin invitation sent successfully",
      });

      setEmail('');
      fetchInvitations();
    } catch (error: any) {
      console.error('Invitation send error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSendingInvite(false);
    }
  };

  const deleteInvitation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('admin_invitations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Invitation deleted successfully",
      });

      fetchInvitations();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Admin Invitations
        </CardTitle>
        <CardDescription>
          Send invitations to new admin users
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Send Invitation Form */}
        <form onSubmit={sendInvitation} className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={sendingInvite}>
                <Plus className="h-4 w-4 mr-2" />
                {sendingInvite ? 'Sending...' : 'Send Invite'}
              </Button>
            </div>
          </div>
        </form>

        {/* Invitations List */}
        <div className="space-y-4">
          <h4 className="font-medium">Sent Invitations</h4>
          {loading ? (
            <p className="text-gray-500">Loading invitations...</p>
          ) : invitations.length === 0 ? (
            <p className="text-gray-500">No invitations sent yet.</p>
          ) : (
            <div className="space-y-2">
              {invitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{invitation.email}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>
                        Status: {invitation.used ? 'Used' : 
                                new Date(invitation.expires_at) < new Date() ? 'Expired' : 'Pending'}
                      </span>
                      <span>
                        Sent: {new Date(invitation.created_at).toLocaleDateString()}
                      </span>
                      <span>
                        Expires: {new Date(invitation.expires_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteInvitation(invitation.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}