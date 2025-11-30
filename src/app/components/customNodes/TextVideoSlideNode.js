"use client";
import React, { useState, useCallback } from "react";
import { Handle, Position, useReactFlow, useUpdateNodeInternals, useNodeConnections} from "@xyflow/react";

import Toolbar from "../NodeToolbar";
import Choices from "../Choices";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

export default function TextVideoSlideNode({ id, selected, data}) 
{
  const updateNodeInternals = useUpdateNodeInternals();
  const {setNodes, setEdges} = useReactFlow();
  const [video, setVideo] = useState(null);
  const [choices, setChoices] = useState([""]);

  const addChoiceCallback = useCallback(() => 
  {
    if(!data.choices) data.choices = [];

    const choiceObj = {content: "", connection: null};
    data.choices.push(choiceObj);
    
    addChoice(choices, setChoices, id, updateNodeInternals);
  }, [choices, id, updateNodeInternals]);

  const deleteNodeCallback = useCallback(() => 
  {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
  }, [id, setNodes, setEdges]);

  function setContent(event)
  {
    data.text = event.target.value;
  }

  function handleChoiceSelection(event, idx)
  {
    const choice = data.choices[idx];
    
    if(!choice)
    {
      const choiceObj = {content: event.target.value, connection: null};
      data.choices[idx] = choiceObj;
      return;
    }

    choice.content = event.target.value;
  }
  
  function handleConnection(event, idx)
  {
    const choice = data.choices[idx];
    
    if(!choice)
    {
      const choiceObj = {content: "", connection: event.target};
      data.choices[idx] = choiceObj;
      return;
    }

    choice.connection = event.target;
  }

  return (
    <div className={`bg-shadow-grey p-2 min-h-32 h-max min-w-48 font-outfit rounded-lg shadow-xl text-white border-tiger-orange ${selected ? " border" : ""}`}>
      <Handle type="target" position={Position.Left} id="target"/>
      <div className="nodrag flex flex-col mt-12">
        <VideoUpload setVideo={setVideo} video={video}/>
        <textarea type="text" onChange={setContent} placeholder="Enter text here.." className="bg-deep-space-blue rounded focus:outline-tiger-orange focus:outline-1 p-1 text-xs font-extralight w-full"/>
        <Choices choices={choices} setChoice={handleChoiceSelection} handleConnection={handleConnection}/>
      </div>
      <Toolbar addChoice={addChoiceCallback} deleteNode={deleteNodeCallback} />
    </div>
  );
}

function addChoice(choices, setChoices, id, updateNodeInternals) 
{
  if (choices.length === 9) return;

  setChoices((prev) => 
  {
    const next = [...prev, ""];
    updateNodeInternals(id);
    return next;
  });
}

function VideoUpload({setVideo, video})
{
  function handleVideoUpload(event)
  {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) =>
    {
      setVideo(e.target.result);
    };

    if(file)
    {
      reader.readAsDataURL(file);
    }
  }

  function UploadUI()
  {
    return (
      <div className="flex justify-center cursor-pointer items-center flex-col">
        <FontAwesomeIcon icon={faUpload} className="text-4xl mb-2"/>
        <span className="text-gray-300 text-semibold">Upload Video</span>
      </div>
    );
  }

  function PreviewUI()
  {
    return (
      <video 
        src={video} 
        alt="Uploaded" 
        className="h-42 w-full object-cover rounded-lg"
        controlsList="nodownload"
        controls
      />
    );
  }

  return (
    <div className="flex relative items-center bg-deep-space-blue rounded mb-1.5 h-42 justify-center">
      <div className="bg-deep-space-blue rounded-lg flex items-center justify-center">
        {video ? <PreviewUI/> : <UploadUI/>}
      </div>
      <input type="file" id="video-upload" accept="video/*" onChange={handleVideoUpload} className={`absolute cursor-pointer top-0 left-0 h-full w-full opacity-0 ` + (video && 'hidden')}/>
    </div>
  );
}