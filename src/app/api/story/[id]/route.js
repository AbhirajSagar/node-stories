import { getCurrentUser } from '@/services/getCurrentUser';
import {createClient} from '@/supabase/server'

export async function GET({params})
{
    try
    {
        const user = await getCurrentUser();
        if(!user) return new Response(JSON.stringify('Unauthorized'),{status:401});

        const {id} = params;
        const supabase = await createClient();
        if(!supabase) throw new Error('Error connecting to supabase');

        const {data, error} = await supabase.from('stories').select('*').eq('id', id).single();
        if(error || !data) return new Response(JSON.stringify({error: 'Story not found'}), {status: 404});

        return new Response(JSON.stringify({data}), {status: 200});
    }
    catch(err)
    {
        console.error(err)
        return new Response(JSON.stringify({error: err.message}), {status: 500});
    }
}