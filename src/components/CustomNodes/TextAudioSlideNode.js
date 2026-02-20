"use client";

import React, { useState, useEffect } from "react";
import { useReactFlow, useUpdateNodeInternals } from "@xyflow/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic, faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";
import { SaveFileToProjectDB, LoadFileFromProjectDB } from "@/utils/FileUtils";
import NodeWrapper from "./NodeWrapper";
import Choices from "../Choices";

export default function TextAudioSlideNode({ id, selected, data })
{
    const { updateNodeData, setNodes, setEdges } = useReactFlow();
    const updateNodeInternals = useUpdateNodeInternals();
    const [audioUrl, setAudioUrl] = useState(undefined);

    useEffect(() => 
    {
        let activeUrl = null;
        async function LoadMedia()
        {
            if (data.key && data.projectId)
            {
                const url = await LoadFileFromProjectDB(data.projectId, id);
                if (url)
                {
                    activeUrl = url;
                    setAudioUrl(url);
                }
            }
        }
        LoadMedia();
        return () => { if (activeUrl) URL.revokeObjectURL(activeUrl); };
    }, [id, data.key, data.projectId]);

    async function HandleAudioUpload(e)
    {
        const file = e.target.files?.[0];
        if (!file || !data.projectId) return;

        try
        {
            await SaveFileToProjectDB(data.projectId, id, file);
            updateNodeData(id, { key: "exists" });
        }
        catch (error)
        {
            console.error("Failed to load audio", error);
        }
    }

    function HandleTextChange(e) { updateNodeData(id, { text: e.target.value }); }
    
    function HandleChoiceChange(idx, val) {
        const newChoices = [...(data.choices || [])];
        newChoices[idx] = { ...newChoices[idx], content: val };
        updateNodeData(id, { choices: newChoices });
    }

    function AddChoice() {
        const current = data.choices || [];
        if (current.length >= 6) return;
        updateNodeData(id, { choices: [...current, { content: "", connection: null }] });
        setTimeout(() => updateNodeInternals(id), 0);
    }

    function DeleteNode() {
        setNodes((nds) => nds.filter((n) => n.id !== id));
        setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
    }

    return (
        <NodeWrapper id={id} selected={selected} onAddChoice={AddChoice} onDeleteNode={DeleteNode}>
            <div className="group">
                <label className="text-[10px] uppercase tracking-wider text-white/40 font-bold mb-2 block group-hover:text-tiger-orange transition-colors">Audio Source</label>
                <div className="relative w-full h-14 bg-black/20 rounded-lg border border-dashed border-white/10 hover:border-tiger-orange/50 transition-colors overflow-hidden group/audio flex justify-center items-center">
                    {audioUrl ? (
                        <audio src={audioUrl} controls className="w-11/12 h-8" />
                    ) : (
                        <div className="flex flex-row items-center gap-2 text-white/30 pointer-events-none">
                            <FontAwesomeIcon icon={faMusic} className="text-sm" />
                            <span className="text-[10px] font-medium">Select Audio File</span>
                        </div>
                    )}
                    <input type="file" accept="audio/*" onChange={HandleAudioUpload} className={`absolute inset-0 opacity-0 cursor-pointer ${audioUrl ? 'hidden group-hover:block' : 'block'}`} />
                    {audioUrl && (
                        <div className="absolute inset-0 bg-shadow-grey/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none backdrop-blur-sm">
                            <FontAwesomeIcon icon={faCloudUploadAlt} className="text-tiger-orange text-lg" />
                        </div>
                    )}
                </div>
            </div>
            <div>
                <label className="text-[10px] uppercase tracking-wider text-white/40 font-bold mb-2 block">Caption</label>
                <textarea value={data.text || ""} onChange={HandleTextChange} placeholder="Write your dialogue here..." className="bg-black/20 text-white rounded-md p-3 text-sm font-light w-full h-20 resize-y focus:outline-none focus:ring-1 focus:ring-tiger-orange border border-white/5 transition-all placeholder:text-white/20" />
            </div>
            <div>
                <label className="text-[10px] uppercase tracking-wider text-white/40 font-bold mb-2 block">Decisions</label>
                <Choices choices={data.choices || []} onChoiceChange={HandleChoiceChange} />
            </div>
        </NodeWrapper>
    );
}