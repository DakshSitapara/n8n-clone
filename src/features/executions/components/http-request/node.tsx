"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { GlobeIcon } from "lucide-react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { FromType, HttpRequestDialog } from "./dialog";

type HttpRequestNodeData = {
    endPoint?: string,
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
    body?: string,
    [key : string] : unknown,
};

type HttpRequestNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo((props : NodeProps<HttpRequestNodeType>) => {
    
    const [dialogOpen, setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow();
    
    const nodeStatus = "initial";

    const handleOpenSettings = () => {
        setDialogOpen(true);
    }

    const handleSubmit = (values : FromType) => {
        setNodes((nodes) => 
            nodes.map((node) => {
                if(node.id === props.id) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            endPoint: values.endpoint,
                            method: values.method,
                            body: values.body
                        }                        
                    }
                }
                return node;
            })
        )
    }
    const nodeData = props.data;
    const description = nodeData?.endPoint ? `${nodeData.method || "GET"} : ${nodeData.endPoint}` : "Not configured";


    return(
        <>
        <HttpRequestDialog 
            open={dialogOpen} 
            onOpenChange={setDialogOpen}
            onSubmit={handleSubmit}
            defultEndPoint={nodeData.endPoint} // TODO: check if it can be improved by just sending initialValue={nodeData}
            defultMethod={nodeData.method}
            defultBody={nodeData.body} 
        />
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon={GlobeIcon}
                name="HTTP Request"
                status={nodeStatus}
                description={description}
                onDoubleClick={handleOpenSettings}
                onSettings={handleOpenSettings}
            />
        </>
    )
})

HttpRequestNode.displayName = "HttpRequestNode";