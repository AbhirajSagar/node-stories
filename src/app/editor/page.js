"use client";

import NormalSlideNode from "../components/customNodes/NormalSlideNode";
import TextImageSlideNode from "../components/customNodes/TextImageSlideNode";
import TextVideoSlideNode from "../components/customNodes/TextVideoSlideNode";

import { useState, useCallback, use } from "react";
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, BackgroundVariant, ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faFileAlt, faEye,faEyeSlash, faTrash, faCopy, faFloppyDisk, faVideo, faRotate, faDownload, faPlayCircle } from "@fortawesome/free-solid-svg-icons";
import { useReactFlow } from "@xyflow/react";
import { useRouter } from "next/navigation";

const nodeTypes = 
{
    normal: NormalSlideNode,
    image: TextImageSlideNode,
    video: TextVideoSlideNode,
};

const flowKey = "savedFlowData";

export default function Page()
{

    return (
        <ReactFlowProvider>
            <Editor />
        </ReactFlowProvider>
    );
}

function Editor()
{
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
    const [nodesData, setNodesData] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuContent, setMenuContent] = useState(<PaneContextMenu />);
    const [rfInstance, setReactFlowInstance] = useState(null);
    const [isPreviewVisible, setIsPreviewVisible] = useState(false);
    const { setViewport } = useReactFlow();
    const router = useRouter();

    const onNodesChange = useCallback((c) => setNodes((n) => applyNodeChanges(c, n)), []);
    const onEdgesChange = useCallback((c) => setEdges((e) => applyEdgeChanges(c, e)), []);
    const onConnect = useCallback((p) => 
    {
        setEdges((e) => addEdge(p, e))
    }, []);
    const onSave = useCallback(handleSave, [rfInstance]);
    const onRestore = useCallback(handleRestore, [setNodes, setViewport]);

    function handleRestore()
    {
        restoreFlow();
    }

    async function restoreFlow()
    {
        const flow = JSON.parse(localStorage.getItem(flowKey));
        if(!flow) return;
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
    }

    function handleSave()
    {
        if(!rfInstance) return;

        const flow = rfInstance.toObject();
        localStorage.setItem(flowKey, JSON.stringify(flow));
    }

    function handleContextMenu(menu, event) 
    {
        event.preventDefault();
        setMenuPos({ x: event.clientX, y: event.clientY });
        setMenuContent(menu);
        setIsMenuOpen(true);
    }

    function deleteNode(id) 
    {
        setNodes(nodes.filter((n) => n.id !== id));
        setIsMenuOpen(false);
    }


    function addNode(nodeType, position) 
    {
        const randomId = crypto.randomUUID();
        const newNode = 
        {
            id: randomId,
            type: nodeType,
            data: 
            {
                text: "",
                choices: [],
            },
            position: position,
        };

        setNodes([...nodes, newNode]);
        setIsMenuOpen(false);
    }

    function deleteEdge(id) 
    {
        setEdges(edges.filter((e) => e.id !== id));
        setIsMenuOpen(false);
    }   

    function getStoryJsonObj()
    {
        const slidesArray = [];
        for(let node of nodes)
        {
            slidesArray.push(
            {
                id: node.id,
                type: node.type,
                data: node.data
            });
        }

        const storyObj = 
        {
            version: 0.1,
            slides: [slidesArray],
        };

        return storyObj;
    }

    function playStory()
    {
        const data = getStoryJsonObj();
        sessionStorage.setItem('storyData', JSON.stringify(data));
        router.push('/player');
    }


    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setReactFlowInstance}
                onPaneContextMenu={(e) => handleContextMenu(<PaneContextMenu addNode={addNode} />, e)}
                onNodeContextMenu={(e, node) => handleContextMenu(<NodeContextMenu node={node} deleteNode={deleteNode} />, e)}
                onEdgeContextMenu={(e, edge) => handleContextMenu(<EdgeContextMenu edge={edge} deleteEdge={deleteEdge} />, e)}
                autoPanOnNodeFocus={true}
                zoomOnDoubleClick={false}
                onFocus={() => setIsMenuOpen(false)}
                isValidConnection={(connection) => 
                {
                    const existing = edges.find(
                    (e) => e.source === connection.source && e.sourceHandle === connection.sourceHandle
                    );
                    return !existing;
                }}
                fitView
            >
                <Toolbar isPreviewVisible={isPreviewVisible} setIsPreviewVisible={setIsPreviewVisible} onSave={onSave} onRestore={onRestore} playStory={playStory}/>
                {isPreviewVisible && <Preview/>}
                <Background variant={BackgroundVariant.Lines} bgColor="#222B3Cff" color="#273041" />
            </ReactFlow>
            {isMenuOpen && <ContextMenu x={menuPos.x} y={menuPos.y} menuContent={menuContent}/>}
        </div>
    );
}



