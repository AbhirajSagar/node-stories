import EditorArea from "@/components/EditorArea";
import { ReactFlowProvider } from "@xyflow/react";

export default async function Page({ params })
{
    const { id } = await params;

    return (
        <ReactFlowProvider>
            <EditorArea storyId={id}/>
        </ReactFlowProvider>
    );
}