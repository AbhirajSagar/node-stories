import { createClient } from "@/supabase/server";

const VALID_FILE_TYPES = ['image', 'video', 'audio', 'thumbnail'];

export async function POST(request)
{
    try
    {
        const formData = await request.formData();
        const file = formData.get('file');
        const fileType = formData.get('fileType');

        if(!file || !fileType || !VALID_FILE_TYPES.includes(fileType))
            return new Response('Bad Request', { status: 400 });
 
        const supabase = await createClient();
        if(!supabase)
        {
            console.error('Supabase client creation failed');
            throw new Error('Supabase client creation failed');
        }
        
        const filePath = `${fileType}/${crypto.randomUUID()}`;
        const { data, error } = await supabase.storage.from('media-public').upload(filePath, file, {cacheControl: '3600',upsert: false});

        if (error)
        {
            console.error('Supabase Storage Upload Error:', error);
            return new Response('Error uploading file', { status: 500 });
        }

        const { data: publicUrlData, error: publicUrlError } = supabase.storage.from('media-public').getPublicUrl(filePath);
        
        if (publicUrlError)
        {
            console.error('Supabase Get Public URL Error:', publicUrlError);
            return new Response('Error getting public URL', { status: 500 });
        }

        return new Response(JSON.stringify({ publicUrlData }), { status: 200 });
    }
    catch(err)
    {
        console.error('Error in POST /api/storage:', err);
        return new Response('Internal Server Error', { status: 500 });
    }
}