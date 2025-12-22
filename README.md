# Kanbanly API

![Kanbanly Backend](https://img.shields.io/badge/Node.js-v18+-green) ![TypeScript](https://img.shields.io/badge/TypeScript-v5+-blue) ![Express](https://img.shields.io/badge/Express-v4+-white) ![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green)

The robust backend API for **Kanbanly**, a modern project management tool designed for agile teams. This system supports both **Scrum** and **Kanban** methodologies, real-time collaboration, and features an integrated AI assistant powered by RAG (Retrieval-Augmented Generation).

Built with **Service-Repository Architecture**, adhering to **SOLID principles** and **Dependency Injection** for scalability and maintainability.

## 🚀 Key Features

- **Project Management Methodologies**:
  - **Scrum**: Sprint planning, backlogs, story points, and sprint lifecycles.
  - **Kanban**: Visual boards, WIP limits, and continuous flow.
- **Hierarchical Work Items**: Workspaces → Projects → Epics → Stories → Tasks → Subtasks.
- **Real-time Collaboration**: Instant updates for board movements, comments, and status changes via **Socket.IO**.
- **Team Communication**:
  - Built-in real-time chat (Direct & Project-based).
  - Rich-text comments with `@mentions` and notifications.
- **Advanced Authentication**:
  - JWT-based auth (Access & Refresh tokens).
  - Google OAuth integration.
  - Role-Based Access Control (RBAC) with customizable permissions (Owner, Project Manager, Member).
- **AI Assistant (Gemini + LangChain)**:
  - Context-aware chat assistant.
  - Automated project generation & breakdown.
  - RAG architecture using **Pinecone** vector database for documentation retrieval.
- **Subscription & Billing**:
  - SaaS model integration with **Stripe**.
  - Tiered plans (Free, Pro, Enterprise) with feature/usage limits.
- **Analytics & Reporting**: Comprehensive dashboards for team velocity, task distribution, and productivity.

## 🛠️ Tech Stack

- **Runtime Environment**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Containerization**: Docker
- **Database**: MongoDB (Mongoose ODM)
- **Caching**: Redis
- **Real-time Engine**: Socket.IO
- **AI & ML**:
  - Google Gemini (LLM)
  - LangChain (Orchestration)
  - Pinecone (Vector Database)
- **Storage**: Cloudinary (Asset management)
- **Payment Processing**: Stripe
- **Logging**: Winston (Daily rotate files)
- **Validation**: Zod
- **DI Container**: TSyringe

## 📂 Architecture

The project follows a **Service-Repository Architecture** pattern combined with **SOLID principles** to separate concerns and ensure testability:

```text
src/
├── ai/             # AI Agents, Tools, and RAG implementation
├── config/         # Environment and service configurations
├── controllers/    # Request handlers (Entry points)
├── services/       # Business logic (Use cases)
├── repositories/   # Data access layer (Database abstraction)
├── models/         # Mongoose schemas/entities
├── routes/         # API Route definitions
├── middlewares/    # Auth, Validation, Error handling
├── di/             # Dependency Injection setup
├── events/         # Event emitters and listeners
└── shared/         # Utilities, Constants, and Helper classes
```

## ⚡ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (Local or Atlas)
- Redis (Local or Cloud)
- Stripe Account
- Cloudinary Account
- Google Cloud Console Project (for OAuth & Gemini API)
- Pinecone Account

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/kanbanly-api.git
    cd kanbanly-api
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory and populate it with the following:

    ```env
    # Server Configuration
    PORT=5000
    SERVER_HOST=localhost
    CORS_ALLOWED_ORIGIN=http://localhost:3000

    # Database
    DATABASE_URI=mongodb://localhost:27017/kanbanly

    # JWT Authentication
    ACCESS_TOKEN_SECRET=your_access_secret
    REFRESH_TOKEN_SECRET=your_refresh_secret
    VERIFICATION_TOKEN_SECRET=your_verification_secret
    ACCESS_COOKIE_MAXAGE=300000
    REFRESH_COOKIE_MAXAGE=604800000

    # Redis (Caching)
    REDIS_HOST=localhost
    REDIS_PORT=6379
    REDIS_USER=default
    REDIS_PASS=

    # Google OAuth & AI
    OAUTH_CLIENT_ID=your_google_client_id
    OAUTH_SECRET=your_google_client_secret
    REDIRECT_URI=http://localhost:3000
    GOOGLE_USERINFO_ENDPOINT=https://www.googleapis.com/oauth2/v3/userinfo
    GOOGLE_API_KEY=your_gemini_api_key

    # Vector DB (Pinecone)
    PINECONE_API_KEY=your_pinecone_key
    PINECONE_INDEX_NAME=kanbanly-index
    PINECONE_NAMESPACE=kanbanly-docs

    # Cloudinary (Images)
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret

    # Email Service
    EMAIL_USER=your_email@gmail.com
    EMAIL_PASS=your_email_app_password

    # Stripe (Payments)
    STRIPE_SECRET_KEY=your_stripe_secret
    STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
    ```

4.  **Seed the AI Knowledge Base (Optional):**
    If you want the AI assistant to be aware of the documentation:

    ```bash
    npm run seed
    ```

5.  **Run the server:**

    - **Development**:
      ```bash
      npm run dev
      ```
    - **Production**:
      ```bash
      npm run build
      npm start
      ```

## 🐳 Docker Support

You can run the application using Docker to isolate the environment.

### Prerequisites

- Docker installed on your machine.

### Running the Application

1.  **Ensure your `.env` file is configured** as described in the Installation section.

2.  **Development Mode** (with hot-reloading):

    ```bash
    docker compose --profile dev up --build
    ```

3.  **Production Mode**:
    ```bash
    docker compose --profile prod up --build
    ```

The API will be accessible at `http://localhost:5000`.

## 🧠 AI Capabilities

The `src/ai` module contains a sophisticated agent system:

- **Assistant Agent**: A conversational agent that understands user intent.
- **Tools**:
  - `create_project`: Auto-generates projects based on natural language descriptions.
  - `create_epic`: Creates epics within a project based on high-level requirements.
  - `create_sprint`: Creates sprints with optional goals and timelines.
  - `create_task`: Creates tasks and work items, automatically linking them to projects, epics, or sprints when context is available.
  - `assign_member`: Assigns workspace members to projects, epics, sprints, or tasks.
  - `search_documentation`: Retrieves system usage guides from the vector store.
- **RAG**: Uses Pinecone to store and retrieve embedded documentation for context-aware answers.
