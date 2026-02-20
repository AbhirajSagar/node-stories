"use client";

import React, { useState, useEffect } from "react";
import { useReactFlow, useUpdateNodeInternals } from "@xyflow/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt, faStopwatch, faVideo } from "@fortawesome/free-solid-svg-icons";
import { SaveFileToProjectDB, LoadFileFromProjectDB } from "@/utils/FileUtils";
import NodeWrapper from "./NodeWrapper";
import Choices from "../Choices";

export default function TextVideoSlideNode({ id, selected, data })
{
    const { updateNodeData, setNodes, setEdges } = useReactFlow();
    const updateNodeInternals = useUpdateNodeInternals();
    const [videoUrl, setVideoUrl] = useState(undefined);
    const [isLoadingMedia, setIsLoadingMedia] = useState(false);

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
                    setVideoUrl(url);
                }
            }
        }
        LoadMedia();
        return () => { if (activeUrl) URL.revokeObjectURL(activeUrl); };
    }, [id, data.key, data.projectId]);

    async function HandleVideoUpload(e)
    {
        const file = e.target.files?.[0];
        if (!file || !data.projectId) return;

        setIsLoadingMedia(true);
        try
        {
            await SaveFileToProjectDB(data.projectId, id, file);
            updateNodeData(id, { key: "exists" });
        }
        catch (err)
        {
            console.error("Video save failed", err);
        }
        finally
        {
            setIsLoadingMedia(false);
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
                <label className="text-[10px] uppercase tracking-wider text-white/40 font-bold mb-2 block group-hover:text-tiger-orange transition-colors">Cinematic</label>
                <div className="relative w-full aspect-[16/9] bg-black/20 rounded-lg border border-dashed border-white/10 hover:border-tiger-orange/50 transition-colors overflow-hidden group/video">
                    {videoUrl ? (
                        <video src={videoUrl} className="w-full h-full object-cover" controls={false} muted onLoadedData={() => setIsLoadingMedia(false)} />
                    ) : isLoadingMedia ? (
                        <div className="flex items-center justify-center h-full">
                            <FontAwesomeIcon icon={faStopwatch} className="text-xl text-tiger-orange" bounce />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-white/20 transition-colors group-hover/video:text-white/40">
                            <FontAwesomeIcon icon={faVideo} className="text-2xl mb-2" />
                            <span className="text-[10px] font-medium">Upload Clip</span>
                        </div>
                    )}
                    
                    <input type="file" accept="video/*" onChange={HandleVideoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                    
                    {!isLoadingMedia && videoUrl && (
                        <div className="absolute inset-0 bg-shadow-grey/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none backdrop-blur-sm">
                            <FontAwesomeIcon icon={faCloudUploadAlt} className="text-tiger-orange text-xl" />
                        </div>
                    )}
                </div>
            </div>
            <div>
                <label className="text-[10px] uppercase tracking-wider text-white/40 font-bold mb-2 block">Caption</label>
                <textarea value={data.text || ""} onChange={HandleTextChange} placeholder="Video narration..." className="bg-black/20 text-white rounded-md p-3 text-sm font-light w-full h-20 resize-y focus:outline-none focus:ring-1 focus:ring-tiger-orange border border-white/5 transition-all placeholder:text-white/20" />
            </div>
            <div>
                <label className="text-[10px] uppercase tracking-wider text-white/40 font-bold mb-2 block">Decisions</label>
                <Choices choices={data.choices || []} onChoiceChange={HandleChoiceChange} />
            </div>
        </NodeWrapper>
    );
}