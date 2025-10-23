import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '@/integrations/supabase/client';
import { setAuth, setIsAdmin, logout as logoutAction } from '@/store/slices/authSlice';
import { RootState } from '@/store';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, session, isAdmin, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      dispatch(setAuth({ user: session?.user ?? null, session }));
      
      if (session?.user) {
        // Check admin status
        setTimeout(() => {
          checkAdminStatus(session.user.id);
        }, 0);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      dispatch(setAuth({ user: session?.user ?? null, session }));
      
      if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
        setTimeout(() => {
          checkAdminStatus(session.user.id);
        }, 0);
      } else if (event === 'SIGNED_OUT') {
        dispatch(setIsAdmin(false));
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();

      if (!error && data) {
        dispatch(setIsAdmin(true));
      } else {
        dispatch(setIsAdmin(false));
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      dispatch(setIsAdmin(false));
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });
    return { error };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    dispatch(logoutAction());
  };

  return {
    user,
    session,
    isAdmin,
    loading,
    signIn,
    signUp,
    logout,
  };
};
