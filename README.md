# N8N Clone

A modern workflow automation platform built with Next.js 15, featuring a visual node-based editor, AI integrations, and real-time execution.

## Features

- **Visual Workflow Editor** - Drag-and-drop node-based workflow builder using ReactFlow
- **Multiple Trigger Types**:
  - Manual Trigger
  - HTTP Request Trigger
  - Google Form Trigger
  - Stripe Trigger
  - Telegram Bot Trigger

- **AI Node Integrations**:
  - Anthropic Claude
  - OpenAI GPT
  - Google Gemini
  - Groq

- **Communication Platforms**:
  - Discord
  - Slack
  - Telegram

- **Authentication**:
  - Email/Password with verification
  - GitHub OAuth
  - Google OAuth

- **Subscription Management**:
  - Polar.sh integration for premium features
  - Customer portal access

- **Real-time Execution**:
  - Inngest for workflow orchestration
  - Live execution status updates
  - Error handling and retry logic

- **Database**:
  - PostgreSQL with Prisma ORM
  - Encrypted credential storage

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Radix UI** - Component primitives
- **ReactFlow** - Visual workflow editor
- **Jotai** - State management
- **TanStack Query** - Data fetching
- **tRPC** - End-to-end typesafe APIs

### Backend
- **Next.js API Routes** - Serverless API
- **tRPC Server** - Type-safe API layer
- **Prisma** - Database ORM
- **PostgreSQL** - Database

### Infrastructure
- **Inngest** - Workflow execution engine
- **Resend** - Email delivery
- **Polar.sh** - Subscription management
- **Sentry** - Error monitoring
- **Vercel Analytics** - Performance monitoring

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Turbo** - Next.js compiler
- **mprocs** - Process management

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Dashboard and editor
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── inngest/       # Inngest webhook
│   │   ├── trpc/          # tRPC handler
│   │   └── webhooks/      # External webhooks
├── components/            # React components
│   ├── ui/                # Shadcn UI components
│   └── react-flow/        # Workflow editor nodes
├── features/              # Feature modules
│   ├── auth/              # Authentication
│   ├── credentials/       # Credential management
│   ├── editor/            # Workflow editor
│   ├── executions/        # Execution management
│   ├── subscriptions/     # Subscription handling
│   ├── triggers/          # Trigger nodes
│   └── workflows/         # Workflow management
├── hooks/                 # Custom React hooks
├── inngest/               # Inngest functions
│   └── channels/          # Node execution handlers
├── lib/                   # Utility libraries
│   ├── auth.ts            # Authentication config
│   ├── db.ts              # Database client
│   ├── email.ts           # Email utilities
│   └── encryption.ts      # Encryption utilities
├── trpc/                  # tRPC configuration
└── config/                # App configuration
```

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- Ngrok (for local webhook testing)
- Inngest account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd n8n-clone
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/n8n-clone"

# Auth
BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_SECRET="your-secret-key"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Email (Resend)
RESEND_API_KEY="your-resend-api-key"

# Inngest
INNGEST_EVENT_KEY="your-inngest-event-key"
INNGEST_SIGNING_KEY="your-inngest-signing-key"
INNGEST_API_URL="https://api.inngest.com"

# Polar
POLAR_ACCESS_TOKEN="your-polar-token"
POLAR_PRODUCT_ID="your-product-id"
POLAR_SUCCESS_URL="http://localhost:3000/success"

# Sentry (optional)
NEXT_PUBLIC_SENTRY_DSN="your-sentry-dsn"
SENTRY_AUTH_TOKEN="your-sentry-token"

# Webhooks
NGROK_URL="your-ngrok-url"
```

4. Set up the database:
```bash
npx prisma migrate dev
npx prisma generate
```

### Development

Start all services with mprocs:
```bash
npm run dev:all
```

Or start services individually:
```bash
npm run dev          # Next.js development server
npm run inngest:dev  # Inngest dev server
npm run ngrok:dev    # Ngrok tunnel
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run check` - Format, lint, and build
- `npm run dev:all` - Start all development services
- `npm run inngest:dev` - Start Inngest dev server
- `npm run ngrok:dev` - Start Ngrok tunnel

## Node Types

### Triggers
- **Manual Trigger** - Manually start workflow execution
- **HTTP Request** - Trigger via HTTP webhook
- **Google Form** - Trigger on Google Form submission
- **Stripe** - Trigger on Stripe events
- **Telegram** - Trigger on Telegram messages

### AI/LLM
- **Anthropic** - Claude API integration
- **OpenAI** - GPT models
- **Gemini** - Google AI models
- **Groq** - Fast inference

### Communication
- **Discord** - Send messages to Discord
- **Slack** - Send messages to Slack
- **Telegram** - Send messages via Telegram bot

## Database Schema

Key models:
- **User** - User accounts with OAuth and email auth
- **Workflow** - Workflow definitions
- **Node** - Individual workflow nodes
- **Connection** - Node connections
- **Execution** - Workflow execution records
- **Credential** - Encrypted API credentials

## Security

- Encrypted credential storage using Cryptr
- Email verification required
- Secure session management
- Environment-based configuration
- Sentry error monitoring

## Deployment

This project is optimized for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

For self-hosting:
- Ensure PostgreSQL is accessible
- Configure Inngest with your deployment URL
- Set up proper webhooks

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.