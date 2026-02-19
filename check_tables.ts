
import { supabase } from "./lib/supabaseClient";

async function checkTables() {
    const tables = [
        'perfume_to_notes',
        'perfume_to_families',
        'perfume_note_relation',
        'olfactive_families',
        'perfume_notes'
    ];

    for (const table of tables) {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (error) {
            console.log(`Table ${table}: NOT FOUND or Error: ${error.message}`);
        } else {
            console.log(`Table ${table}: SUCCESS (count: ${data.length})`);
            if (data.length > 0) {
                console.log(`Sample columns: ${Object.keys(data[0]).join(', ')}`);
            }
        }
    }
}

checkTables();
