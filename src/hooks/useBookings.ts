
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

export type Booking = Tables<'bookings'> & {
  profiles?: Tables<'profiles'>;
  experts?: Tables<'experts'> & {
    profiles?: Tables<'profiles'>;
  };
  session_types?: Tables<'session_types'>;
};

export const useBookings = () => {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          profiles:user_id(*),
          experts:expert_id(*, profiles:user_id(*)),
          session_types:session_type_id(*)
        `)
        .order('scheduled_at', { ascending: true });
      
      if (error) throw error;
      return data as Booking[];
    },
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (booking: TablesInsert<'bookings'>) => {
      const { data, error } = await supabase
        .from('bookings')
        .insert(booking)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};
