"use client";
import React, { useState, useCallback } from "react";
import { Handle, Position, useReactFlow, useUpdateNodeInternals, useNodeConnections} from "@xyflow/react";

import Toolbar from "../NodeToolbar";
import Choices from "../Choices";

export default function NormalSlideNode({ id, selected, data}) 
{
  const updateNodeInternals = useUpdateNodeInternals();
  const {setNodes, setEdges} = useReactFlow();
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