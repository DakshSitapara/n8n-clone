<div align="center">

<img src="https://raw.githubusercontent.com/DakshSitapara/n8n-clone/refs/heads/main/public/logos/logo.svg" alt="N8N Clone Logo" width="120" height="120">

# N8N Clone

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/DakshSitapara/n8n-clone?style=social)](https://github.com/DakshSitapara/n8n-clone/stargazers)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Now-blue?logo=vercel)](https://n8n-clone-nu.vercel.app/)

**A modern workflow automation platform built with Next.js 15**

A powerful, open-source alternative to n8n featuring a visual node-based editor, AI integrations, and real-time workflow execution.

### 🎯 Key Highlights

- 🎨 **Intuitive Visual Editor** - Build complex workflows with drag-and-drop simplicity
- 🤖 **AI-Powered** - Integrate with Claude, GPT, Gemini, and Groq
- ⚡ **Real-time Execution** - Monitor workflows as they run
- 🔒 **Enterprise-Grade Security** - Encrypted credentials and secure auth
- 🚀 **Production Ready** - Built with modern, scalable technologies

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## ✨ Features

### 🎨 Visual Workflow Editor
- **Drag-and-drop Interface** - Intuitive node-based workflow builder using ReactFlow
- **Real-time Preview** - See your workflow changes instantly
- **Customizable Nodes** - Extensible node system for any automation need

### 🚀 Multiple Trigger Types
| Trigger | Description |
|---------|-------------|
| **Manual Trigger** | Start workflows manually with a single click |
| **HTTP Request** | Trigger via webhooks and HTTP endpoints |
| **Google Form** | Automate on Google Form submissions |
| **Stripe** | React to payment events and customer actions |
| **Telegram** | Trigger on bot messages and commands |

### 🤖 AI/LLM Integrations
- **Anthropic Claude** - Advanced reasoning and analysis
- **OpenAI GPT** - Industry-leading language models
- **Google Gemini** - Multimodal AI capabilities
- **Groq** - Lightning-fast inference

### 💬 Communication Platforms
- **Discord** - Send messages and embeds to channels
- **Slack** - Post messages and interact with workspaces
- **Telegram** - Bot messaging and notifications

### 🔐 Authentication & Security
- Email/Password with verification
- GitHub OAuth integration
- Google OAuth integration
- Encrypted credential storage
- Secure session management

### 💳 Subscription Management
- Polar.sh integration for premium features
- Customer portal access
- Flexible pricing tiers

### ⚡ Real-time Execution
- Inngest-powered workflow orchestration
- Live execution status updates
- Comprehensive error handling
- Automatic retry logic

### 🗄️ Database & Storage
- PostgreSQL with Prisma ORM
- Encrypted credential storage
- Type-safe database operations

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with App Router |
| **React 19** | UI library |
| **TypeScript** | Type safety |
| **Tailwind CSS 4** | Utility-first styling |
| **Radix UI** | Accessible component primitives |
| **ReactFlow** | Visual workflow editor |
| **Jotai** | Atomic state management |
| **TanStack Query** | Server state management |
| **tRPC** | End-to-end type-safe APIs |

### Backend
| Technology | Purpose |
|------------|---------|
| **Next.js API Routes** | Serverless API |
| **tRPC Server** | Type-safe API layer |
| **Prisma** | Database ORM |
| **PostgreSQL** | Primary database |
| **Inngest** | Workflow execution engine |

### Infrastructure & Services
| Service | Purpose |
|---------|---------|
| **Resend** | Email delivery |
| **Polar.sh** | Subscription management |
| **Sentry** | Error monitoring |
| **Vercel Analytics** | Performance monitoring |

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Turbopack** - Next.js compiler
- **mprocs** - Process management

---

## 📁 Project Structure

```
n8n-clone/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication pages
│   │   │   ├── login/         # Login page
│   │   │   ├── signup/        # Registration page
│   │   │   ├── forgot-password/
│   │   │   └── verify-email/
│   │   ├── (dashboard)/       # Dashboard and editor
│   │   │   ├── (editor)/      # Workflow editor
│   │   │   └── (rest)/        # Other dashboard pages
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── inngest/       # Inngest webhook
│   │   │   ├── trpc/          # tRPC handler
│   │   │   └── webhooks/      # External webhooks
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── ui/                # Shadcn UI components
│   │   ├── react-flow/        # Workflow editor nodes
│   │   ├── app-header.tsx     # Application header
│   │   └── app-sidebar.tsx    # Application sidebar
│   ├── features/              # Feature modules
│   │   ├── auth/              # Authentication logic
│   │   ├── credentials/       # Credential management
│   │   ├── editor/            # Workflow editor
│   │   ├── executions/        # Execution management
│   │   ├── subscriptions/     # Subscription handling
│   │   ├── triggers/          # Trigger nodes
│   │   └── workflows/         # Workflow management
│   ├── hooks/                 # Custom React hooks
│   ├── inngest/               # Inngest functions
│   │   ├── channels/          # Node execution handlers
│   │   ├── client.ts          # Inngest client
│   │   ├── functions.ts       # Workflow functions
│   │   └── utils.ts           # Utility functions
│   ├── lib/                   # Utility libraries
│   │   ├── auth.ts            # Authentication config
│   │   ├── db.ts              # Database client
│   │   ├── email.ts           # Email utilities
│   │   └── encryption.ts      # Encryption utilities
│   ├── trpc/                  # tRPC configuration
│   │   ├── client.ts          # tRPC client
│   │   ├── server.ts          # tRPC server
│   │   └── routers/           # API routers
│   └── config/                # App configuration
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                    # Static assets
├── mprocs.yaml                # Process management config
├── next.config.ts             # Next.js configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies and scripts
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20 or higher
- **PostgreSQL** database
- **Ngrok** (for local webhook testing)
- **Inngest** account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DakshSitapara/n8n-clone.git
   cd n8n-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/n8n-clone"

   # Authentication
   BETTER_AUTH_URL="http://localhost:3000"
   BETTER_AUTH_SECRET="your-secret-key-here"
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

   # Polar.sh (Subscriptions)
   POLAR_ACCESS_TOKEN="your-polar-token"
   POLAR_PRODUCT_ID="your-product-id"
   POLAR_SUCCESS_URL="http://localhost:3000/success"

   # Sentry (Optional - Error Monitoring)
   NEXT_PUBLIC_SENTRY_DSN="your-sentry-dsn"
   SENTRY_AUTH_TOKEN="your-sentry-token"

   # Webhooks
   NGROK_URL="your-ngrok-url"
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start the development server**

   Start all services at once:
   ```bash
   npm run dev:all
   ```

   Or start services individually:
   ```bash
   npm run dev          # Next.js development server
   npm run inngest:dev  # Inngest dev server
   npm run ngrok:dev    # Ngrok tunnel
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📖 Documentation

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run check` | Format, lint, and build |
| `npm run dev:all` | Start all development services |
| `npm run inngest:dev` | Start Inngest dev server |
| `npm run ngrok:dev` | Start Ngrok tunnel |

### Node Types

#### Triggers
- **Manual Trigger** - Manually start workflow execution
- **HTTP Request** - Trigger via HTTP webhook
- **Google Form** - Trigger on Google Form submission
- **Stripe** - Trigger on Stripe events
- **Telegram** - Trigger on Telegram messages

#### AI/LLM Nodes
- **Anthropic** - Claude API integration
- **OpenAI** - GPT models
- **Gemini** - Google AI models
- **Groq** - Fast inference

#### Communication Nodes
- **Discord** - Send messages to Discord
- **Slack** - Send messages to Slack
- **Telegram** - Send messages via Telegram bot

### Database Schema

Key models:

| Model | Description |
|-------|-------------|
| **User** | User accounts with OAuth and email auth |
| **Workflow** | Workflow definitions and metadata |
| **Node** | Individual workflow nodes with configuration |
| **Connection** | Node connections and data flow |
| **Execution** | Workflow execution records and status |
| **Credential** | Encrypted API credentials |

### Security Features

- 🔒 Encrypted credential storage using Cryptr
- ✉️ Email verification required
- 🛡️ Secure session management
- ⚙️ Environment-based configuration
- 📊 Sentry error monitoring

---

## 🗺️ Roadmap

### Upcoming Features

- [ ] **More AI Integrations** - Support for additional AI providers
- [ ] **Custom Node Builder** - Create and share custom nodes
- [ ] **Workflow Templates** - Pre-built workflow templates
- [ ] **Advanced Scheduling** - Cron-based workflow triggers
- [ ] **Webhook Testing** - Built-in webhook testing tool
- [ ] **Export/Import** - Workflow export and import functionality
- [ ] **Version History** - Track workflow changes over time
- [ ] **Team Collaboration** - Multi-user workspace support
- [ ] **Mobile App** - Native mobile applications

### Planned Improvements

- Enhanced error reporting and debugging tools
- Performance optimizations for large workflows
- Additional authentication providers (Microsoft, etc.)
- More communication platform integrations
- Advanced data transformation nodes

---

## 📸 Screenshots

### Login Page
<div align="center">
  <img src="https://api.microlink.io/?url=https://n8n-clone-nu.vercel.app/&screenshot=true&meta=false&embed=screenshot.url&darkMode=true" alt="N8N Clone Login Page" width="600">
  <p><em>Clean, modern authentication interface with OAuth support</em></p>
</div>

> Visit the [live demo](https://n8n-clone-nu.vercel.app/) to explore the full application.

### Key UI Features
- 🎨 Dark/Light theme support
- 📱 Fully responsive design
- 🔐 Secure authentication flow with OAuth (GitHub & Google)
- ⚡ Fast page loads with Next.js 15
- 🎯 Clean, modern interface

---

## 🌐 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to [Vercel](https://vercel.com)
2. Configure environment variables in the Vercel dashboard
3. Deploy automatically on push to the main branch

### Self-Hosting

For self-hosting deployments:

1. Ensure PostgreSQL is accessible
2. Configure Inngest with your deployment URL
3. Set up proper webhooks
4. Run the production build:
   ```bash
   npm run build
   npm start
   ```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## ⭐ Show Your Support

If this project helped you or you find it useful, please consider giving it a ⭐ on GitHub!

<a href="https://github.com/DakshSitapara/n8n-clone">
  <img src="https://raw.githubusercontent.com/DakshSitapara/n8n-clone/refs/heads/main/public/logos/logo.svg" alt="Star the repo" width="100" height="100">
</a>

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Workflow editor powered by [ReactFlow](https://reactflow.dev/)
- Authentication by [better-auth](https://www.better-auth.com/)
- Workflow orchestration by [Inngest](https://inngest.com/)

---

## 📞 Support

- 📧 Email: dakshsitapara@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/DakshSitapara/n8n-clone/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/DakshSitapara/n8n-clone/discussions)

---

<div align="center">

**Made with ❤️ by [DakshSitapara](https://github.com/DakshSitapara)**

[⬆ Back to Top](#n8n-clone)

</div>
