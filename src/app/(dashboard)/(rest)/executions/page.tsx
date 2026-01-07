import { prefetchExecutions } from "@/features/executions/server/prefetch";
import { executionsParamsLoader } from "@/features/executions/server/params-loader";
import { requireAuth } from "@/lib/auth-utils"
import { HydrateClient } from "@/trpc/server";
import { SearchParams } from "nuqs";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ExecutionsContainer, ExecutionsList, ExecutionsLoading, ExecutionsError } from "@/features/executions/components/executions";

type Prop = {
    searchParams: Promise<SearchParams>,
}

const Page = async ({ searchParams }: Prop) => {
    await requireAuth();

    const params = await executionsParamsLoader(searchParams);
    prefetchExecutions(params);
    
    return (
        <ExecutionsContainer>
            <HydrateClient>
                <ErrorBoundary fallback={<ExecutionsError />}>
                    <Suspense fallback={<ExecutionsLoading />}>
                        <ExecutionsList />
                    </Suspense>
                </ErrorBoundary>
            </HydrateClient>
        </ExecutionsContainer>
    )
}

export default Page