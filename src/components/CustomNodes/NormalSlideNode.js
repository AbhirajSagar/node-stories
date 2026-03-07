"use client";

import React, { useCallback } from "react";
import { useReactFlow, useUpdateNodeInternals } from "@xyflow/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignLeft } from "@fortawesome/free-solid-svg-icons";
import NodeWrapper from "./NodeWrapper";
import Choices from "../Choices";

export default function NormalSlideNode({ id, selected, data })
{
    const { updateNodeData, setNodes, setEdges } = useReactFlow();
    const updateNodeInternals = useUpdateNodeInternals();

    const handleTextChange = useCallback((e) => 
    {
        updateNodeData(id, { text: e.target.value });
    }, [id, updateNodeData]);

    const handleChoiceChange = useCallback((idx, newValue) => 
    {
        const newChoices = [...(data.choices || [])];
        newChoices[idx] = { ...newChoices[idx], content: newValue };
        updateNodeData(id, { choices: newChoices });
    }, [id, data.choices, updateNodeData]);

    const addChoice = useCallback(() => 
    {
        const currentChoices = data.choices || [];
        if (currentChoices.length >= 6) return;
        updateNodeData(id, { choices: [...currentChoices, { content: "", connection: null }] });
        setTimeout(() => updateNodeInternals(id), 0);
    }, [id, data.choices, updateNodeData, updateNodeInternals]);

    const deleteNode = useCallback(() => 
    {
        setNodes((nds) => nds.filter((n) => n.id !== id));
        setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
    }, [id, setNodes, setEdges]);

    return (
        <NodeWrapper id={id} selected={selected} onAddChoice={addChoice} onDeleteNode={deleteNode}>
            <div className="group">
                <label className="text-[10px] uppercase tracking-wider text-white/40 font-bold mb-2 flex items-center gap-2 group-hover:text-tiger-orange transition-colors">
                    <FontAwesomeIcon icon={faAlignLeft} className="text-sm" />
                    <span>Story Content</span>
                </label>
                
                <textarea 
                    value={data.text || ""} 
                    onChange={handleTextChange} 
                    placeholder="Write the main story text here..." 
                    className="bg-black/20 text-white rounded-lg p-4 text-sm font-light w-full h-48 resize-y focus:outline-none focus:ring-1 focus:ring-tiger-orange border border-white/5 transition-all placeholder:text-white/20 leading-relaxed"
                />
            </div>
            <div>
                <label className="text-[10px] uppercase tracking-wider text-white/40 font-bold mb-2 block">Decisions</label>
                <Choices choices={data.choices || []} onChoiceChange={handleChoiceChange}/>
            </div>
        </NodeWrapper>
    );
}