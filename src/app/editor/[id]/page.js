import { ReactFlowProvider } from "@xyflow/react";
import EditorArea from "@/components/EditorArea";

export default async function EditorPage({ params })
{
    const p = await params;
    const projectId = p.id;

    return (
        <ReactFlowProvider>
            <EditorArea projectId={projectId}/>
        </ReactFlowProvider>
    )
}