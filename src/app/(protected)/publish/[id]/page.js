import ErrorComponent from "@/components/Error";
import PublishPage from "@/components/PublishPage";
import { createClient } from "@/supabase/server";

export default async function Page({params})
{
    try
    {
        const {id} = await params;
        if(!id) throw new Error('Invalid Story Id');
        const supabase = await createClient();
        
        const {data: storyData, error: storyError} = await supabase.from('stories').select('*').eq('storyid',id);
        if(storyError) throw storyError;
        
        const {data: genresData, error: genresError} = await supabase.from('genres').select('*');
        if(genresError) throw genresError;

        const data =
        {
            story : storyData[0],
            genres : genresData
        }

        console.log(data)
        return <PublishPage storyData={data}/>
    }
    catch(err)
    {
        console.error(err);
        return <ErrorComponent err={err}/>
    }
}