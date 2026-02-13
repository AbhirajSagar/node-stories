import { createClient } from "@/supabase/server";

export default async function POST(req)
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
        
        const supabase = await createClient();
        if(!supabase) return new Response(JSON.stringify({message: "Internal Server Error"}),{status: 500});

        const filePath = `thumbnails/${crypto.randomUUID()}`;
        const { data, error } = await supabase.storage.from('media-public').upload(filePath, thumbnail, {cacheControl: '3600',upsert: false});

        if (error)
        {
            console.error('Supabase Storage Upload Error:', error);
            return new Response(JSON.stringify('Thumbnail was not uploaded'), { status: 500 });
        }

        const { data: publicUrlData, error: publicUrlError } = supabase.storage.from('media-public').getPublicUrl(filePath);
        
        if (publicUrlError)
        {
            console.error('Supabase Get Public URL Error:', publicUrlError);
            return new Response(JSON.stringify('Error getting public url for the uploaded thumbnail'), { status: 500 });
        }

        const { data: genreData, error: genreError} = supabase.from('genres').select('genreid').eq('name', genre).maybeSingle()
        if(genreError)
        {
            console.error('Error while getting genre id');
            return new Response(JSON.stringify('Error while getting genre id'), {status: 500});
        }

        console.log(genreData.genreid);
        const {data: storyData, error: storyError} = supabase.from('stories')
        .update
        ({
            published: true,
            thumbnailUrl: data.publicUrl,
            genre: genreData.genreid
        })
        .eq('storyid',storyid)

        return new Response({message: 'Published Successfully'}, {status: 200})
    }
    catch(err)
    {
        
    }
}