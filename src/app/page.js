"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faFileUpload, faTrash, faFolderOpen, faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { GetProjectsList, CreateProject, DeleteProject, ImportProjectFromZip } from "@/utils/FileUtils";
import EditorArea from "@/components/EditorArea";
import { ReactFlowProvider } from "@xyflow/react";

export default function Home() 
{
    const [view, setView] = useState("dashboard"); 
    const [projects, setProjects] = useState([]);
    const [currentProjectId, setCurrentProjectId] = useState(null);

    useEffect(() => { RefreshProjects(); }, []);

    function RefreshProjects()
    {
        setProjects(GetProjectsList());
    }

    function HandleCreateNew()
    {
        const name = prompt("Enter Project Name:", "My Awesome Story");
        if(!name) return;
        const id = CreateProject(name);
        OpenProject(id);
    }

    async function HandleImport(e)
    {
        const file = e.target.files?.[0];
        if(!file) return;
        try {
            const id = await ImportProjectFromZip(file);
            RefreshProjects();
            OpenProject(id);
        } catch(err) {
            console.error(err);
            alert("Failed to import project.");
        }
    }

    function OpenProject(id)
    {
        setCurrentProjectId(id);
        setView("editor");
    }

    function HandleDelete(id, e)
    {
        e.stopPropagation();
        if(confirm("Are you sure? This cannot be undone.")) {
            DeleteProject(id);
            RefreshProjects();
        }
    }

    if (view === "editor" && currentProjectId) {
        return (
            <ReactFlowProvider>
                <EditorArea projectId={currentProjectId} onBack={() => { setView("dashboard"); RefreshProjects(); }} />
            </ReactFlowProvider>
        );
    }

    return (
        <div className="w-full min-h-screen bg-dark-blue-black flex flex-col items-center p-6 text-white font-outfit">
            <div className="mb-12 text-center mt-10 w-full flex justify-between items-center">
                <div className="flex flex-col items-center mb-4">
                    <button className="text-6xl font-bold text-transparent from-orange-500 to-amber-400 bg-linear-to-r bg-clip-text tracking-tight cursor-pointer">
                        NODE
                        <span className="text-4xl font-normal text-white"> Stories</span>
                    </button>
                </div>
                <div className="gap-2 flex flex-col">
                    <button onClick={HandleCreateNew} className="px-4 py-2 w-full rounded-lg bg-shadow-grey flex justify-center gap-2 items-center cursor-pointer hover:bg-deep-space-blue hover:text-tiger-orange transition-colors shadow-lg border border-white/5 text-white/80">
                        <FontAwesomeIcon icon={faCirclePlus} /> 
                        New Project
                    </button>        
                    <button className="px-4 py-2 w-full rounded-lg  relative bg-shadow-grey flex justify-center gap-2 items-center cursor-pointer hover:bg-deep-space-blue hover:text-tiger-orange transition-colors shadow-lg border border-white/5 text-white/80">
                        <FontAwesomeIcon icon={faFolderOpen} /> 
                        <input type="file" accept=".zip" onChange={HandleImport} className="absolute inset-0 opacity-0 cursor-pointer" />
                        Import Project
                    </button>        
                </div>
            </div>

            <div className="grid w-full gap-2 sm:grid-cols-2">
                {projects.length === 0 && <p className="col-span-full text-center text-white/20">No projects found. Create one!</p>}
                
                {projects.map((p) => (
                    <div key={p.id} onClick={() => OpenProject(p.id)} className="group bg-shadow-grey border border-white/5 p-6 rounded-xl hover:border-tiger-orange cursor-pointer transition-all relative">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-tiger-orange transition-colors">{p.name}</h3>
                        <p className="text-xs text-white/30">Last Modified: {new Date(p.lastModified).toLocaleDateString()}</p>
                        <button onClick={(e) => HandleDelete(p.id, e)} className="absolute top-4 right-4 text-white/20 hover:text-red-500 p-2 transition-colors">
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}