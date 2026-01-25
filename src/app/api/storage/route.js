import { createClient } from "@/supabase/server";
const VALID_FILE_TYPES = ['image', 'video', 'audio'];

export async function POST(request, response)
{
    try
    {
        const formData = await request.formData();
        const jsonData = await request.json();

        const file = formData.get('file');

        if (!file) return new Response('No file provided', { status: 400 });
        if (jsonData.fileType === undefined) return new Response('No file type provided', { status: 400 });
        if (!VALID_FILE_TYPES.includes(jsonData.fileType)) return new Response('Invalid file type', { status: 400 });

        const supabase = createClient();
        const { data, error } = await supabase.storage.from('media-public')
        .upload(`${jsonData.fileType}/${file.name}`, file, 
        {
            cacheControl: '3600',
            upsert: false
        });

        if (error)
        {
            console.error('Supabase Storage Upload Error:', error);
            return new Response('Error uploading file', { status: 500 });
        }

        return new Response(JSON.stringify({ path: data.path }), { status: 200 });
    }
    catch(err)
    {
        console.error('Error in POST /api/storage:', err);
        return new Response('Internal Server Error', { status: 500 });
    }
}