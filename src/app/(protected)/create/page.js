'use client';
import Link from 'next/link'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faUpRightFromSquare, faX } from "@fortawesome/free-solid-svg-icons";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Page()
{
    const [error, setError] = useState(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    async function createStory(e)
    {
        e.preventDefault();
        setIsLoading(true)
        
        try
        {
            const requestOptions = 
            {
                "method": "POST",
                "headers": {"Content-Type": "application/json"},
                "body": JSON.stringify({"title": e.target.title.value, "description": e.target.description.value})
            };

            const req = await fetch('/api/story/create', requestOptions);
            const data = await req.json();
            console.log(data);
            router.push(`/editor/${data.storyId}`);
        }
        catch(err)
        {
            console.error(err);
            setError(err.message);
        }
        finally
        {
            setIsLoading(false);
        }
    }

    return (
        <div className='w-full h-screen flex bg-shadow-grey justify-center items-center'>
            <div className="w-full sm:h-120 sm:w-xl sm:rounded-lg h-screen bg-dark-blue-black flex justify-center items-center flex-col p-6 sm:p-8">
                {error && <p className='bg-red-500/10 text-white/50 rounded p-2 mb-4'>{error}</p>}
                {isLoading ? <Loading/> : <Form createStory={createStory} setError={setError} error={error}/>}
            </div>
        </div>
    );
}

function Loading()
{
    return (
        <div className='w-full h-full flex justify-center items-center flex-col m-5'>
            <FontAwesomeIcon icon={faClock} bounce className='text-white/50 text-3xl'/>
            <p className='text-white/50'>Loading...</p>
        </div>
    );
}

function Form({createStory, setError, error})
{
    return (
        <>
            <h2 className="w-full text-white font-semibold text-3xl mb-1">
                    Create Story
            </h2>
            <p className="w-full text-white/60 mb-6">
                You can edit these details later
            </p>
            <form className="space-y-5 w-full" onSubmit={createStory}>
                <div className="flex flex-col gap-2">
                    <label htmlFor="title" className="text-white/70 text-sm">
                        Title
                    </label>
                    <input 
                        type="text" 
                        id="title" 
                        name="title" 
                        placeholder="Enter title"
                        className="bg-deep-space-blue border border-shadow-grey rounded-lg px-4 py-2.5 text-white placeholder-white/40 outline-none focus:border-tiger-orange transition"
                        required
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="description" className="text-white/70 text-sm">
                        Description
                    </label>
                    <textarea 
                        id="description" 
                        name="description" 
                        placeholder="Enter description"
                        rows="4"
                        required
                        className="bg-deep-space-blue border border-shadow-grey rounded-lg px-4 py-2.5 text-white placeholder-white/40 outline-none focus:border-tiger-orange transition resize-none"
                    ></textarea>
                </div>

                <div className="w-full flex gap-2">
                    <Link href={'/'} className="w-full p-2 rounded-lg bg-shadow-grey flex justify-center gap-2 items-center cursor-pointer text-white/50 hover:bg-deep-space-blue hover:text-tiger-orange transition-colors shadow-lg border border-white/5">
                        <FontAwesomeIcon icon={faX}/>
                        <p className='text-xs'>Cancel</p>
                    </Link>
                    <button 
                        type="submit"
                        className="w-full p-2 rounded-lg bg-shadow-grey flex justify-center gap-2 items-center cursor-pointer text-white/50 hover:bg-deep-space-blue hover:text-tiger-orange transition-colors shadow-lg border border-white/5"
                    >
                        <FontAwesomeIcon icon={faUpRightFromSquare}/>
                        <p className='text-xs'>Open Editor</p>
                    </button>
                </div> 
            </form>
        </>
    );
}