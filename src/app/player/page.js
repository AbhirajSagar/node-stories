'use client';
import { useEffect, useState } from "react";

export default function Page()
{
    const[json, setJson] = useState({});

    useEffect(() => 
    {
        const data = sessionStorage.getItem('storyData');
        const json = JSON.parse(data);
        console.log(json);
    },[]);
    

    return (
        <div className="w-screen h-screen bg-amber-200 flex flex-col">
            <pre>{JSON.stringify(json, null, 2)}</pre>
        </div>
    );
}