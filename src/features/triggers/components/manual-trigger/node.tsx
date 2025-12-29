"use client";

import { NodeProps } from "@xyflow/react";
import { MousePointerIcon } from "lucide-react";
import { memo } from "react";
import { BaseTriggerNode } from "../base-trigger-node";

export const ManualTriggerNode = memo((props : NodeProps) => {

    return(
        <BaseTriggerNode
            {...props}
            icon={MousePointerIcon}
            name="When cliking 'Execute workflow'"
            // description={description} TODO
            // onDoubleClick={() => {}} TODO
            // onSettings={() =>{}} TODO
        />
    )
})

ManualTriggerNode.displayName = "ManualTriggerNode";