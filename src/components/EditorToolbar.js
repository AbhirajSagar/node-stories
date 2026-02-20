    import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExport, faPlay, faCog, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function EditorToolbar({ onExport, onPlay, onBack, onToggleSettings })
{
    const btnClass = "px-4 py-2 w-full rounded-lg bg-shadow-grey flex justify-center gap-2 items-center cursor-pointer hover:bg-deep-space-blue hover:text-tiger-orange transition-colors shadow-lg border border-white/5 text-white/80";

    return (
        <>
            {/* Left Vertical Toolbar */}
            <div className="absolute top-4 left-4 z-40 flex flex-col items-center gap-2">
                {/* Back / Brand */}
                <div className="flex flex-col items-center mb-4">
                    <button onClick={onBack} className="text-xl font-bold text-transparent from-orange-500 to-amber-400 bg-linear-to-r bg-clip-text tracking-tight cursor-pointer">
                        NODE
                        <span className="text-sm font-normal text-white"> Stories</span>
                    </button>
                </div>

                {/* Actions */}
                <button onClick={onExport} className={btnClass} title="Download ZIP">
                    <FontAwesomeIcon icon={faFileExport} className="w-4 h-4" />
                    <span className="text-sm font-medium">Export</span>
                </button>

                <button onClick={onPlay} className={btnClass} title="Preview Story">
                    <FontAwesomeIcon icon={faPlay} className="w-4 h-4" />
                    <span className="text-sm font-medium">Preview</span>
                </button>
            </div>

            <div className="absolute top-4 right-4 z-40">
                <button 
                    onClick={onToggleSettings} 
                    className="p-2 w-full rounded-lg bg-shadow-grey flex justify-center gap-2 items-center cursor-pointer hover:bg-deep-space-blue hover:text-tiger-orange transition-colors shadow-lg border border-white/5 text-white/80" 
                    title="Settings"
                >
                    <FontAwesomeIcon icon={faCog} className="w-5 h-5" />
                </button>
            </div>
        </>
    );
}