"use client";
import React, { useState, useEffect } from "react";
import {
    Handle,
    Position,
    useReactFlow,
    useUpdateNodeInternals,
} from "@xyflow/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt, faVideo } from "@fortawesome/free-solid-svg-icons";
import {
    saveMediaToIndexedDB,
    getMediaFromIndexedDB,
} from "@/utils/indexDb";
import Toolbar from "../NodeToolbar";
import Choices from "../Choices";

export default function TextVideoSlideNode({ id, selected, data }) {
    const { updateNodeData, setNodes, setEdges } = useReactFlow();
    const updateNodeInternals = useUpdateNodeInternals();
    const [videoUrl, setVideoUrl] = useState(null);

    // Load video on mount
    useEffect(() => {
        let active = true;
        if (data.key) {
            getMediaFromIndexedDB(data.key).then((blob) => {
                if (active && blob) {
                    setVideoUrl(URL.createObjectURL(blob));
                }
            });
        }
        return () => {
            active = false;
            if (videoUrl) URL.revokeObjectURL(videoUrl);
        };
    }, [data.key]);

    const handleVideoUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            await saveMediaToIndexedDB(id, file);
            if (videoUrl) URL.revokeObjectURL(videoUrl);
            setVideoUrl(URL.createObjectURL(file));
            updateNodeData(id, { key: id });
        } catch (err) {
            console.error("Video save failed", err);
        }
    };

    const handleTextChange = (e) =>
        updateNodeData(id, { text: e.target.value });

    const handleChoiceChange = (idx, val) => {
        const newChoices = [...(data.choices || [])];
        newChoices[idx] = { ...newChoices[idx], content: val };
        updateNodeData(id, { choices: newChoices });
    };

    const addChoice = () => {
        const current = data.choices || [];
        if (current.length >= 6) return;
        updateNodeData(id, {
            choices: [...current, { content: "", connection: null }],
        });
        setTimeout(() => updateNodeInternals(id), 0);
    };

    const deleteNode = () => {
        setNodes((nds) => nds.filter((n) => n.id !== id));
        setEdges((eds) =>
            eds.filter((e) => e.source !== id && e.target !== id)
        );
    };

    return (
        <div
            className={`bg-shadow-grey p-3 w-64 rounded-lg shadow-xl text-white transition-all duration-200 ${selected ? "ring-2 ring-tiger-orange" : "border border-white/10"}`}
        >
            <Handle
                type="target"
                position={Position.Left}
                className="!bg-white !w-3 !h-3"
            />
            <Toolbar onAddChoice={addChoice} onDeleteNode={deleteNode} />

            <div className="flex flex-col gap-3 mt-2 nodrag">
                <div className="relative w-full h-32 bg-deep-space-blue rounded-lg border border-dashed border-white/20 hover:border-tiger-orange transition-colors overflow-hidden group">
                    {videoUrl ? (
                        <video
                            src={videoUrl}
                            className="w-full h-full object-cover"
                            controls={false}
                            muted
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-white/40">
                            <FontAwesomeIcon
                                icon={faVideo}
                                className="text-2xl mb-2"
                            />
                            <span className="text-xs">Upload Video</span>
                        </div>
                    )}
                    <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <FontAwesomeIcon
                            icon={faCloudUploadAlt}
                            className="text-white"
                        />
                    </div>
                </div>

                <textarea
                    value={data.text || ""}
                    onChange={handleTextChange}
                    placeholder="Caption text..."
                    className="bg-deep-space-blue rounded p-2 text-sm font-light w-full h-16 resize-y focus:outline-none focus:ring-1 focus:ring-tiger-orange"
                />

                <Choices
                    choices={data.choices || []}
                    onChoiceChange={handleChoiceChange}
                />
            </div>
        </div>
    );
}
