"use client";

import { useState, useCallback, useEffect } from "react";
import { ReactFlow,  Background, BackgroundVariant,} from "@xyflow/react";
import { applyNodeChanges, applyEdgeChanges, addEdge, useReactFlow } from "@xyflow/react";
import { useRouter } from "next/navigation";

// Components
import NormalSlideNode from "@/components/CustomNodes/NormalSlideNode";
import TextImageSlideNode from "@/components/CustomNodes/TextImageSlideNode";
import TextVideoSlideNode from "@/components/CustomNodes/TextVideoSlideNode";
import { PaneContextMenu, EdgeContextMenu, ContextMenu } from "@/components/EditorMenu";
import EditorToolbar from "@/components/EditorToolbar";
import { Settings } from "@/components/StorySettings";
import extractFlowData from "@/utils/flowExtractor";


import "@xyflow/react/dist/style.css";

const nodeTypes = 
{ 
    normal: NormalSlideNode, 
    image: TextImageSlideNode, 
    video: TextVideoSlideNode
};

const STORAGE_KEY = "wip_story_flow";
const PLAYER_STORAGE_KEY = "player_story_data";

export default function EditorArea({storyId}) 
{
    useEffect(() => {console.log(storyId)},[]);
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
        thumbnailUrl: "",
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

    async function tryLoadSavedFlow()
    {
        if(!storyId) return;
        const req = await fetch(`/api/story/${storyId}`);
        
        const storyData = await req.json();
        const data = storyData.data;
        const flowData = data.flow;
        const flow = flowData.flow;

        const {slides, ...rest} = extractFlowData(flow, 0.1)

        setMeta(rest);

        if (flow) 
        {
            setNodes(flow.nodes || []);
            setEdges(flow.edges || []);
            console.log("loaded saved flow", nodes, edges)
        }
        else if (slides.length > 0) 
        {
            const reconstructed = slides.map((s, i) => 
            ({
              id: s.id,
              type: s.type,
              position: { x: i * 300, y: 0 },
              data: s.data,
            }));
            
            setNodes(reconstructed);
            console.log('reconstructed', reconstructed)
        }
    }

    async function saveFlow()
    {
      const flow = toObject();
      const dataToSave = 
      {
        version: 0.1,
        flow, // Save raw editor state for editing
        ...meta, // Spread meta (name, desc, appearance, timing)
        slides: generateSlidesPlayerData() // Also generate the "Slides" structure for the player
      };

      const reqOptions = 
      {
        "method" : "POST",
        "headers": { "Content-Type": "application/json" },
        "body": JSON.stringify({flow: dataToSave})
      };

      try
      {
        const res = await fetch('/api/story/update/' + storyId, reqOptions)
        if(res.ok) return true;
        else return false;
      }
      catch(err)
      {
        console.error(err);
        return false;
      }
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

    async function handlePlay()
    {
      await saveFlow(); // Auto-save before play

      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      
      sessionStorage.setItem(PLAYER_STORAGE_KEY, saved);
      router.push("/player/" + storyId);
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
            <EditorToolbar
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
                    thumbnailUrl={meta.thumbnailUrl}
                    setThumbnail={(url) => setMeta((m) => ({...m, thumbnailUrl: url}))}
                />
            )}
        </div>
    );
}