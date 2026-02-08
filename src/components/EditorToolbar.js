import { useState } from "react";
import { faFloppyDisk, faPlay, faUpload, faCog, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function EditorToolbar({ onSave, onPlay, onToggleSettings }) 
{
  const btnClass = "p-2 rounded-lg bg-shadow-grey flex justify-center gap-2 items-center cursor-pointer w-22 hover:bg-deep-space-blue hover:text-tiger-orange transition-colors shadow-lg border border-white/5";
  const [isSaving, setIsSaving] = useState(false);

  function saveFlow()
  {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false),1000);
    onSave();
  }

  return (
    <>
      <div className="absolute top-4 left-4 z-40 flex items-center gap-2">
        <button onClick={saveFlow} className={btnClass} title="Save Project">
          <FontAwesomeIcon icon={isSaving ? faCheckCircle : faFloppyDisk } className="w-5 h-5" />
          <p className="text-sm">Save</p>
        </button>
        <button onClick={onPlay} className={btnClass} title="Play Preview">
          <FontAwesomeIcon icon={faPlay} className="w-5 h-5" />
          <p className="text-sm">Play</p>
        </button>
        <div className="w-px h-8 bg-white/15"></div>
        <button onClick={onPlay} className={btnClass} title="Play Preview">
          <FontAwesomeIcon icon={faUpload} className="w-5 h-5" />
          <p className="text-sm">Publish</p>
        </button>
      </div>
      <div className="absolute top-4 right-4 z-40 flex-col gap-2">
        <button onClick={onToggleSettings} className={btnClass} title="Project Settings">
          <FontAwesomeIcon icon={faCog} className="w-5 h-5" />
          <p className="text-sm">Settings</p>
        </button>
      </div>
    </>
  );
}
