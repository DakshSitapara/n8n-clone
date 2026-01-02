"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { AVAILABLE_MODELS, OpenAiDialog, OpenAiFromValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchOpenaiRealtimeToken } from "./actions";
import { OPENAI_CHANNEL_NAME } from "@/inngest/channels/openai";

type OpenAiNodeData = {
    variableName?: string;
    model?: string; 
    systemPrompt?: string;
    userPrompt?: string;
};

type OpenAiNodeType = Node<OpenAiNodeData>;

export const OpenAiNode = memo((props : NodeProps<OpenAiNodeType>) => {
    
    const [dialogOpen, setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow();
    
    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: OPENAI_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchOpenaiRealtimeToken,
    });

    const handleOpenSettings = () => {
        setDialogOpen(true);
    }

    const handleSubmit = (values : OpenAiFromValues) => {
        setNodes((nodes) => 
            nodes.map((node) => {
                if(node.id === props.id) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            ...values,
                        }                        
                    }
                }
                return node;
            })
        )
    }
    const nodeData = props.data;
    const description = nodeData?.userPrompt ? `${nodeData.model || AVAILABLE_MODELS[0].value } : ${nodeData.userPrompt.slice(0, 50)}...` : "Not configured";


    return(
        <>
        <OpenAiDialog 
            open={dialogOpen} 
            onOpenChange={setDialogOpen}
            onSubmit={handleSubmit}
            defultValue={nodeData}
        />
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon="/logos/openai.svg"
                name="OpenAI"
                status={nodeStatus}
                description={description}
                onDoubleClick={handleOpenSettings}
                onSettings={handleOpenSettings}
            />
        </>
    )
})

OpenAiNode.displayName = "OpenAiNode";