import { createClient } from '@/lib/supabase/client';
import type { Tables } from '@/lib/supabase/client';

type NewsletterSubscriberInsert = Tables['newsletter_subscribers']['Insert'];

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Ensure the email is a string and matches the database schema
    const subscriberData: NewsletterSubscriberInsert = {
      email: String(email),
      created_at: new Date().toISOString()
    };

    const supabase = createClient();
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert([subscriberData])
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error in newsletter API:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Error saving subscription' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
