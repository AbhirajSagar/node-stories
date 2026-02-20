import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt, faImage, faVideo, faTrash, faMusic } from "@fortawesome/free-solid-svg-icons";

export function ContextMenu({ x, y, children })
{
    return (
        <div 
            className="absolute z-50 bg-shadow-grey/90 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl p-1 min-w-[160px]" 
            style={{ top: y, left: x }}
        >
            {children}
        </div>
    );
}

export function PaneContextMenu({ onAddNode, onClose })
{
    const options = [
        { label: "Normal Slide", icon: faFileAlt, type: "normal" },
        { label: "Image Slide", icon: faImage, type: "image" },
        { label: "Video Slide", icon: faVideo, type: "video" },
        { label: "Audio Slide", icon: faMusic, type: "audio" } 
    ];

    return (
        <div className="flex flex-col">
            {options.map((opt) => (
                <button
                    key={opt.type}
                    onClick={() => 
                    {
                        onAddNode(opt.type);
                        onClose();
                    }}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded transition-colors text-left"
                >
                    <FontAwesomeIcon icon={opt.icon} className="w-4" />
                    <span>{opt.label}</span>
                </button>
            ))}
        </div>
    );
}

export function EdgeContextMenu({ edge, onDeleteEdge, onClose })
{
    return (
        <div className="flex flex-col">
            <button
                onClick={() => 
                {
                    onDeleteEdge(edge.id);
                    onClose();
                }}
                className="flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-200 hover:bg-white/10 rounded transition-colors text-left"
            >
                <FontAwesomeIcon icon={faTrash} className="w-4" />
                <span>Remove Connection</span>
            </button>
        </div>
    );
}