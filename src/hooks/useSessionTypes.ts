
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

export const useSessionTypes = (expertId?: string) => {
  return useQuery({
    queryKey: ['session-types', expertId],
    queryFn: async () => {
      let query = supabase.from('session_types').select('*');
      
      if (expertId) {
        query = query.eq('expert_id', expertId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Tables<'session_types'>[];
    },
    enabled: !!expertId,
  });
};

export const useCreateSessionType = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (sessionType: TablesInsert<'session_types'>) => {
      const { data, error } = await supabase
        .from('session_types')
        .insert(sessionType)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session-types'] });
    },
  });
};
