
import { createContext } from 'react';
import { User, Session, AdminUserAttributes } from '@supabase/supabase-js';
import { Profile } from '@/types/database';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  verifyEmail: (token_hash: string) => Promise<any>;
  resendConfirmation: () => Promise<any>;
  refreshProfile: () => Promise<void>;
  inviteUser:(email:string)=>Promise<any>
 
  
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
