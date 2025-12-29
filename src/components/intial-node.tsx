"use client";

import { memo } from "react";
import { PlusIcon } from "lucide-react";
import type { NodeTypes } from "@xyflow/react";
import { PlaceholderNode } from "./react-flow/placeholder-node";
import { WorkflowNode } from "./workflow-node";

export const InitialNode = memo((props : NodeTypes) => {
    return  (
        <WorkflowNode showToolbar={false}>
            <PlaceholderNode 
                {...props}
                onClick={() => {}}
            >
                <div className="cursor-pointer flex items-center justify-center">
                    <PlusIcon className="size-4" />
                </div>         
            </PlaceholderNode>
        </WorkflowNode>
    )
});

InitialNode.displayName = "InitialNode";