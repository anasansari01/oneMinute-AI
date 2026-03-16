<h1 align="center">⏱️ oneMinute-AI</h1>

<p align="center">
AI answers your documentation questions in <b>one minute</b>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-Fullstack-black?logo=next.js"/>
  <img src="https://img.shields.io/badge/TypeScript-Type%20Safe-blue?logo=typescript"/>
  <img src="https://img.shields.io/badge/PostgreSQL-Database-blue?logo=postgresql"/>
  <img src="https://img.shields.io/badge/OpenAI-AI-green?logo=openai"/>
  <img src="https://img.shields.io/badge/RAG-Architecture-purple"/>
</p>

---

# oneMinute-AI

AI answers your documentation questions in **one minute**.

**oneMinute-AI** is a full-stack AI assistant built with a **Retrieval-Augmented Generation (RAG)** pipeline that provides accurate, context-aware responses using your own documentation as knowledge.

Instead of relying only on an LLM, the system retrieves relevant information from indexed documents using **vector embeddings and semantic search**, then generates grounded responses.

Built with **Next.js, TypeScript, PostgreSQL, and OpenAI**, the project demonstrates how modern AI applications combine **LLMs + retrieval systems** for reliable answers.

---

# 🚀 Live Demo

https://one-minute-ai.vercel.app

---

# 📸 Screenshots

<p align="center">
  <img src="https://raw.githubusercontent.com/anasansari01/images/main/oneMinuteAI/ai%201.png" width="45%" />
  <img src="https://raw.githubusercontent.com/anasansari01/images/main/oneMinuteAI/ai%202.png" width="45%" />
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/anasansari01/images/main/oneMinuteAI/ai%203.png" width="45%" />
  <img src="https://raw.githubusercontent.com/anasansari01/images/main/oneMinuteAI/ai%204.png" width="45%" />
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/anasansari01/images/main/oneMinuteAI/ai%205.png" width="70%" />
</p>

---

# ✨ Key Features

### 🤖 AI Chat Assistant
A responsive chat interface where users can ask questions about their documentation.

### 🧠 Retrieval-Augmented Generation (RAG)
Improves response quality by retrieving relevant knowledge before generating answers.

### 🔎 Semantic Search
Uses vector embeddings to find the most relevant content instead of keyword search.

### 📚 Document Knowledge Base
Documents are chunked, embedded, and stored for efficient retrieval.

### 🧩 Context-Aware Responses
Relevant document chunks are injected into prompts before calling the language model.

### 🏗 Modern Full-Stack Architecture
Clean separation between ingestion, retrieval, and generation layers.

### ⚡ Scalable Backend Design
Built to scale with modular services and database architecture.

---

# 🧰 Tech Stack

## 🎨 Frontend
- Next.js
- React
- TypeScript
- Modern component-based UI

## ⚙️ Backend
- Node.js
- Next.js API Routes
- Modular service architecture

## 🗄 Database
- PostgreSQL
- Drizzle ORM

## 🤖 AI / ML
- OpenAI API
- Vector embeddings
- Semantic similarity search
- Retrieval-Augmented Generation (RAG)

---

# 🔬 How It Works

The project follows a **RAG architecture pipeline**:

### 1. Document Ingestion
User documentation is added to the system.

### 2. Text Chunking
Large documents are split into smaller sections.

### 3. Embedding Generation
Each chunk is converted into a vector embedding using an AI model.

### 4. Vector Storage
Embeddings are stored in PostgreSQL for similarity search.

### 5. User Query
The user asks a question in the chat interface.

### 6. Semantic Retrieval
The system finds the most relevant document chunks using vector similarity.

### 7. Prompt Augmentation
Retrieved context is added to the LLM prompt.

### 8. AI Response Generation
The language model generates a grounded, context-aware answer.

---

# 🏗 Architecture Overview

```
User Question
      │
      ▼
Chat Interface (Next.js)
      │
      ▼
API Route
      │
      ▼
Query Embedding
      │
      ▼
Vector Similarity Search
(PostgreSQL + Embeddings)
      │
      ▼
Retrieve Relevant Document Chunks
      │
      ▼
Prompt Construction
      │
      ▼
OpenAI LLM
      │
      ▼
Context-Aware Response
      │
      ▼
Return to Chat UI
```

---

