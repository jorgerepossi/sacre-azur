
import { NextResponse } from 'next/server';

import { supabase } from '@/lib/supabaseClient';


export async function GET(
    _: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { data: perfume, error } = await supabase
            .from('perfume')
            .select(`
        *,
        brand(*),
        perfume_note_relation:perfume_note_relation (
          perfume_notes:note_id (id, name)
      `)
            .eq('id', params.id)
            .single();

        if (error || !perfume) {
            return NextResponse.json(
                { error: 'Perfume no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json(perfume);

    } catch (error) {
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}