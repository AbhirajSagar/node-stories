import { createClient } from "@/supabase/server";

export async function POST(req)
{
    try
    {
        const formData = await req.formData();
        const storyid = formData.get("storyid");
        if(!storyid) return new Response(JSON.stringify({message: "Story Id is required"}),{status: 400});

        const thumbnail = formData.get("thumbnail");
        if(!thumbnail) return new Response(JSON.stringify({message: "Thumbnail is required"}),{status: 400});

        const genre = formData.get("genre");
        if(!genre) return new Response(JSON.stringify({message: "Genre is required"}),{status: 400});
        
        console.table({storyid,thumbnail,genre})

        const supabase = await createClient();
        if(!supabase) return new Response(JSON.stringify({message: "Internal Server Error"}),{status: 500});

        const filePath = `thumbnails/${crypto.randomUUID()}`;
        const { data, error } = await supabase.storage.from('media-public').upload(filePath, thumbnail, {cacheControl: '3600',upsert: false});
        console.log(data);
        if (error)
        {
            console.error('Supabase Storage Upload Error:', error);
            return new Response(JSON.stringify('Thumbnail was not uploaded'), { status: 500 });
        }

        const { data: publicUrlData, error: publicUrlError } = supabase.storage.from('media-public').getPublicUrl(filePath);
        console.log(publicUrlData);

        if (publicUrlError)
        {
            console.error('Supabase Get Public URL Error:', publicUrlError);
            return new Response(JSON.stringify('Error getting public url for the uploaded thumbnail'), { status: 500 });
        }

        const {data: storyData, error: storyError} = await supabase.from('stories')
        .update
        ({
            published: true,
            thumbnailUrl: publicUrlData.publicUrl,
            genre: genre,
            published_at: new Date().toISOString()
        })
        .eq('storyid',storyid)
        .select();

        console.log(storyData);

        if(storyError)
        {
            console.error('Error while updating the publishing status');
            return new Response(JSON.stringify('Error while publishing the story'), {status: 500});
        }

        return new Response(JSON.stringify({message: 'Published Successfully', data: storyData}), {status: 200})
    }
    catch(err)
    {
        console.error('error occured while publishing');
        return new Response(JSON.stringify({message: 'Internal Server Error'}), {status: 500})
    }
}