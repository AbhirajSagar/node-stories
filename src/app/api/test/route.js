import { createClient } from "@/supabase/server";

export async function GET() 
{
  try
  {
    const supabase = await createClient();
    const { data, error } = await supabase.from("users").select("*");
    return new Response(JSON.stringify({ data, error }));
  }
  catch(err)
  {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }));
  }
}
