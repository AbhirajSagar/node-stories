export async function saveMediaToStorage(file, fileType)
{
    try
    {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileType', fileType);

        const requestOptions = { method: 'POST', body: formData };
        const response = await fetch('/api/storage/upload', requestOptions);

        if(!response.ok) throw new Error(`Failed to upload media: ${response.statusText}`);

        const data = await response.json();
        console.log("Media uploaded to Supabase, public URL data:", data);
        return data.publicUrlData.publicUrl;
    }
    catch (err)
    {
        console.error("Error uploading media to Supabase:", err);
        throw err;
    }
}