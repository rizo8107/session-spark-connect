
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Expert = Tables<'experts'> & {
  profiles?: Tables<'profiles'>;
  session_types?: Tables<'session_types'>[];
};

export const useExperts = () => {
  return useQuery({
    queryKey: ['experts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('experts')
        .select(`
          *,
          profiles:user_id(*),
          session_types(*)
        `)
        .in('status', ['approved', 'active']);
      
      if (error) throw error;
      return data as Expert[];
    },
  });
};

export const useExpert = (id: string) => {
  return useQuery({
    queryKey: ['expert', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('experts')
        .select(`
          *,
          profiles:user_id(*),
          session_types(*)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Expert;
    },
  });
};

export const useCreateExpert = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (expert: TablesInsert<'experts'>) => {
      const { data, error } = await supabase
        .from('experts')
        .insert(expert)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experts'] });
    },
  });
};

export const useUpdateExpert = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: TablesUpdate<'experts'> }) => {
      const { data, error } = await supabase
        .from('experts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experts'] });
    },
  });
};

export const useAdminExperts = () => {
  return useQuery({
    queryKey: ['admin-experts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('experts')
        .select(`
          *,
          profiles:user_id(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Expert[];
    },
  });
};
