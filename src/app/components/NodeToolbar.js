import { NodeToolbar, Position } from "@xyflow/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

export default function Toolbar({ addChoice, deleteNode }) 
{
  return (
    <NodeToolbar position={Position.Top} className="bg-shadow-grey-2 rounded-lg flex items-center p-2">
      <FontAwesomeIcon icon={faPlusCircle} className="text-tiger-orange hover:cursor-pointer text-xl" onClick={addChoice}/>
      <FontAwesomeIcon icon={faTrashAlt} className="text-tiger-orange hover:cursor-pointer text-xl" onClick={deleteNode}/>
    </NodeToolbar>
  );
}