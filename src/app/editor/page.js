"use client";

import { useState, useCallback, useEffect } from "react";
import { ReactFlow,  Background, BackgroundVariant, ReactFlowProvider, } from "@xyflow/react";
import { applyNodeChanges, applyEdgeChanges, addEdge, useReactFlow } from "@xyflow/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faPlay, faCog } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

// Components
import NormalSlideNode from "@/app/components/customNodes/NormalSlideNode";
import TextImageSlideNode from "@/app/components/customNodes/TextImageSlideNode";
import TextVideoSlideNode from "@/app/components/customNodes/TextVideoSlideNode";
import { PaneContextMenu, EdgeContextMenu, ContextMenu } from "@/app/components/EditorMenu";
import { Settings } from "@/app/components/StorySettings";
import extractFlowData from "@/app/utils/flowExtractor";

import "@xyflow/react/dist/style.css";


const nodeTypes = { normal: NormalSlideNode, image: TextImageSlideNode, video: TextVideoSlideNode};

const STORAGE_KEY = "wip_story_flow";
const PLAYER_STORAGE_KEY = "player_story_data";

export default function Page() 
{
    return (
        <ReactFlowProvider>
            <EditorArea />
        </ReactFlowProvider>
    );
}

function EditorArea() 
{
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [menuState, setMenuState] = useState
    ({
        isOpen: false,
        x: 0,
        y: 0,
        type: null,
        edge: null,
    });
    const [meta, setMeta] = useState
    ({
        name: "",
        description: "",
        appearance: {},
        timing: { delay: 0 },
    });

    const { toObject } = useReactFlow();
    const router = useRouter();

    useEffect(() => { tryLoadSavedFlow(); }, []);

    const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)),[]);
    const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),[]);
    const onConnect = useCallback((params) => 
    {
        // Only allow one connection per source handle
        setEdges((eds) => {
            const existing = eds.find(
                (e) =>
                    e.source === params.source &&
                    e.sourceHandle === params.sourceHandle
            );
            if (existing) return eds; // Block multiple connections from same choice
            return addEdge({ ...params, type: "default", animated: true }, eds);
        });
    }, []);

    function tryLoadSavedFlow()
    {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      try 
      {
        const json = JSON.parse(saved);
        const { slides, ...rest } = extractFlowData(json, 0.1);

        // Restore Meta
        setMeta(rest);

        // Restore Nodes/Edges logic would go here.
        // Note: The provided `extractFlowData` returns a simplified slide structure.
        // For the EDITOR, we ideally save the raw ReactFlow object.
        // For this refactor, I will assume we are restoring the ReactFlow object if available.
        if (json.flow) 
        {
            setNodes(json.flow.nodes || []);
            setEdges(json.flow.edges || []);
        }
        else if (slides.length > 0) 
        {
          // Fallback: reconstruct nodes from slides (simplified logic)
          const reconstructed = slides.map((s, i) => ({
              id: s.id,
              type: s.type,
              position: { x: i * 300, y: 0 },
              data: s.data,
          }));

          setNodes(reconstructed);
        }
      }
      catch (e) 
      {
        console.error("Load failed", e);
      }
    }

    function saveFlow()
    {
      const flow = toObject();
      const dataToSave = 
      {
        version: 0.1,
        flow, // Save raw editor state for editing
        ...meta, // Spread meta (name, desc, appearance, timing)
        slides: generateSlidesPlayerData() // Also generate the "Slides" structure for the player
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      console.log('Data Saved');
    };

    function generateSlidesPlayerData()
    {
      const data = nodes.map
      ((n) => 
        ({
          id: n.id,
          type: n.type,
          data: 
          {
            ...n.data,
            // Map choices to find target connections
            choices: n.data.choices?.map((c, idx) => 
            {
              const edge = edges.find((e) => e.source === n.id && e.sourceHandle === `handle-${idx}`);
              return { content: c.content, connection: edge?.target || null};
            }) || [],
          },
        })
      );

      return data;
    }

    function handlePlay()
    {
      saveFlow(); // Auto-save before play

      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      
      sessionStorage.setItem(PLAYER_STORAGE_KEY, saved);
      router.push("/player");
    };

    // --- Context Menus ---

    const handlePaneContextMenu = useCallback((event) => 
    {
        event.preventDefault();
        setMenuState
        ({
          isOpen: true,
          x: event.clientX,
          y: event.clientY,
          type: "pane",
        });
    }, []);

    const handleEdgeContextMenu = useCallback((event, edge) => 
    {
      event.preventDefault();
      setMenuState
      ({
        isOpen: true,
        x: event.clientX,
        y: event.clientY,
        type: "edge",
        edge,
      });
    }, []);

    const addNode = (type) => 
    {
        const id = crypto.randomUUID();
        const newNode = 
        {
          id,
          type,
          position: { x: menuState.x - 50, y: menuState.y - 50 }, // Offset for cursor
          data: { text: "", choices: [] },
        };
        setNodes((nds) => nds.concat(newNode));
    };

    const deleteEdge = (id) => setEdges((eds) => eds.filter((e) => e.id !== id));
    const closeMenu = () => setMenuState((prev) => ({ ...prev, isOpen: false }));

    return (
        <div className="w-screen h-screen bg-[#11141C] text-white font-outfit">
            <Toolbar
                onSave={saveFlow}
                onPlay={handlePlay}
                onToggleSettings={() => setIsSettingsOpen(!isSettingsOpen)}
            />

            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onPaneContextMenu={handlePaneContextMenu}
                onEdgeContextMenu={handleEdgeContextMenu}
                onMoveStart={closeMenu}
                fitView
            >
                <Background variant={BackgroundVariant.Lines} color="#151A24" />
            </ReactFlow>

            {menuState.isOpen && (
                <ContextMenu x={menuState.x} y={menuState.y}>
                    {menuState.type === "pane" ? (
                        <PaneContextMenu
                            onAddNode={addNode}
                            onClose={closeMenu}
                        />
                    ) : (
                        <EdgeContextMenu
                            edge={menuState.edge}
                            onDeleteEdge={deleteEdge}
                            onClose={closeMenu}
                        />
                    )}
                </ContextMenu>
            )}

            {isSettingsOpen && (
                <Settings
                    setIsPreviewVisible={setIsSettingsOpen}
                    name={meta.name}
                    setName={(n) => setMeta((m) => ({ ...m, name: n }))}
                    description={meta.description}
                    setDescription={(d) =>
                        setMeta((m) => ({ ...m, description: d }))
                    }
                    appearance={meta.appearance}
                    setAppearance={(a) =>
                        setMeta((m) => ({ ...m, appearance: a }))
                    }
                    timing={meta.timing}
                    setTiming={(t) => setMeta((m) => ({ ...m, timing: t }))}
                />
            )}
        </div>
    );
}

function Toolbar({ onSave, onPlay, onToggleSettings }) 
{
  const btnClass = "p-2 rounded-lg bg-shadow-grey flex justify-center gap-2 items-center cursor-pointer w-22 hover:bg-deep-space-blue hover:text-tiger-orange transition-colors shadow-lg border border-white/5";
  return (
    <div className="absolute top-4 left-4 z-40 flex gap-2">
      <button onClick={onSave} className={btnClass} title="Save Project">
        <FontAwesomeIcon icon={faFloppyDisk} className="w-5 h-5" />
        <p className="text-sm">Save</p>
      </button>
      <button onClick={onPlay} className={btnClass} title="Play Preview">
        <FontAwesomeIcon icon={faPlay} className="w-5 h-5" />
        <p className="text-sm">Play</p>
      </button>
      <div className="w-px h-8 bg-white/10 mx-1 self-center" />
      <button onClick={onToggleSettings} className={btnClass} title="Project Settings">
        <FontAwesomeIcon icon={faCog} className="w-5 h-5" />
        <p className="text-sm">Settings</p>
      </button>
    </div>
  );
}
