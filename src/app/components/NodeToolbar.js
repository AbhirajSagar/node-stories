import { NodeToolbar, Position } from "@xyflow/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

export default function Toolbar({ onAddChoice, onDeleteNode }) {
  return (
    <NodeToolbar position={Position.Top} className="bg-shadow-grey-2 border border-white/10 rounded-lg flex items-center p-1.5 gap-2 shadow-xl">
      <button 
        onClick={onAddChoice}
        className="text-tiger-orange hover:text-white transition-colors p-1"
        title="Add Choice"
      >
        <FontAwesomeIcon icon={faPlusCircle} className="text-lg" />
      </button>
      <div className="w-px h-4 bg-white/20 mx-1"></div>
      <button 
        onClick={onDeleteNode}
        className="text-red-400 hover:text-red-200 transition-colors p-1"
        title="Delete Node"
      >
        <FontAwesomeIcon icon={faTrashAlt} className="text-lg" />
      </button>
    </NodeToolbar>
  );
}