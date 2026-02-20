import React from "react";
import { Handle, Position } from "@xyflow/react";
import Toolbar from "../NodeToolbar";

export default function NodeWrapper({ id, selected, children, onAddChoice, onDeleteNode })
{
    // More refined border and shadow logic
    const containerClasses = selected 
        ? "ring-2 ring-tiger-orange border-transparent shadow-[0_0_15px_rgba(249,115,22,0.3)]" 
        : "border border-white/10 hover:border-white/20 shadow-xl";

    return (
        <div className={`bg-shadow-grey w-72 rounded-xl transition-all duration-300 relative group/node ${containerClasses}`}>
            {/* Styled Handle */}
            <Handle 
                type="target" 
                position={Position.Left} 
                className="!bg-white !w-3 !h-3 !-ml-1.5 !border-2 !border-shadow-grey"
            />
            
            {/* Header / Toolbar */}
            <div className="p-3 border-b border-white/5">
                <Toolbar onAddChoice={onAddChoice} onDeleteNode={onDeleteNode} />
            </div>

            {/* Content Body */}
            <div className="p-4 flex flex-col gap-4 nodrag cursor-default">
                {children}
            </div>
        </div>
    );
}