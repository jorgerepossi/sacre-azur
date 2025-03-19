import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { OrderType } from '@/types/order.type';


export const useOrders = () => {
    return useQuery<OrderType[]>({
        queryKey: ['orders'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('orders')
                .select('id, order_code, order_email, order_products, created_at');

            if (error) throw error;
            return data;
        }
    });
};
