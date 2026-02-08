import { faCompassDrafting, faFolderPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function Home() 
{
    return (
        <div className="w-screen h-screen bg-dark-blue-black p-3 sm:p-12">
            <nav className="w-full h-12 flex justify-between items-center">
                <h2 className="text-white"></h2>

                <div className="flex justify-center items-center gap-4 px-2 rounded">
                    <div className="rounded-full w-12 h-12 bg-deep-space-blue"></div>
                    <h2 className="text-white font-semibold">Abhiraj</h2>
                </div>
            </nav>
            <div className="w-full flex-col h-max min-h-64 my-12 flex justify-center">
                <div className="w-full flex-wrap h-10 gap-3 flex justify-start items-center my-3">
                    <input type="search" className="bg-shadow-grey w-full max-w-[320px] h-full p-2 rounded-lg hover:placeholder:text-tiger-orange/50 focus:placeholder:text-tiger-orange/50 outline text-white/80 placeholder:text-white/30 outline-white/10 focus:outline-tiger-orange" placeholder="Search.." />
                    <Link 
                        href={"/create"}
                        className="p-2 rounded-lg h-full bg-shadow-grey flex justify-center gap-2 items-center cursor-pointer w-22 hover:bg-deep-space-blue hover:text-tiger-orange text-white/50 transition-colors shadow-lg border border-white/5">
                        <FontAwesomeIcon icon={faFolderPlus} className="w-5 h-5" />
                        <p className="text-sm">Create</p>
                    </Link>
                    <Link 
                        href={"/drafts"}
                        className="p-2 rounded-lg h-full bg-shadow-grey flex justify-center gap-2 items-center cursor-pointer w-22 hover:bg-deep-space-blue hover:text-tiger-orange text-white/50 transition-colors shadow-lg border border-white/5">
                        <FontAwesomeIcon icon={faCompassDrafting} className="w-5 h-5" />
                        <p className="text-sm">Drafts</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}