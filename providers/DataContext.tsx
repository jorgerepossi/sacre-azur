import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';


const DataContext = createContext<any>(null);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [datos, setDatos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const fetchInicial = async () => {
      const { data } = await supabase.from('brands').select('*');
      if (data) setDatos(data);
      setLoading(false);
    };
    fetchInicial();

   
    const channel = supabase
      .channel('sistema-principal')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'brands' }, (payload) => {
        console.log('Cambio detectado:', payload);
        
        
        if (payload.eventType === 'INSERT') {
          setDatos((prev) => [...prev, payload.new]);
        } else if (payload.eventType === 'UPDATE') {
          setDatos((prev) => prev.map(item => item.id === payload.new.id ? payload.new : item));
        } else if (payload.eventType === 'DELETE') {
          setDatos((prev) => prev.filter(item => item.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <DataContext.Provider value={{ datos, loading }}>
      {children}
    </DataContext.Provider>
  );
};

export const useDatos = () => useContext(DataContext);