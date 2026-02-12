import { createClient } from "@/supabase/server";

export async function POST(req,{params})
{
    try
    {
        const {id} = await params;
        const {flow} = await req.json();
        if(!id) return new Response(JSON.stringify({error: 'Missing story ID'}), {status: 400});

        const supabase = await createClient();
        if(!supabase) throw new Error('Error connecting to supabase');

        const {data, error} = await supabase
            .from('stories')
            .update({flow})
            .eq('storyid', id)
            .select()
            .single();
        
        if(error) return new Response(JSON.stringify({message: 'Failed to update', error: error.message}), {status: 400});
        return new Response(JSON.stringify({message: 'Updated successfully', data}), {status: 200});
    }
    catch(err)
    {
        console.log(err);
        return new Response(JSON.stringify({error: err.message}), {status: 500});
    }
}