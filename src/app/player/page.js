'use client';

import { useEffect, useState } from "react";

export default function Page()
{
    const [data, setData] = useState('');

    useEffect(() => 
    {
        const dataObjString = sessionStorage.getItem('data',undefined);
        if(!dataObjString) return;
        
        const dataObj = JSON.parse(dataObjString);
        setData(dataObj);
        console.log(dataObj);
    },[])

    return (
        <div className="w-screen h-screen bg-deep-space-blue">
            {data}
        </div>
    );
}