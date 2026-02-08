"use client";

import React, { useState, useEffect } from "react";
import {Handle, Position, useReactFlow, useUpdateNodeInternals} from "@xyflow/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt, faImage } from "@fortawesome/free-solid-svg-icons";
import {saveMediaToStorage} from "@/services/uploadService.js";
import Toolbar from "../NodeToolbar";
import Choices from "../Choices";

function ImageUploadPlaceholder() 
{
    return (
        <div className="flex flex-col items-center justify-center h-full text-white/40">
            <FontAwesomeIcon icon={faImage} className="text-2xl mb-2" />
            <span className="text-xs">Upload Image</span>
        </div>
    );
}

function ImagePreview({ imageUrl }) 
{
    return (
        <img
            src={imageUrl}
            alt="Slide"
            className="w-full h-full object-cover"
        />
    );
}

function ImageUploadOverlay({ isVisible }) 
{
    if (!isVisible) return null;

    return (
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <FontAwesomeIcon icon={faCloudUploadAlt} className="text-white" />
        </div>
    );
}

function ImageUploadContainer({ imageUrl, onImageUpload }) 
{
    return (
        <div className="relative w-full h-32 bg-deep-space-blue rounded-lg border border-dashed border-white/20 hover:border-tiger-orange transition-colors overflow-hidden group">
            {imageUrl ? <ImagePreview imageUrl={imageUrl} /> : <ImageUploadPlaceholder />}
            <input type="file" accept="image/*" onChange={onImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" aria-label="Upload image"/>
            <ImageUploadOverlay isVisible={!!imageUrl} />
        </div>
    );
}

export default function TextImageSlideNode({ id, selected, data }) 
{
    const { updateNodeData, setNodes, setEdges } = useReactFlow();
    const updateNodeInternals = useUpdateNodeInternals();
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => 
    {
        if (data.key) 
        {
            setPreviewUrl(data.key);
        }
    }, [data.key]);

    const handleImageUpload = async (e) => 
    {
        const file = e.target.files?.[0];
        if (!file) return;

        try 
        {
            const url = await saveMediaToStorage(file, "image");
            setPreviewUrl(url);
            updateNodeData(id, { key: url });
        } 
        catch (error) 
        {
            console.error("Failed to save image", error);
        }
    };

    const handleTextChange = (e) => {
        updateNodeData(id, { text: e.target.value });
    };

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
            className={`bg-shadow-grey p-3 w-64 rounded-lg shadow-xl text-white transition-all duration-200 ${
                selected ? "ring-2 ring-tiger-orange" : "border border-white/10"
            }`}
        >
            <Handle
                type="target"
                position={Position.Left}
                className="!bg-white !w-3 !h-3"
            />
            <Toolbar onAddChoice={addChoice} onDeleteNode={deleteNode} />

            <div className="flex flex-col gap-3 mt-2 nodrag">
                <ImageUploadContainer
                    imageUrl={previewUrl}
                    onImageUpload={handleImageUpload}
                />

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