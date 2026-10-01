# DevGrades

DevGrades is a full-stack platform where developers can share projects, receive structured peer reviews, browse other submissions, and communicate through real-time messaging. It combines a React and TypeScript frontend with a modular NestJS API, MySQL persistence, JWT authentication, and Socket.IO.

## Features

- User registration, sign-in, session restoration, and logout
- Project creation, editing, closing, deletion, and archiving
- Searchable and sortable project feed with cursor-based pagination
- Project profiles with repository and demo links
- Peer reviews across six criteria: overall score, code quality, optimization, maintainability, scalability, and UI/UX
- Review statistics calculated from submitted scores
- Ownership-based authorization for projects and reviews
- User profiles and account, password, and theme settings
- Real-time one-to-one messaging with conversation history
- Responsive navigation and light/dark themes
- AI review interface prototype using mock review results; no AI backend integration is currently implemented

## Tech Stack

### Frontend
- React 19 and TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- Axios
- React Hook Form
- Socket.IO Client

### Backend
- NestJS
- TypeScript
- TypeORM
- REST APIs
- Socket.IO gateways
- Class Validator and Class Transformer

### Database
- MySQL
- TypeORM entities and relations

### Authentication and Security
- JWT access tokens
- Rotating refresh tokens
- HTTP-only, SameSite refresh-token cookies
- bcrypt password hashing
- Global authentication guard
- Resource ownership checks
- Request validation and response serialization

### Testing
- Jest
- NestJS Testing utilities
- Supertest

### DevOps and CI/CD
- Dockerfiles for the frontend and backend
- GitHub Actions
- ESLint and Prettier

## Architecture / Technical Overview

The frontend is a React single-page application organized into feature-based modules for authentication, projects, reviews, profiles, settings, and messaging. React Context manages authentication and theme state, while TanStack Query handles server state, request caching, mutations, and paginated project data.

The NestJS backend is divided into modules for users, authentication, projects, reviews, archived projects, profiles, conversations, and messages. REST controllers handle account and project-related operations, while a Socket.IO gateway provides real-time messaging.

TypeORM maps users, profiles, projects, reviews, archived projects, conversations, messages, and refresh tokens to MySQL. Relationships connect project and review ownership, user profiles, archived projects, conversation participants, and messages.

## Key Technical Decisions

### Authentication

Access tokens are stored in frontend memory and attached to API requests. Refresh tokens are generated from cryptographically random values, stored as SHA-256 hashes in the database, and sent through HTTP-only cookies. Refresh-token rotation uses a database transaction and pessimistic lock before revoking the previous token.

A global NestJS guard protects routes by default, with selected authentication endpoints marked as public. Project and review services apply additional ownership checks before allowing updates or deletions.

### Data Fetching and State Management

TanStack Query manages API data and mutation invalidation. Authentication and theme preferences use React Context, while project feed filters are stored in URL search parameters so search, sorting, and archive filters remain represented in the route.

Incoming Socket.IO messages update conversation data directly in the query cache and move updated conversations to the top of the conversation list.

### Cursor Pagination

The project feed uses keyset-based cursor pagination rather than offset pagination. Cursors contain the current sort value, project ID, and active filter state. The backend requests one additional record to determine whether another page exists, while the frontend loads subsequent pages through `useInfiniteQuery`.

### API and Database Design

The backend exposes REST resources for authentication, users, profiles, projects, reviews, archived projects, and conversations. Project and review services enforce ownership and review eligibility rules.

The MySQL model includes one-to-one, many-to-one, many-to-many, and unique relationships. Examples include user profiles, project ownership, reviews, archived project bookmarks, conversation participants, and messages.

### Validation and Error Handling

NestJS applies a global validation pipe with DTO transformation and property whitelisting. DTOs validate authentication input, project URLs, review score ranges, comments, pagination limits, and filters. A global exception filter provides consistent HTTP error response metadata.

### Real-Time Messaging

The Socket.IO gateway authenticates connections using the current JWT, places each user in an ID-based room, persists messages through the backend service, and emits created messages to both conversation participants.

## Project Structure

```text
DevGrades/
├── backend/
│   ├── src/
│   │   ├── authentication/    # JWT and refresh-token authentication
│   │   ├── users/             # User accounts and password management
│   │   ├── projects/          # Project CRUD, filtering, and pagination
│   │   ├── reviews/           # Reviews, permissions, and score statistics
│   │   ├── archived-projects/ # Per-user project bookmarks
│   │   ├── profiles/          # User profile data
│   │   ├── conversations/     # Conversation queries and participants
│   │   ├── messages/          # Socket.IO gateway and message persistence
│   │   └── shared/            # Pagination, filters, and serialization
│   └── test/                  # Backend end-to-end test setup
├── frontend/
│   └── src/
│       ├── features/          # Feature-based application modules
│       ├── shared/            # Reusable UI, models, contexts, and utilities
│       ├── layout/            # Routing and navigation
│       └── home/              # Public landing page
└── .github/
    ├── workflows/             # CI and artifact workflow definitions
    └── actions/               # Custom action work in progress