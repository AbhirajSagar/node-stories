import { getCurrentUser } from '@/services/getCurrentUser';
import { createClient } from '@/supabase/server';

export async function GET(req, { params })
{
    try
    {
        const { id } = await params;
        console.log('id is', id);

        const user = await getCurrentUser();
        if(!user) return new Response(JSON.stringify('Unauthorized'), { status: 401 });

        const supabase = await createClient();
        if(!supabase) throw new Error('Error connecting to supabase');

        const { data, error } = await supabase
            .from('stories')
            .select('*')
            .eq('storyid', id);

        if(error)
        {
            console.error(error);
            return new Response(JSON.stringify({ error: 'Story not found' }), { status: 404 });
        }
        
        return new Response(JSON.stringify({data: data[0]}), { status: 200 });
    }
    catch(err)
    {
        console.error(err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
