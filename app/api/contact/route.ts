import { createClient } from '@/lib/supabase/client';
import type { Tables } from '@/lib/supabase/client';

type ContactInsert = Tables['contacts']['Insert'];

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();
    
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Nombre, email y mensaje son requeridos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Ensure the values are strings and match the database schema
    const contactData: ContactInsert = {
      name: String(name),
      email: String(email),
      message: String(message),
      created_at: new Date().toISOString()
    };

    const supabase = createClient();
    const { error } = await supabase
      .from('contacts')
      .insert([contactData])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error in contact API:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Error saving contact message' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
