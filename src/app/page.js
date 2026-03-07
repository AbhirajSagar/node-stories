"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faFolderOpen, faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { GetProjectsList, CreateProject, DeleteProject } from "@/utils/FileUtils";
import { useRouter } from "next/navigation";
import CreateProjectModal from "@/components/Modals/CreateProjectModal";

export default function Home() 
{
    const [projects, setProjects] = useState([]);
    const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
    const router = useRouter();

    useEffect(() => { RefreshProjects(); }, []);

    async function RefreshProjects()
    {
        setProjects(GetProjectsList());
    }

    function HandleCreateNew()
    {
        setIsCreateProjectModalOpen(true);
    }

    function OpenProject(id)
    {
        router.push(`/editor/${id}`);
    }

    function HandleDelete(id, e)
    {
        e.stopPropagation();
        if(confirm("Are you sure? This cannot be undone.")) 
        {
            DeleteProject(id);
            RefreshProjects();
        }
    }

    return (
        <div className="w-full min-h-screen bg-dark-blue-black text-white font-outfit flex flex-col items-center px-4 py-10">
            <div className="w-full max-w-5xl">
                <div className="flex flex-col items-center text-center mb-14">
                    <div className="flex items-end gap-1">
                        <h2 className="text-4xl font-extrabold bg-linear-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent tracking-tight">
                            NODE
                        </h2>
                        <span className="text-lg text-white/70">Stories</span>
                    </div>
                    <p className="text-white/30 text-sm">
                        Build and manage your interactive story projects
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mb-5 max-w-sm outline-shadow-grey outline-2 p-2 rounded-lg outline-dashed mx-auto">
                    <button onClick={HandleCreateNew} className="flex-1 relative flex items-center justify-center gap-2 p-2 cursor-pointer rounded-lg bg-shadow-grey hover:bg-deep-space-blue transition-all border border-white/5 text-white/80 hover:text-tiger-orange">
                        <FontAwesomeIcon icon={faCirclePlus} />
                        <span>Create Project</span>
                    </button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {
                        projects.length === 0 && 
                        (
                            <div className="col-span-full text-center py-16 border border-dashed border-white/10 rounded-2xl text-white/30">
                                No projects yet. Create your first one.
                            </div>
                        )
                    }

                    {projects.map((p) => (
                        <div 
                            key={p.id} 
                            onClick={() => OpenProject(p.id)} 
                            className="group flex justify-between bg-shadow-grey/70 backdrop-blur-sm border border-white/5 hover:border-tiger-orange p-4 rounded-lg cursor-pointer transition-all hover:shadow-xl hover:shadow-orange-500/5"
                        >
                            <div className="h-full">
                                <h3 className="text-lg font-semibold group-hover:text-tiger-orange transition-colors">{p.name}</h3>
                                <p className="text-xs text-white/30">Last Modified · {new Date(p.lastModified).toLocaleDateString()}</p>
                            </div>
                            
                            <div className="flex flex-col h-full justify-center gap-2">
                                <button onClick={(e) => HandleDelete(p.id, e)} className="h-max bg-shadow-grey outline-white/10 hover:bg-red-700 outline-1 rounded p-2 cursor-pointer">
                                    <FontAwesomeIcon icon={faTrash}/>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {isCreateProjectModalOpen && <CreateProjectModal onClose={() => setIsCreateProjectModalOpen(false)} onCreate={(name) => {CreateProject(name); RefreshProjects();}} />}
        </div>
    );
}