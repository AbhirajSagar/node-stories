import { getCurrentUser } from "@/services/getCurrentUser";
import { createClient } from '@/supabase/server';

export async function POST(req)
{
    try
    {
        const user = await getCurrentUser();
        if(!user) return new Response(JSON.stringify({ message: 'Unauthorized'}), {status: 401});

        const { userid, email, name } = user;
        const { title, description } = await req.json();
        const supabase = await createClient();
        if(!supabase) throw new Error('Error while connecting to supabase');

        const flow = 
        {
            name: title,
            description,
            slides: [],
            appearance:
            {
                bg_from: '#0f172a',
                bg_to: '#020617',
                hovered_option_from: '#ED8836',
                hovered_option_to: '#FB923C',
                option_from:'#ffffff',
                option_to:'#e2e2e2'
            },
            timing: { delay: 0 },
        };

        const { data, error } = await supabase.from('stories').insert([
        {
            name: title,
            description,
            flow,
            userid
        }]).select().single();

        if(error) throw new Error(error.message);
        return new Response(JSON.stringify({ message: "Story created successfully", storyId: data.storyid }), { status: 200 });
    }
    catch(err)
    {
        console.error('Error while creating the story', err);
        return new Response(JSON.stringify({ error: 'Failed to create story' }), { status: 500 });
    }
}
