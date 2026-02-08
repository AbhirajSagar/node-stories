"use client";

import React, { useState, useEffect } from "react";
import { Handle, Position, useReactFlow, useUpdateNodeInternals } from "@xyflow/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt, faStopwatch, faVideo} from "@fortawesome/free-solid-svg-icons";
import { saveMediaToStorage } from "@/services/uploadService";
import Toolbar from "../NodeToolbar";
import Choices from "../Choices";

function VideoUploadPlaceholder() 
{
  return (
    <div className="flex flex-col items-center justify-center h-full text-white/40">
      <FontAwesomeIcon icon={faVideo} className="text-2xl mb-2" />
      <span className="text-xs">Upload Video</span>
    </div>
  );
}

function VideoLoadingState() 
{
  return (
    <div className="flex items-center justify-center h-full">
      <FontAwesomeIcon
        icon={faStopwatch}
        className="text-2xl text-white/40"
        bounce
      />
      <span className="ml-2 text-white/40">Loading...</span>
    </div>
  );
}

function VideoPreview({ videoUrl, setIsLoadingMedia }) 
{
  return (
    <video src={videoUrl} className="w-full h-full object-cover" controls={false} muted onLoadedData={() => setIsLoadingMedia(false)} />
  );
}

function VideoUploadOverlay({ isVisible }) 
{
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
      <FontAwesomeIcon icon={faCloudUploadAlt} className="text-white" />
    </div>
  );
}

function VideoUploadContainer({videoUrl, isLoadingMedia, setIsLoadingMedia, onVideoUpload}) 
{
  return (
    <div className="relative w-full h-32 bg-deep-space-blue rounded-lg border border-dashed border-white/20 hover:border-tiger-orange transition-colors overflow-hidden group">
      {videoUrl && <VideoPreview videoUrl={videoUrl} setIsLoadingMedia={setIsLoadingMedia}/>}
      {isLoadingMedia && <VideoLoadingState />}
      {!videoUrl && !isLoadingMedia && <VideoUploadPlaceholder />}

      <input type="file" accept="video/*" onChange={onVideoUpload} className="absolute inset-0 opacity-0 cursor-pointer" aria-label="Upload video"/>
      <VideoUploadOverlay isVisible={!isLoadingMedia && !!videoUrl} />
    </div>
  );
}

export default function TextVideoSlideNode({ id, selected, data }) 
{
  const { updateNodeData, setNodes, setEdges } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();
  const [videoUrl, setVideoUrl] = useState(null);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);

  useEffect(() => 
 {
    if (data.key) 
    {
        setIsLoadingMedia(true);
        setVideoUrl(data.key);
    }
  }, [data.key]);

  const handleVideoUpload = async (e) => 
 {
    const file = e.target.files?.[0];
    if (!file) return;

    try 
    {
      const url = await saveMediaToStorage(file, "video");
      setVideoUrl(url);
      updateNodeData(id, { key: url });
      console.log("Video saved and URL updated:", url);
    }
    catch (err) 
    {
      console.error("Video save failed", err);
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
    updateNodeData(id, { choices: [...current, { content: "", connection: null }] });
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
        className="bg-white w-3 h-3"
      />
      <Toolbar onAddChoice={addChoice} onDeleteNode={deleteNode} />

      <div className="flex flex-col gap-3 mt-2 nodrag">
        <VideoUploadContainer
          videoUrl={videoUrl}
          isLoadingMedia={isLoadingMedia}
          setIsLoadingMedia={setIsLoadingMedia}
          onVideoUpload={handleVideoUpload}
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