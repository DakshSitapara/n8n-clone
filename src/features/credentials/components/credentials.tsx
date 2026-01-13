'use client';

import { formatDistanceToNow } from "date-fns";
import { EmptyList, EmptyState, EntityContainer, EntityHeader, EntityItem, EntityPagination, EntitySearch, ErrorView, LoadingView } from "@/components/entity-componets";
import { useSuspenseCredentials, useRemoveCredential, useSuspenseCredential } from "../hooks/use-credentials";
import { useRouter } from "next/navigation";
import { useCredentialsParams } from "../hooks/use-credentials-params";
import { useEntitySearch } from "../../../hooks/use-entity-search";
import type { Credential } from "@/generated/prisma/client";
import { CredentialType } from "@/generated/prisma/enums";
import Image from "next/image";
import { CredentialForm } from "./credential";

export const CredentialsSearch = () => {
    const [params, setParams] = useCredentialsParams();
    const { searchValue, onSearchChange} = useEntitySearch({ params, setParams });

    return (
        <EntitySearch 
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Search credentials"
        />
    );
}

export const CredentialsList = () => {
    const credentials = useSuspenseCredentials();

    return  (
        <EmptyList 
            items={credentials.data.items}
            getKey={(credential) => credential.id}
            renderItem={(credential) => <CredentialItem data={credential} />}
            emptyView={<CredentialsEmpty />}
        />
    )
};

export const CredentialsHeader = ({disable}: {disable?: boolean}) => {
    
    return (
        <EntityHeader 
            title="Credentials"
            description="Create and manage your credentials"
            newButtonHref="/credentials/new"
            newButtonLabel="New Credential"
            disabled={disable}
        />
    )
}

export const CredentialsPagination = () => {
    const [params, setParams] = useCredentialsParams();
    const credentials = useSuspenseCredentials();

    return (
        <EntityPagination
            disabled={credentials.isPending}
            page={credentials.data.page}
            totalPages={credentials.data.totalPages}
            onPageChange={(page) => setParams({ ...params, page })}
        />
    );
}

export const CredentialsContainer = ({children}: {children: React.ReactNode}) => {
    return (
        <EntityContainer 
            header={<CredentialsHeader />}
            search={<CredentialsSearch />}
            pagination={<CredentialsPagination />}
        >
            {children}
        </EntityContainer>
    )
}

export const CredentialsLoading = () => {
    return <LoadingView message="Loading credentials..." />
}

export const CredentialsError = () => {
    return <ErrorView message="Error loading credentials" />
}

export const CredentialsEmpty = () => {
    const router = useRouter();

    const handleCreateCredential = () => {
        router.push(`/credentials/new`);
    }
    return (
            <EmptyState
                onNew={handleCreateCredential} 
                message="You have't created any credentials yet. Get started by creating your first credential"
             />
    )
}

const  credentialsLogos : Record<CredentialType, string> = {
    [CredentialType.OPENAI] : "/logos/openai.svg",
    [CredentialType.GROQ] : "/logos/groq.svg",
    [CredentialType.GEMINI] : "/logos/gemini.svg",
    [CredentialType.ANTHROPIC] : "/logos/anthropic.svg",
    [CredentialType.TELEGRAM] : "/logos/telegram.svg",
} 

export const CredentialItem = ({ data, } : {data : Credential }) => {

    const removeCredential = useRemoveCredential();

    const logo = credentialsLogos[data.type] || "/logos/logo.svg";

    const handleRemove = () => {
         removeCredential.mutate({ id : data.id });
    }

    return (
        <EntityItem
            href={`/credentials/${data.id}`}
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
                    <Image src={logo} alt={data.name} width={20} height={20} />
                </div>
                </>
            } 
            onRemove={handleRemove}
            isRemoving={removeCredential.isPending}
        />
    )
}

export const CredentialView = ({credentialId} : {credentialId : string}) => {

    const { data } = useSuspenseCredential(credentialId);

    return <CredentialForm initialData={data} />
}