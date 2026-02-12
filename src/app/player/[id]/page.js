import { createClient } from "@/supabase/server";
import Player from "@/components/Player";
import Error from "@/components/Error";

export default async function PlayerPage({params})
{
    try
    {
        const {id} = await params;
        const supabase = await createClient();
        if(!supabase) throw new Error({message : "Couldn't connect to supabase"})

        const {data, error} = await supabase
        .from('stories')
        .select('*')
        .eq('storyid',id)
        .maybeSingle();

        if(error) throw error
        return <Player storyJson={data.flow}/>
    }
    catch(err)
    {
        console.log(err)
        return <Error message={err}/>
    }
}
