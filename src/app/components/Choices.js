import { Handle, Position } from "@xyflow/react";
import React from "react";

function Choices({ choices = [], onChoiceChange }) {
    // choices is an array of objects: { content: string, connection: string | null }

    return (
        <div className="flex flex-col gap-2 mt-2">
            {choices.map((choice, idx) => (
                <div key={idx} className="relative group">
                    <input
                        type="text"
                        value={choice.content}
                        onChange={(e) => onChoiceChange(idx, e.target.value)}
                        placeholder={`Option ${idx + 1}`}
                        className="bg-deep-space-blue w-full rounded p-1.5 text-xs font-light text-white/90 border border-transparent focus:border-tiger-orange focus:outline-none transition-colors placeholder:text-white/30"
                    />
                    {/* Handle for connecting to other nodes */}
                    <Handle
                        type="source"
                        position={Position.Right}
                        id={`handle-${idx}`}
                        className="!bg-tiger-orange !w-3 !h-3 !-right-1.5"
                    />
                </div>
            ))}
        </div>
    );
}

export default React.memo(Choices);
