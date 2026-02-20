"use client";

import { useState, useCallback, useEffect } from "react";
import { ReactFlow, Background, BackgroundVariant, applyNodeChanges, applyEdgeChanges, addEdge, useReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import NormalSlideNode from "@/components/CustomNodes/NormalSlideNode";
import TextImageSlideNode from "@/components/CustomNodes/TextImageSlideNode";
import TextVideoSlideNode from "@/components/CustomNodes/TextVideoSlideNode";
import TextAudioSlideNode from "@/components/CustomNodes/TextAudioSlideNode";
import { PaneContextMenu, EdgeContextMenu, ContextMenu } from "@/components/EditorMenu";
import EditorToolbar from "@/components/EditorToolbar";
import SettingsModal from "@/components/Modals/SettingsModal";
import { ExportProjectToZip } from "@/utils/FileUtils";

const NODE_TYPES = 
{ 
    normal: NormalSlideNode, 
    image: TextImageSlideNode, 
    video: TextVideoSlideNode,
    audio: TextAudioSlideNode
};

export default function EditorArea({ projectId, onBack }) 
{
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    
    const [meta, setMeta] = useState({
        name: "New Story", description: "", thumbnailUrl: "",
        appearance: { bg_from: '#0f172a', bg_to: '#020617', hovered_option_from: '#ED8836', hovered_option_to: '#FB923C', option_from:'#ffffff', option_to:'#e2e2e2' },
        timing: { delay: 0 },
    });

    const [menuState, setMenuState] = useState({ isOpen: false, x: 0, y: 0, type: null, edge: null });
    const { toObject, setViewport } = useReactFlow();

    // 1. Load Data on Mount
    useEffect(() => {
        const raw = localStorage.getItem(`azuned_data_${projectId}`);
        if(raw) {
            const data = JSON.parse(raw);
            if(data) {
                setMeta({
                    name: data.name, description: data.description, appearance: data.appearance, timing: data.timing, thumbnailUrl: data.thumbnailUrl
                });
                if(data.flow) {
                    setNodes(data.flow.nodes || []);
                    setEdges(data.flow.edges || []);
                    if(data.flow.viewport) setViewport(data.flow.viewport);
                }
            }
        }
    }, [projectId, setViewport]);

    // 2. Auto-Save Logic (Debounced)
    useEffect(() => {
        const timer = setTimeout(() => {
            const flow = toObject();
            const dataToSave = {
                version: 1.0,
                name: meta.name, description: meta.description, appearance: meta.appearance, timing: meta.timing, thumbnailUrl: meta.thumbnailUrl,
                flow,
                // We generate the 'slides' structure during save for preview/export consistency
                slides: GenerateSlidesStructure(flow.nodes, flow.edges) 
            };
            localStorage.setItem(`azuned_data_${projectId}`, JSON.stringify(dataToSave));
            
            // Update timestamp in project list
            const list = JSON.parse(localStorage.getItem("azuned_projects_meta") || "[]");
            const pIndex = list.findIndex(p => p.id === projectId);
            if(pIndex > -1) {
                list[pIndex].name = meta.name;
                list[pIndex].lastModified = Date.now();
                localStorage.setItem("azuned_projects_meta", JSON.stringify(list));
            }

        }, 1000); // Save 1s after last change

        return () => clearTimeout(timer);
    }, [nodes, edges, meta, projectId, toObject]);

    function GenerateSlidesStructure(currentNodes, currentEdges) {
        return currentNodes.map((n) => ({
            id: n.id,
            type: n.type,
            data: {
                ...n.data,
                choices: n.data.choices?.map((c, idx) => {
                    const edge = currentEdges.find((e) => e.source === n.id && e.sourceHandle === `handle-${idx}`);
                    return { content: c.content, connection: edge?.target || null };
                }) || [],
            },
        }));
    }

    function HandleExport() {
        const flow = toObject();
        const exportData = {
            version: 1.0,
            name: meta.name, description: meta.description, appearance: meta.appearance, timing: meta.timing, thumbnailUrl: meta.thumbnailUrl,
            slides: GenerateSlidesStructure(nodes, edges)
        };
        ExportProjectToZip(projectId, exportData);
    }

    function HandlePlay() {
        const flow = toObject();
        const data = {
            slides: GenerateSlidesStructure(nodes, edges),
            appearance: meta.appearance,
            timing: meta.timing
        };
        localStorage.setItem("azuned_preview", JSON.stringify(data));
        window.open("/player/preview", "_blank");
    }

    const OnNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
    const OnEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
    const OnConnect = useCallback((params) => setEdges((eds) => addEdge({ ...params, type: "default", animated: true }, eds)), []);

    // Menu handlers (Same as before)
    const HandlePaneContextMenu = useCallback((event) => { event.preventDefault(); setMenuState({ isOpen: true, x: event.clientX, y: event.clientY, type: "pane" }); }, []);
    const HandleEdgeContextMenu = useCallback((event, edge) => { event.preventDefault(); setMenuState({ isOpen: true, x: event.clientX, y: event.clientY, type: "edge", edge }); }, []);
    const AddNode = (type) => {
        const id = crypto.randomUUID();
        const newNode = { id, type, position: { x: menuState.x - 50, y: menuState.y - 50 }, data: { text: "", choices: [], projectId } }; // Pass projectId in data
        setNodes((nds) => nds.concat(newNode));
    };
    const DeleteEdge = (id) => setEdges((eds) => eds.filter((e) => e.id !== id));
    const CloseMenu = () => setMenuState((prev) => ({ ...prev, isOpen: false }));

    return (
        <div className="w-screen h-screen bg-dark-blue-black text-white font-outfit">
            <EditorToolbar onExport={HandleExport} onPlay={HandlePlay} onBack={onBack} onToggleSettings={() => setIsSettingsOpen(true)} />
            <ReactFlow nodes={nodes} edges={edges} nodeTypes={NODE_TYPES} onNodesChange={OnNodesChange} onEdgesChange={OnEdgesChange} onConnect={OnConnect} onPaneContextMenu={HandlePaneContextMenu} onEdgeContextMenu={HandleEdgeContextMenu} onMoveStart={CloseMenu} fitView>
                <Background variant={BackgroundVariant.Lines} color="#151A24" />
            </ReactFlow>
            {menuState.isOpen && (
                <ContextMenu x={menuState.x} y={menuState.y}>
                    {menuState.type === "pane" ? <PaneContextMenu onAddNode={AddNode} onClose={CloseMenu} /> : <EdgeContextMenu edge={menuState.edge} onDeleteEdge={DeleteEdge} onClose={CloseMenu} />}
                </ContextMenu>
            )}
            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} name={meta.name} setName={(n) => setMeta((m) => ({ ...m, name: n }))} description={meta.description} setDescription={(d) => setMeta((m) => ({ ...m, description: d }))} appearance={meta.appearance} setAppearance={(a) => setMeta((m) => ({ ...m, appearance: a }))} timing={meta.timing} setTiming={(t) => setMeta((m) => ({ ...m, timing: t }))} />
        </div>
    );
}