# 📂 Project Structure

```
oneMinute-AI
│
├── app/                             # Next.js App Router
│   │
│   ├── api/                         # Backend API routes
│   │   ├── auth/
│   │   ├── chat/
│   │   ├── conversations/
│   │   ├── knowledge/
│   │   ├── metadata/
│   │   ├── organization/
│   │   ├── section/
│   │   ├── team/
│   │   ├── widget/
│   │   └── webhook/
│   │       └── scalekit/
│   │
│   ├── dashboard/                   # Dashboard pages
│   │   ├── chatbot/
│   │   ├── conversations/
│   │   ├── knowledge/
│   │   ├── sections/
│   │   └── settings/
│   │
│   ├── chatbot/
│   │   └── metadata/
│   │
│   ├── embed/                       # Embeddable chatbot pages
│   │
│   ├── test/
│   │
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── components/                      # Reusable UI components
│   ├── dashboard/
│   ├── landing/
│   └── ui/
│
├── db/                              # Database setup
│   ├── client.ts
│   └── schema.ts
│
├── hooks/                           # Custom React hooks
│   ├── use-mobile.ts
│   └── useUser.ts
│
├── lib/                             # Core utilities & AI logic
│   ├── countConversationTokens.ts
│   ├── isAuthorized.ts
│   ├── openAI.ts
│   ├── scalekit.ts
│   └── utils.ts
│
├── public/                          # Static assets
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   ├── widget.js
│   └── window.svg
│
├── @types/                          # TypeScript type definitions
│
├── drizzle.config.ts                # Drizzle configuration
├── next.config.ts                   # Next.js configuration
├── tsconfig.json                    # TypeScript config
├── package.json                     # Dependencies
├── postcss.config.mjs
├── components.json
└── README.md
```

---

# 🛠 Getting Started

## 1. Clone the repository

```bash
git clone https://github.com/yourusername/oneMinute-AI.git
cd oneMinute-AI
```

---

## 2. Install dependencies

```bash
npm install
```

or

```bash
pnpm install
```

---

## 3. Setup environment variables

Create a `.env` file in the root directory.

```
SCALEKIT_ENVIRONMENT_URL=
SCALEKIT_CLIENT_ID=
SCALEKIT_CLIENT_SECRET=
SCALEKIT_REDIRECT_URI=
DATABASE_URL=
ZENROWS_API_KEY=
OPENAI_API_KEY=
OPENAI_BASE_URL=https://api.openai.com/v1
SCALEKIT_WEBHOOK_SECRET=
JWT_SECRET=
GROQ_API_KEY=
NEXT_PUBLIC_WEBSITE_URI=https://one-minute-ai.vercel.app/
```

Example:

```
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxx
DATABASE_URL=postgresql://user:password@localhost:5432/oneminuteai
```

---

## 4. Run database migrations

```
npx drizzle-kit push
```

---

## 5. Start development server

```
npm run dev
```

Open:

```
http://localhost:3000
```

---

# 💡 Example Use Cases

- AI documentation assistants
- Internal company knowledge bots
- Customer support AI
- Developer documentation search
- Learning assistants for courses
- Knowledge base chatbots

---

# 🧠 Why RAG?

Large Language Models can hallucinate when they lack context.

Retrieval-Augmented Generation solves this by:

- retrieving real data
- grounding responses in documentation
- improving accuracy
- reducing hallucinations

This architecture is used by modern AI systems including tools built by:

**OpenAI**, **Notion AI**, and **Perplexity-like assistants**.

---

# 🚀 Future Improvements

- File/document upload UI
- Authentication system
- User workspaces
- Streaming AI responses
- Better vector search indexing
- Analytics and usage tracking
- Multi-document collections

---

# 🎓 Learning Goals

This project demonstrates practical implementation of:

- Retrieval-Augmented Generation (RAG)
- Vector embeddings
- Semantic search
- Full-stack TypeScript development
- AI-powered applications
- Scalable backend architecture

---

# 🤝 Contributing

Contributions are welcome.

If you'd like to improve the project:

1. Fork the repository  
2. Create a feature branch  
3. Submit a pull request  

---

# 👨‍💻 Author

Built by a developer passionate about **AI-powered applications, clean architecture, and modern web technologies**.

If you like this project, consider giving it a ⭐ on GitHub.
