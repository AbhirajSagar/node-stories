import { faCirclePlus, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function CreateProjectModal({onClose, onCreate})
{
    const [name, setName] = useState("");

    function HandleBackgroundClick(e)
    {
        if (e.target === e.currentTarget)
        {
            onClose();
        }
    }

    return (
        <div onClick={HandleBackgroundClick} className="w-full h-screen absolute top-0 left-0 bg-black/60 backdrop-blur-xs">
            <div 
                onClick={(e) =>
                {
                    e.stopPropagation();
                }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-dark-blue-black border border-white/5 rounded-lg p-6 w-full max-w-md"
            >
                <h3 className="text-xl text-center font-bold mb-4">Create New Project</h3>
                <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)} 
                    className="w-full bg-shadow-grey border border-white/5 rounded-lg p-2 mb-4 text-white placeholder-white/30" 
                    placeholder="Project Name"
                />
                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="flex-1 relative flex items-center justify-center gap-2 p-2 cursor-pointer rounded-lg bg-shadow-grey hover:bg-deep-space-blue transition-all border border-white/5 text-white/80 hover:text-tiger-orange">
                        <FontAwesomeIcon icon={faX} />
                        <span>Cancel</span>
                    </button>
                    <button onClick={() => { onCreate(name); onClose(); }} className="flex-1 relative flex items-center justify-center gap-2 p-2 cursor-pointer rounded-lg bg-shadow-grey hover:bg-deep-space-blue transition-all border border-white/5 text-white/80 hover:text-tiger-orange">
                        <FontAwesomeIcon icon={faCirclePlus} />
                        <span>Create</span>
                    </button>
                </div>
            </div>
        </div>
    );
}