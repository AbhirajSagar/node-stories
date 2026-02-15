import { getCurrentUser } from "@/services/getCurrentUser";
import { faCircleUser, faCompassDrafting, faFolderPlus, faMagnifyingGlass, faPerson } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createClient } from "@/supabase/server";
import Link from "next/link";
import ErrorComponent from "@/components/Error";
import ProfileIcon from "@/components/ProfileIcon";

export default async function Home() 
{
    try
    {
        const {userid, name} = await getCurrentUser();
        
        const supabase = await createClient();
        if(!supabase) throw new Error('Failed to connect to database');

        const { data, error } = await supabase.from('stories').select('*, genres(name)').eq('published', true);
        if(error) throw error;

        return (
            <div className="w-full min-h-screen h-max bg-dark-blue-black p-3 sm:p-12">
                <Navbar name={name} />
                <QuickActions faFolderPlus={faFolderPlus} faCompassDrafting={faCompassDrafting} />
                <Feed stories={data}/>
            </div>
        );
    }
    catch(err)
    {
        console.log(err);
        return <ErrorComponent err={err}/>
    }
}

function Navbar({name}) 
{
    return (
        <nav className="w-full  h-12 flex sm:justify-between justify-center mb-5 items-center">
            <img src='/logo.svg' className="w-12 h-auto" />
            <Account name={name} />
        </nav>
    );
}

function Account({name}) 
{
    return (
        <Link href={'/profile'} className="hidden hover:bg-shadow-grey cursor-pointer lg:outline-white/10 p-2 outline-white/10 sm:flex justify-center items-center gap-4 rounded-full">
            <ProfileIcon name={name} />
            <h2 className="hidden lg:block text-white font-semibold text-right mr-2">{name.split(' ')[0]}</h2>
        </Link>
    );
}

function QuickActions() 
{
    return (
        <div className="w-full flex-col h-max flex justify-start items-start">
            <div className="w-full h-10 gap-1.5 sm:gap-3 flex justify-center items-center">
                <Link href={"/profile"} className="rounded-lg sm:hidden h-full bg-shadow-grey flex justify-center gap-2 items-center cursor-pointer w-10 hover:bg-deep-space-blue hover:text-tiger-orange text-white/50 transition-colors shadow-lg border border-white/5">
                    <FontAwesomeIcon icon={faCircleUser} className="w-4 h-4" />
                </Link>
                <Link href={"/search"} className="rounded-lg h-full bg-shadow-grey flex justify-center gap-2 items-center cursor-pointer w-22 hover:bg-deep-space-blue hover:text-tiger-orange text-white/50 transition-colors shadow-lg border border-white/5">
                    <FontAwesomeIcon icon={faMagnifyingGlass} className="w-4 h-4" />
                    <p className="text-xs sm:text-sm">Search</p>
                </Link>
                <Link href={"/create"} className="rounded-lg h-full bg-shadow-grey flex justify-center gap-2 items-center cursor-pointer w-22 hover:bg-deep-space-blue hover:text-tiger-orange text-white/50 transition-colors shadow-lg border border-white/5">
                    <FontAwesomeIcon icon={faFolderPlus} className="w-4 h-4" />
                    <p className="text-xs sm:text-sm">Create</p>
                </Link>
                <Link href={"/drafts"} className="rounded-lg h-full bg-shadow-grey flex justify-center gap-2 items-center cursor-pointer w-22 hover:bg-deep-space-blue hover:text-tiger-orange text-white/50 transition-colors shadow-lg border border-white/5">
                    <FontAwesomeIcon icon={faCompassDrafting} className="w-4 h-4" />
                    <p className="text-xs sm:text-sm">Drafts</p>
                </Link>
            </div>
        </div>
    );
}

export function Feed({stories})
{
    return (
        <div className="w-full min-h-screen h-max bg-dark-blue-black lg:p-10">
            <div className="grid gap-2 w-full grid-cols-1 p-3 min-[350px]:grid-cols-2 min-[576px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {stories.map((story,idx) => <StoryCard key={idx} story={story} />)}
            </div>
        </div>
    );
}

export function StoryCard({story})
{
    const {name, storyid, thumbnailUrl, published_at} = story;
    const date = new Date(published_at)
    const dateLabel = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    return (
        <Link href={`/player/${storyid}`} className="w-full overflow-hidden bg-deep-space-blue outline outline-white/10 relative aspect-9/16 rounded">
            {thumbnailUrl ? <img src={thumbnailUrl} alt={name} className="w-full h-full hover:scale-110 transition-transform duration-300 ease-in-out object-cover rounded"/> : <div className="w-full h-full flex justify-center items-start p-5 text-white/50"><p>No Thumbnail Assigned</p></div>}
            <div className="w-full bg-shadow-grey absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-white font-bold text-lg">{name}</h3>
                <div className="w-full flex justify-between items-center">
                    <p className="text-gray-400 text-xs">{dateLabel}</p>
                    {story.genres?.name && <div className="bg-red-500/40 outline-red-500 h-6 flex justify-center items-center outline text-xs text-white/50 w-max rounded-full px-3 my-2">{story.genres.name.toUpperCase()}</div>}
                </div>
            </div>
        </Link>
    )
}