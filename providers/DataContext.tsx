import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const DataContext = createContext<any>(null);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  // Estado organizado por tablas para que sea más fácil de usar
  const [dbData, setDbData] = useState<{
    brands: any[],
    tenants_products: any[],
    perfumes: any[],
    orders: any[],
    order_shipping: any[]
  }>({
    brands: [],
    tenants_products: [],
    perfumes: [],
    orders: [],
    order_shipping: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tablas = ['brands', 'tenants_products', 'perfumes', 'orders', 'order_shipping'];

    const fetchInicial = async () => {
      setLoading(true);
      
      // Lanzamos todas las peticiones al mismo tiempo para ganar velocidad
      const promesas = tablas.map(tabla => supabase.from(tabla).select('*'));
      const resultados = await Promise.all(promesas);

      const nuevosDatos: any = {};
      tablas.forEach((tabla, index) => {
        nuevosDatos[tabla] = resultados[index].data || [];
      });

      setDbData(nuevosDatos);
      setLoading(false);
    };

    fetchInicial();

    // SUSCRIPCIÓN MULTI-TABLA
    const channel = supabase.channel('cambios-globales');

    tablas.forEach((tabla) => {
      channel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: tabla },
        (payload) => {
          console.log(`Cambio en ${tabla}:`, payload);
          
          setDbData((prev: any) => {
            const listaActual = prev[tabla];
            let nuevaLista = [...listaActual];

            if (payload.eventType === 'INSERT') {
              nuevaLista = [...nuevaLista, payload.new];
            } else if (payload.eventType === 'UPDATE') {
              nuevaLista = nuevaLista.map(item => item.id === payload.new.id ? payload.new : item);
            } else if (payload.eventType === 'DELETE') {
              nuevaLista = nuevaLista.filter(item => item.id !== payload.old.id);
            }

            return { ...prev, [tabla]: nuevaLista };
          });
        }
      );
    });

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <DataContext.Provider value={{ ...dbData, loading }}>
      {children}
    </DataContext.Provider>
  );
};

export const useDatos = () => useContext(DataContext);