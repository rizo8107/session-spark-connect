
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'expert' | 'admin';
  avatar_url?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider mounted. Setting up auth state listener.');
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting initial session:', error);
          if (mounted) {
            setIsLoading(false);
          }
          return;
        }
        
        if (mounted && session) {
          console.log('Initial session found:', session.user.email);
          await handleAuthState(session);
        } else if (mounted) {
          console.log('No initial session found');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    const handleAuthState = async (session: Session | null) => {
      if (!mounted) return;
      
      console.log('Handling auth state change:', session?.user?.email || 'No session');
      setSession(session);

      try {
        if (session?.user) {
          // User is authenticated, fetch their profile from the 'profiles' table.
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            // An unexpected error occurred (not 'profile not found').
            console.error('Error fetching profile:', error);
            setUser(null);
          } else if (profile) {
            // Profile found, create our custom user object.
            const userData: User = {
              id: profile.id,
              email: profile.email,
              name: profile.name,
              role: (profile.role as 'user' | 'expert' | 'admin') || 'user',
              avatar_url: profile.avatar_url || undefined,
              bio: profile.bio || undefined,
            };
            console.log('Setting user from existing profile:', userData.email, 'Role:', userData.role);
            setUser(userData);
          } else if (error?.code === 'PGRST116') {
            // This case handles when a user exists in `auth.users` but has no `profiles` row.
            console.warn('Profile not found, attempting to create one.');
            const { data: newProfile, error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: session.user.id,
                email: session.user.email!,
                name: session.user.user_metadata?.name || session.user.email!,
                role: 'user'
              })
              .select()
              .single();

            if (insertError) {
              console.error('Error creating profile:', insertError);
              setUser(null);
            } else if (newProfile) {
              console.log('Successfully created and set new profile for:', newProfile.email);
              setUser({
                id: newProfile.id,
                email: newProfile.email,
                name: newProfile.name,
                role: (newProfile.role as 'user' | 'expert' | 'admin') || 'user',
                avatar_url: newProfile.avatar_url || undefined,
                bio: newProfile.bio || undefined,
              });
            }
          }
        } else {
          // User is not authenticated.
          console.log('No session, clearing user.');
          setUser(null);
        }
      } catch (e) {
        console.error('An unexpected error occurred in handleAuthState:', e);
        setUser(null);
      } finally {
        // Always set loading to false after handling auth state
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        console.log(`Auth state change event: ${event}`, session?.user?.email);
        await handleAuthState(session);
      }
    );

    // Get initial session
    getInitialSession();

    // Cleanup function
    return () => {
      mounted = false;
      console.log('AuthProvider unmounted. Cleaning up auth subscription.');
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    console.log('Attempting login for:', email);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error('Login error:', error);
      throw error;
    }
    console.log('Login successful');
  };

  const register = async (email: string, password: string, name: string, role = 'user') => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
          role: role,
        },
      },
    });
    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from('profiles')
      .update({ ...userData })
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;

    if (data) {
        const updatedUser: User = {
            id: data.id,
            email: data.email,
            name: data.name,
            role: (data.role as 'user' | 'expert' | 'admin') || 'user',
            avatar_url: data.avatar_url || undefined,
            bio: data.bio || undefined,
        };
        setUser(updatedUser);
    }
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
