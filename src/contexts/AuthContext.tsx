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
  // isLoading is true only until the initial auth state is determined.
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This effect runs only once on mount to set up the auth listener.
    // Supabase's onAuthStateChange handles the initial session check automatically.
    console.log('AuthProvider mounted. Setting up auth state listener.');

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`Auth state change event: ${event}`, session?.user?.email);
        setSession(session);

        if (session?.user) {
          try {
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
                role: profile.role,
                avatar_url: profile.avatar_url || undefined,
                bio: profile.bio || undefined,
              };
              console.log('Setting user from existing profile:', userData.email);
              setUser(userData);
            } else if (error?.code === 'PGRST116') {
              // This case handles when a user exists in `auth.users` but has no `profiles` row.
              // This can happen if a database trigger for profile creation fails.
              // We'll create a profile for them here as a fallback.
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
                  role: newProfile.role,
                  avatar_url: newProfile.avatar_url || undefined,
                  bio: newProfile.bio || undefined,
                });
              }
            }
          } catch (e) {
            console.error('An unexpected error occurred in onAuthStateChange:', e);
            setUser(null);
          }
        } else {
          // User is not authenticated.
          console.log('No session, clearing user.');
          setUser(null);
        }

        // IMPORTANT: The loading state should be set to false after the first
        // auth event is handled, establishing whether a user is logged in or not.
        setIsLoading(false);
      }
    );

    // Cleanup function: Unsubscribe from the listener when the component unmounts.
    return () => {
      console.log('AuthProvider unmounted. Cleaning up auth subscription.');
      subscription.unsubscribe();
    };
  }, []); // The empty dependency array ensures this effect runs only once.


  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    // The onAuthStateChange listener will handle updating the user state.
  };

  const register = async (email: string, password: string, name: string, role = 'user') => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
          role: role, // This metadata can be used by a DB trigger to create the profile.
        },
      },
    });
    if (error) throw error;
    // The onAuthStateChange listener will handle the new user.
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

    // Update the local state with the successfully updated data.
    if (data) {
        const updatedUser: User = {
            id: data.id,
            email: data.email,
            name: data.name,
            role: data.role,
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