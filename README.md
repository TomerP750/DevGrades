# DevGrades

DevGrades is a full-stack platform where developers can publish projects, receive structured peer reviews, discover other developers, and communicate through real-time direct messaging.

The project combines a React and TypeScript single-page application with a modular NestJS API, PostgreSQL persistence, Redis-backed refresh-token rotation, and Socket.IO messaging.

## Key Features

- User registration, sign-in, session restoration, and account management
- Project creation, editing, closing, deletion, and per-user archiving
- Searchable and sortable project feed
- Keyset-based cursor pagination
- Project repository, demo, description, and image metadata
- Structured reviews across six scoring categories
- Aggregated review statistics
- Review ownership, duplicate-review, and self-review restrictions
- Developer profiles with follower and following counts
- Follow and unfollow functionality
- Real-time one-to-one messaging with persisted conversation history
- Responsive navigation and light/dark themes
- AI review interface prototype using local mock data

> The AI review page is currently a frontend prototype. It does not call an AI model or backend review service.

## Technology Stack

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- Axios
- React Hook Form
- Socket.IO Client
- React Toastify

### Backend

- NestJS 11
- TypeScript
- TypeORM
- REST APIs
- Socket.IO gateways
- Class Validator
- Class Transformer
- bcrypt
- JSON Web Tokens

### Data Stores

- PostgreSQL for application data
- Redis for hashed refresh tokens and per-user token indexes

### Testing and Tooling

- Jest
- NestJS Testing utilities
- Supertest
- ESLint
- Prettier

### Infrastructure

- Backend and frontend Dockerfiles
- Docker Compose development scaffold
- GitHub Actions build and test workflows

## Architecture

The repository contains separate frontend and backend applications.

The frontend uses a feature-oriented structure for authentication, projects, reviews, profiles, settings, messaging, and the AI review prototype. TanStack Query manages server state, caching, mutations, and infinite project-feed queries. Authentication and theme preferences are managed through React Context.

The backend is divided into NestJS modules for:

- Authentication
- Users
- Profiles
- Projects
- Reviews
- Archived projects
- Follows
- Conversations
- Messages
- Redis integration

REST controllers handle account, profile, project, review, follow, and conversation operations. A Socket.IO gateway handles real-time message creation and deletion.

## Important Technical Decisions

### Keyset Pagination

The project feed uses keyset pagination instead of offset pagination.

Each cursor contains:

- The selected sort mode
- The current sort value
- The project ID used as a deterministic tie-breaker
- The search and archived-project filters active when the cursor was created

The backend rejects cursors that do not match the current sorting and filter configuration. It requests one additional row to determine whether another page is available.

PostgreSQL indexes support pagination by project creation date and project name.

### Server-State Management

TanStack Query manages API data, mutations, cache invalidation, and infinite project-feed loading.

Project filters are represented in URL search parameters. Search, sorting, and archived-only state therefore remain visible in the route rather than existing only in component state.

Incoming Socket.IO messages update the corresponding conversation cache and move the updated conversation to the beginning of the conversation list.

### Response Serialization

NestJS interceptors transform entities into explicit response DTOs. This limits returned fields and prevents internal entity properties from being exposed accidentally.

The user password column is also excluded from normal TypeORM queries and is selected explicitly only during credential and password operations.

## Authentication and Security

- Passwords are hashed with bcrypt using a cost factor of 12.
- JWT access tokens contain the user ID, email, and role.
- Access tokens are held in frontend memory and attached to Axios requests.
- Refresh tokens are sent through HTTP-only, SameSite cookies.
- Raw refresh tokens are not stored server-side.
- SHA-256 token hashes are stored in Redis with expiration times.
- Refresh-token rotation consumes the current token and creates its replacement through an atomic Redis Lua operation.
- A global NestJS authentication guard protects routes unless they are explicitly marked public.
- WebSocket connections and message events require a valid access token.
- Project, review, and message services enforce resource ownership.
- Review creation prevents self-reviews and multiple reviews by the same user for one project.

Global request validation enables DTO transformation and removes properties that are not declared by the DTO. A global exception filter returns consistent status, timestamp, and request-path metadata.

### Current Authentication Limitation

Refresh-token rotation is implemented, but the server-side methods for revoking an individual refresh token and revoking all tokens for a user are not yet complete. Logout clears the browser cookie and frontend authentication state, but complete server-side token revocation should be finished before treating the authentication flow as production-ready.

## Data Model

The main entities are:

- **User** — account identity, credentials, role, and avatar
- **Profile** — one-to-one profile information associated with a user
- **Project** — project metadata and its owner
- **Review** — category scores, comments, reviewer, and reviewed project
- **ArchivedProject** — unique per-user project bookmark
- **Follow** — unique follower/followed relationship between users
- **Conversation** — participants in a direct conversation
- **Message** — persisted message, author, and conversation

Notable constraints include unique archived-project pairs and unique follower/followed pairs.

## Engineering Highlights

- Modular NestJS backend with explicit domain boundaries
- Feature-oriented React application structure
- Filter-aware keyset pagination
- Indexed pagination columns
- Redis Lua script for atomic refresh-token replacement
- Authenticated Socket.IO rooms
- Persisted real-time messages
- Client-side real-time cache synchronization
- Explicit response DTO serialization
- Resource-level authorization rules
- URL-backed feed filters
- Parallel database lookups where operations are independent

## Project Structure

```text
DevGrades/
├── backend/
│   ├── src/
│   │   ├── authentication/     # JWT and refresh-token authentication
│   │   ├── archived-projects/  # Per-user project bookmarks
│   │   ├── conversations/      # Direct conversations and history
│   │   ├── follows/            # User follow relationships
│   │   ├── messages/           # Socket.IO gateway and persistence
│   │   ├── profiles/           # Profile data and follow statistics
│   │   ├── projects/           # Project CRUD, search, sorting, and pagination
│   │   ├── redis/              # Redis client lifecycle
│   │   ├── reviews/            # Reviews, authorization, and score statistics
│   │   ├── shared/             # Pagination, serialization, and error handling
│   │   ├── users/              # User and password management
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── test/                   # End-to-end test configuration
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── features/           # Feature-specific UI, API clients, and hooks
│   │   ├── home/               # Public landing page
│   │   ├── layout/             # Application routing and navigation
│   │   └── shared/             # Shared contexts, models, utilities, and UI
│   └── Dockerfile
├── .github/
│   └── workflows/              # CI and artifact workflow definitions
└── docker-compose.yml