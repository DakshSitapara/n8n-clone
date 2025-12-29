'use client';

import { formatDistanceToNow } from "date-fns";
import { EmptyList, EmptyState, EntityContainer, EntityHeader, EntityItem, EntityPagination, EntitySearch, ErrorView, LoadingView } from "@/components/entity-componets";
import { useCreateWorkflow, useRemoveWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";
import { useWorkflowsParams } from "../hooks/use-workflows-params";
import { useEntitySearch } from "../hooks/use-entity-search";
import type { Workflow } from "@/generated/prisma/client";
import { WorkflowIcon } from "lucide-react";

export const WorkflowsSearch = () => {
    const [params, setParams] = useWorkflowsParams();
    const { searchValue, onSearchChange} = useEntitySearch({ params, setParams });

    return (
        <EntitySearch 
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Search workflows"
        />
    );
}

export const WorkflowsList = () => {
    const workflows = useSuspenseWorkflows();

    return  (
        <EmptyList 
            items={workflows.data.items}
            getKey={(workflow) => workflow.id}
            renderItem={(workflow) => <WorkflowItem data={workflow} />}
            emptyView={<WorkflowsEmpty />}
        />
    )
};

export const WorkflowsHeader = ({disable}: {disable?: boolean}) => {
    
    const createWorkflow = useCreateWorkflow();
    const router = useRouter();
    const {handleError, model} = useUpgradeModal();

    const handleCreate = () => {
        createWorkflow.mutate(undefined, {
            onSuccess: (data) => {
                router.push(`/workflows/${data.id}`);
            },
            onError: (error) => {
                handleError(error);
            }
        });
    }
    return (
        <>
        {model}
        <EntityHeader 
            title="Workflows"
            description="Create and manage your workflows"
            onNew={handleCreate}
            newButtonLabel="New Workflow"
            disabled={disable}
            isCreating={createWorkflow.isPending}
        />
        </>
    )
}

export const WorkflowsPagination = () => {
    const [params, setParams] = useWorkflowsParams();
    const workflows = useSuspenseWorkflows();

    return (
        <EntityPagination
            disabled={workflows.isPending}
            page={workflows.data.page}
            totalPages={workflows.data.totalPages}
            onPageChange={(page) => setParams({ ...params, page })}
        />
    );
}

export const WorkflowsContainer = ({children}: {children: React.ReactNode}) => {
    return (
        <EntityContainer 
            header={<WorkflowsHeader />}
            search={<WorkflowsSearch />}
            pagination={<WorkflowsPagination />}
        >
            {children}
        </EntityContainer>
    )
}

export const WorkflowsLoading = () => {
    return <LoadingView message="Loading workflows..." />
}

export const WorkflowsError = () => {
    return <ErrorView message="Error loading workflows" />
}

export const WorkflowsEmpty = () => {
    const router = useRouter();
    const createWorkflow = useCreateWorkflow();
    const { handleError, model } = useUpgradeModal();

    const handleCreateWorkflow = () => {
        createWorkflow.mutate(undefined, {
            onError: (error) => {
                handleError(error);
            },
            onSuccess: (data) => {
                router.push(`/workflows/${data.id}`);
            }
        });
    }
    return (
        <> {model}
            <EmptyState
                onNew={handleCreateWorkflow} 
                message="You have't created any workflows yet. Get started by creating your first workflow"
             />
        </>
    )
}

export const WorkflowItem = ({ data, } : {data : Workflow}) => {

    const removeWorkflow = useRemoveWorkflow();

    const handleRemove = () => {
         removeWorkflow.mutate({ id : data.id });
    }

    return (
        <EntityItem
            href={`/workflows/${data.id}`}
            title={data.name}
            subtitle={
                <>
                Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true })}{" "}
                &bull; Created{" "}
                {formatDistanceToNow(data.createdAt, { addSuffix: true })}
                </>
            }
            image={
                <>
                <div className="size-8 flex items-center justify-center">
                    <WorkflowIcon className="size-5 text-muted-foreground" />
                </div>
                </>
            } 
            onRemove={handleRemove}
            isRemoving={removeWorkflow.isPending}
        />
    )
}