function Toolbar({ isPreviewVisible, setIsPreviewVisible, onSave, onRestore, playStory }) 
{
    return (
        <div className="absolute top-0 left-0 m-4 p-3 rounded-lg flex flex-col gap-8 bg-shadow-grey z-50">
            <FontAwesomeIcon icon={faFloppyDisk} onClick={onSave} className="cursor-pointer text-2xl text-gray-300 hover:text-tiger-orange z-50" />
            <FontAwesomeIcon icon={faRotate} onClick={onRestore} className="cursor-pointer text-2xl text-gray-300 hover:text-tiger-orange z-50" />
            <FontAwesomeIcon icon={isPreviewVisible ? faEyeSlash : faEye} onClick={() => setIsPreviewVisible(p => !p)} className="cursor-pointer text-2xl text-gray-300 hover:text-tiger-orange z-50" />
            <FontAwesomeIcon icon={faPlayCircle} onClick={playStory} className="cursor-pointer text-2xl text-gray-300 hover:text-tiger-orange z-50" />
        </div>
    );
}

function Preview()
{
    return (
        <div className="absolute top-0 right-0 p-3 rounded-lg flex flex-col w-82 h-full gap-8 bg-shadow-grey z-50">
        </div>
    );
}

function ContextMenu({ x, y, menuContent }) 
{
    return (
        <div className="min-w-42 w-max h-max p-2 absolute bg-shadow-grey/80 backdrop-blur-sm rounded-lg shadow-lg" style={{ top: y, left: x }}>
            {menuContent}
        </div>
    );
}

function PaneContextMenu({ addNode }) 
{
    const options = 
    [
        {
            label: "Add Normal Node",
            icon: faFileAlt,
            onClick: () => addNode("normal", { x: 0, y: 0 })
        },
        {
            label: "Add Image Node",
            icon: faFile,
            onClick: () => addNode("image", { x: 0, y: 0 })
        },
        {
            label: "Add Video Node",
            icon: faVideo,
            onClick: () => addNode("video", { x: 0, y: 0 })
        }
    ];

    return Options(options);
}

function NodeContextMenu({ node, deleteNode }) 
{
    const options = [{ label: "Delete Node", icon: faTrash, onClick: () => deleteNode(node.id) }];
    return Options(options);
}

function EdgeContextMenu({ edge, deleteEdge }) 
{
    const options = [{ label: "Delete Edge", icon: faTrash, onClick: () => deleteEdge(edge.id) }];
    return Options(options);
}

function Options(options) 
{
    return options.map((o, i) => (
        <div key={i} className="w-full hover:cursor-pointer flex items-center hover:bg-deep-space-blue/50 p-2 rounded" onClick={() => o.onClick()}>
            <FontAwesomeIcon icon={o.icon} className="text-gray-300 mr-2" />
            <h2 className="text-gray-300 font-extralight font-outfit">{o.label}</h2>
        </div>
    ));
}
