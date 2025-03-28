
import { NextResponse } from 'next/server';
import {supabase} from "@/lib/supabaseClient";



export async function GET(request: Request) {

    try {
        const { searchParams } = new URL(request.url);


        let query = supabase
            .from('perfume')
            .select('*, brand(name, image)')
            .order('created_at');


        const brands = searchParams.get('brands');
        if (brands) {
            const brandArray = brands.split(',');
            query = query.in('brand_id', brandArray);
        }

        const { data, error } = await query;

        if (error) throw error;

        return NextResponse.json(data, {
            headers: {
                'Cache-Control': 'public, max-age=3600',
                'CDN-Cache-Control': 'public, max-age=3600'
            }
        });

    } catch (error) {
        console.error('Error en API:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}