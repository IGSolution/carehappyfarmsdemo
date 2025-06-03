
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/database';
import { AuthContext, AuthContextType } from '@/contexts/AuthContext';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    console.log('Fetched profile data:', profileData);
    setProfile(profileData);
    return profileData;
  };

  const refreshProfile = async () => {
    if (!user) return;
    await fetchProfile(user.id);
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile
          const profileData = await fetchProfile(session.user.id);
          
          // Store auth token in localStorage when email is confirmed
          if (session.user.email_confirmed_at) {
            localStorage.setItem('auth_token', session.access_token);
            console.log('User email is confirmed, stored auth token');
          } else {
            console.log('User email is not confirmed, removing auth token');
            localStorage.removeItem('auth_token');
          }
        } else {
          setProfile(null);
          localStorage.removeItem('auth_token');
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id).then((profileData) => {
          // Store auth token if email is confirmed
          if (session.user.email_confirmed_at) {
            localStorage.setItem('auth_token', session.access_token);
            console.log('Initial: User email is confirmed, stored auth token');
          } else {
            console.log('Initial: User email is not confirmed, removing auth token');
            localStorage.removeItem('auth_token');
          }
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData: any) => {
    console.log('Attempting sign up for:', email);
    
    const redirectUrl = `${window.location.origin}/auth?confirmed=true`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
        emailRedirectTo: redirectUrl
      }
    });
    
    console.log('Sign up result:', { data, error });
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    console.log('Attempting sign in for:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      return { data, error };
    }

    // Check if user has confirmed their email
    if (data.user && !data.user.email_confirmed_at) {
      // Sign out the user since they haven't confirmed their email
      await supabase.auth.signOut();
      return { 
        data: null, 
        error: { 
          message: 'Please confirm your email before signing in. Check your email for the confirmation link.' 
        } 
      };
    }

    return { data, error };
  };

  const signOut = async () => {
    console.log('Signing out');
    localStorage.removeItem('auth_token');
    await supabase.auth.signOut();
  };

  const verifyEmail = async (token_hash: string) => {
    try {
      console.log('Verifying email with token:', token_hash);
      
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash,
        type: 'signup'
      });

      if (error) {
        console.error('Email verification error:', error);
        return { data: null, error };
      }

      console.log('Email verification successful:', data);

      // Update profile to mark as verified
      if (data.user) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            is_verified: true,
            verification_code: token_hash,
            verification_code_expires_at: new Date().toISOString()
          })
          .eq('id', data.user.id);

        if (updateError) {
          console.error('Error updating profile verification status:', updateError);
          return { data, error: updateError };
        } else {
          console.log('Profile verification status updated successfully');
          
          // Update local profile state
          setProfile(prev => prev ? { 
            ...prev, 
            is_verified: true,
            verification_code: token_hash,
            verification_code_expires_at: new Date().toISOString()
          } : prev);
          
          // Store auth token after verification
          if (data.session) {
            localStorage.setItem('auth_token', data.session.access_token);
            console.log('Verification complete, stored auth token');
          }
        }
      }

      return { data, error: null };
    } catch (error) {
      console.error('Email verification catch error:', error);
      return { data: null, error };
    }
  };

  const resendConfirmation = async () => {
    if (!user) {
      return { error: { message: 'No user found' } };
    }

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email!,
        options: {
          emailRedirectTo: `${window.location.origin}/auth?confirmed=true`
        }
      });

      if (error) {
        return { error };
      }

      return { data: { message: 'Confirmation email sent successfully' }, error: null };
    } catch (error) {
      return { error };
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;
    
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);
    
    if (!error && profile) {
      setProfile({ ...profile, ...updates });
    }
  };

  const value: AuthContextType = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    verifyEmail,
    resendConfirmation,
    refreshProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}