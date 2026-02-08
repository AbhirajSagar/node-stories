"use client";
import React, { useCallback } from "react";
import { Handle, Position, useReactFlow, useUpdateNodeInternals } from "@xyflow/react";
import Toolbar from "../NodeToolbar";
import Choices from "../Choices";

export default function NormalSlideNode({ id, selected, data }) 
{
    const { updateNodeData, setNodes, setEdges } = useReactFlow();
    const updateNodeInternals = useUpdateNodeInternals();

    const handleTextChange = useCallback((e) => updateNodeData(id, { text: e.target.value }), [id, updateNodeData]);
    const handleChoiceChange = useCallback
    (
        (idx, newValue) => 
        {
            const newChoices = [...(data.choices || [])];
            newChoices[idx] = { ...newChoices[idx], content: newValue };
            updateNodeData(id, { choices: newChoices });
        },
        [id, data.choices, updateNodeData]
    );

    const addChoice = useCallback(() => 
    {
        const currentChoices = data.choices || [];
        if (currentChoices.length >= 6) return; // Limit choices

        updateNodeData(id, { choices: [...currentChoices, { content: "", connection: null }] });
        setTimeout(() => updateNodeInternals(id), 0);

    }, [id, data.choices, updateNodeData, updateNodeInternals]);

    const deleteNode = useCallback(() => 
    {
        setNodes((nds) => nds.filter((n) => n.id !== id));
        setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
    }, [id, setNodes, setEdges]);

    return (
        <div className={`bg-shadow-grey p-3 w-64 rounded-lg shadow-xl text-white transition-all duration-200 ${selected ? "ring-2 ring-tiger-orange" : "border border-white/10"}`}>
            <Handle type="target" position={Position.Left} className="!bg-white !w-3 !h-3"/>
            <Toolbar onAddChoice={addChoice} onDeleteNode={deleteNode} />

            <div className="flex flex-col gap-3 mt-2 nodrag cursor-default">
                <label className="text-[10px] uppercase tracking-wider text-white/50 font-bold">
                    Text Content
                </label>
                <textarea
                    value={data.text || ""}
                    onChange={handleTextChange}
                    placeholder="Type your story segment..."
                    className="bg-deep-space-blue rounded p-2 text-sm font-light w-full h-24 resize-y focus:outline-none focus:ring-1 focus:ring-tiger-orange border border-transparent"
                />

                <div className="mt-1">
                    <label className="text-[10px] uppercase tracking-wider text-white/50 font-bold">
                        Decisions
                    </label>
                    <Choices
                        choices={data.choices || []}
                        onChoiceChange={handleChoiceChange}
                    />
                </div>
            </div>
        </div>
    );
}
