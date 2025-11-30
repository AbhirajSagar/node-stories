import { Handle, Position } from "@xyflow/react";

export default function Choices({ choices, setChoice, handleConnection }) 
{
  return choices.map((_, idx) => 
  {
    return (
      <div key={idx} className="relative mt-1">
        <input type="text" onChange={(e) => setChoice(e,idx)} placeholder={`Choice ${idx + 1}`} className="bg-deep-space-blue rounded focus:outline-tiger-orange focus:outline-1 p-1 text-xs font-extralight w-full"/>
        <Handle type="source" position={Position.Right} id={`handle-${idx}`} className="absolute" onConnect={(e) => handleConnection(e,idx)}/>
      </div>
    )
  });
}