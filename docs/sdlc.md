# Software Development Life Cycle (SDLC)

## SDLC Model
This project follows a Lightweight Agile SDLC, suitable for small teams or solo developers delivering production-ready features within a constrained timeline.

---

## Phase 1: Planning & Requirements
- Defined project scope and constraints
- Identified core features required for an MVP
- Created epics and user stories in Jira
- Established a 2–3 week delivery timeline

**Deliverables**
- Jira backlog
- Sprint plan
- High-level requirements

---

## Phase 2: Design
- Defined system architecture
- Separated frontend, backend, and database responsibilities
- Designed authentication and message flow
- Planned security controls

**Deliverables**
- Architecture diagram
- Database schema outline

---

## Phase 3: Implementation
Development was divided into two sprints.

### Sprint 1 - Core Functionality
- Project setup
- User authentication
- WebSocket integration
- Real-time messaging
- Message persistence

### Sprint 2 - Security & Deployment
- Access control enforcement
- Server-side identity validation
- UX enhancements (typing indicator, presence)
- Application deployment

---

## Phase 4: Testing
- Manual functional testing
- Authentication and access validation
- WebSocket connection testing
- Basic error handling verification

---

## Phase 5: Deployment & Review
- Dockerised application
- Deployed frontend and backend
- Verified real-time communication in production
- Reviewed scope against original plan

---

## Trade-Offs & Decisions
- Focused on core messaging features to maintain delivery timeline
- Deferred advanced features such as file sharing and analytics
- Prioritised security and architecture over UI complexity
