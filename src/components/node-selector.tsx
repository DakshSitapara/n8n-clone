'use client'

import { createId } from '@paralleldrive/cuid2'
import { useReactFlow } from '@xyflow/react'
import { GlobeIcon, MousePointerIcon } from 'lucide-react'
import { useCallback } from 'react'
import { toast } from 'sonner'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from './ui/sheet'
import { NodeType } from '@/generated/prisma/enums'
import { Separator } from './ui/separator'
import { ScrollArea } from './ui/scroll-area'

export type NodeTypeOption = {
    type: NodeType
    label: string
    description: string
    icon: React.ComponentType<{ className?: string }> | string
}

const triggerNodes: NodeTypeOption[] = [
    {
        type: NodeType.MANUAL_TRIGGER,
        label: 'Trigger Manually',
        description: 'Runs the flow on clicking button. Good for getting started quickly.',
        icon: MousePointerIcon,
    },
    {
        type: NodeType.GOOGLE_FORM_TRIGGER,
        label: 'Google Form',
        description: 'Runs the flow when a Google Form is submitted.',
        icon: '/logos/googleform.svg',
    },
    {
        type: NodeType.STRIPE_TRIGGER,
        label: 'Stripe Event',
        description: 'Runs the flow when a Stripe event is captured.',
        icon: '/logos/stripe.svg',
    },
    {
        type: NodeType.TELEGRAM_TRIGGER,
        label: 'Telegram Event',
        description: 'Runs the flow when a Telegram event is captured.',
        icon: '/logos/telegram.svg',
    },
]

const executionNodes: NodeTypeOption[] = [
    {
        type: NodeType.HTTP_REQUEST,
        label: 'HTTP Request',
        description: 'Makes a HTTP request',
        icon: GlobeIcon,
    },
    {
        type: NodeType.GEMINI,
        label: 'Gemini',
        description: 'Uses Google Gemini to generate text',
        icon: '/logos/gemini.svg',
    },
    {
        type: NodeType.ANTHROPIC,
        label: 'Anthropic',
        description: "Uses Anthropic's Claude model",
        icon: '/logos/anthropic.svg',
    },
    {
        type: NodeType.OPENAI,
        label: 'OpenAI',
        description: 'Uses OpenAI to generate text',
        icon: '/logos/openai.svg',
    },
    {
        type: NodeType.GROQ,
        label: 'Groq',
        description: "Uses Groq's large language models",
        icon: '/logos/groq.svg',
    },
    {
        type: NodeType.DISCORD,
        label: 'Discord',
        description: 'Send a message to Discord',
        icon: '/logos/discord.svg',
    },
    {
        type: NodeType.SLACK,
        label: 'Slack',
        description: 'Send a message to Slack',
        icon: '/logos/slack.svg',
    },
    {
        type: NodeType.TELEGRAM,
        label: 'Telegram',
        description: 'Send a message to Telegram',
        icon: '/logos/telegram.svg',
    },
]

interface NodeSelectorProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    children: React.ReactNode
}

export function NodeSelector({ open, onOpenChange, children }: NodeSelectorProps) {
    const { setNodes, getNodes, screenToFlowPosition } = useReactFlow()

    const handleNodeSelect = useCallback(
        (selection: NodeTypeOption) => {
            //Check if trying to add a manual trigger when one already exists
            if (selection.type === NodeType.MANUAL_TRIGGER) {
                const nodes = getNodes()
                const manualTriggerNode = nodes.some(
                    (node) => node.type === NodeType.MANUAL_TRIGGER
                )

                if (manualTriggerNode) {
                    toast.error('Only one manual trigger is allowed per workflow.')
                    return
                }
            }
            setNodes((nodes) => {
                const hasInitialTrigger = nodes.some((node) => node.type === NodeType.INITIAL)

                const centerX = window.innerWidth / 2
                const centerY = window.innerHeight / 2

                const flowPosition = screenToFlowPosition({
                    x: centerX + (Math.random() - 0.5) * 200,
                    y: centerY + (Math.random() - 0.5) * 200,
                })

                const newNode = {
                    id: createId(),
                    data: {},
                    position: flowPosition,
                    type: selection.type,
                }

                if (hasInitialTrigger) {
                    return [newNode]
                }

                return [...nodes, newNode]
            })
            onOpenChange(false)
        },
        [onOpenChange, screenToFlowPosition, setNodes, getNodes]
    )

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md">
                <ScrollArea className="h-full">
                    <SheetHeader>
                        <SheetTitle>What triggers this workflow?</SheetTitle>
                        <SheetDescription>
                            A trigger is an event that starts your workflow.
                        </SheetDescription>
                    </SheetHeader>
                    <div>
                        {triggerNodes.map((nodeType) => {
                            const Icon = nodeType.icon

                            return (
                                <div
                                    key={nodeType.type}
                                    className="hover:border-l-primary h-auto w-full cursor-pointer justify-start rounded-none border-l-2 border-transparent px-4 py-5"
                                    onClick={() => handleNodeSelect(nodeType)}
                                >
                                    <div className="flex w-full items-center gap-6 overflow-hidden">
                                        {typeof Icon === 'string' ? (
                                            <picture>
                                                <img
                                                    src={Icon}
                                                    alt={nodeType.label}
                                                    className="size-5 rounded-sm object-contain"
                                                />
                                            </picture>
                                        ) : (
                                            <Icon className="size-5" />
                                        )}
                                        <div className="flex flex-col items-start text-left">
                                            <span className="text-sm font-medium">
                                                {nodeType.label}
                                            </span>
                                            <span className="text-muted-foreground text-xs">
                                                {nodeType.description}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <Separator />
                    <div>
                        {executionNodes.map((nodeType) => {
                            const Icon = nodeType.icon

                            return (
                                <div
                                    key={nodeType.type}
                                    className="hover:border-l-primary h-auto w-full cursor-pointer justify-start rounded-none border-l-2 border-transparent px-4 py-5"
                                    onClick={() => handleNodeSelect(nodeType)}
                                >
                                    <div className="flex w-full items-center gap-6 overflow-hidden">
                                        {typeof Icon === 'string' ? (
                                            <picture>
                                                <img
                                                    src={Icon}
                                                    alt={nodeType.label}
                                                    className="size-5 rounded-sm object-contain"
                                                />
                                            </picture>
                                        ) : (
                                            <Icon className="size-5" />
                                        )}
                                        <div className="flex flex-col items-start text-left">
                                            <span className="text-sm font-medium">
                                                {nodeType.label}
                                            </span>
                                            <span className="text-muted-foreground text-xs">
                                                {nodeType.description}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    )
}
