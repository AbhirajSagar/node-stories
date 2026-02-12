import { useState } from "react";
import { faFloppyDisk, faPlay, faUpload, faCog, faCheckCircle, faClock, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function EditorToolbar({ onSave, onPlay, onToggleSettings }) 
{
  const btnClass = "p-2 rounded-lg bg-shadow-grey flex justify-center gap-2 items-center cursor-pointer w-22 hover:bg-deep-space-blue hover:text-tiger-orange transition-colors shadow-lg border border-white/5";

  return (
    <>
      <div className="absolute top-4 left-4 z-40 flex items-center gap-2">
        <SaveBtn  onSave={onSave} btnClass={btnClass} />
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

function SaveBtn({onSave, btnClass})
{
  const [state, setState] = useState('normal');

  async function saveFlow()
  {
    setState('saving');
    const saved = await onSave();
    if(saved)
    {
      setState('success');
    }
    else
    {
      setState('failed');
    }

    setTimeout(() => setState('normal'), 2000);
  }

  function Icon(state)
  {
    if(state === 'normal') return faFloppyDisk
    else if(state === 'saving') return faClock
    else if(state === 'failed') return faX
    else if(state === 'success') return faCheckCircle
  }

  return (
    <button onClick={saveFlow} className={btnClass} title="Save Project">
      <FontAwesomeIcon icon={Icon(state)} className="w-5 h-5" bounce={state === 'saving'}/>
      <p className="text-sm">Save</p>
    </button>
  );
}