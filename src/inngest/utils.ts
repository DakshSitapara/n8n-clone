import { Connection, Node } from "@/generated/prisma/client";
import toposort from "toposort";
import { inngest } from "./client";
import { createId } from "@paralleldrive/cuid2";

export const topologicalSort = (nodes: Node[], connections: Connection[]): Node[] => {
    
    // If no connections, return node as-is (they're all independent)
    if(connections.length === 0) {
        return nodes;
    }

    // Create edge array for toposort
    const edges: [string, string][] = connections.map((connection) => [
        connection.fromNodeId, 
        connection.toNodeId
    ]);

    //Add nodes with no connections as self-egdes to ensure they're included
    const connectedNodesId = new Set<string>();
    for (const conn of connections) {
        connectedNodesId.add(conn.fromNodeId);
        connectedNodesId.add(conn.toNodeId);
    } 

    for (const node of nodes) {
        if (!connectedNodesId.has(node.id)) {
            edges.push([node.id, node.id]);
        }
    }

    // Perform topological sort
    let sortedNodesIds : string[];
    try {
        sortedNodesIds = toposort(edges);

        // Remove duplicate (from self-edges)
        sortedNodesIds = [...new Set(sortedNodesIds)];
    } catch (error) {
        if(error instanceof Error && error.message.includes("Cyclic")) {
            throw new Error("Workflow contains a cycle");
        }
        throw error;
    }

    // Map sorted IDs back to node objects
    const nodeMap = new Map(nodes.map((node) => [node.id, node]));
    return sortedNodesIds.map((id) => nodeMap.get(id)!).filter(Boolean);
}

export const sendWorkflowExecution = async < T extends Record<string, unknown>>( data: T & { workflowId: string }) => {
  
  return inngest.send({
    name: "workflows/execute.workflow",
    data,
    id: createId(),
  });
  
};
