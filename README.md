# Real-Time Messaging Web Application

## Overview
This project is a secure real-time messaging web application developed as a solo project using a lightweight Agile SDLC. The goal was to design and deliver a production-style system within a realistic 2–3 week timeline, focusing on security, clean architecture, and real-time communication.

The application supports authenticated users, real-time message exchange via WebSockets, and persistent message storage.

---

## SDLC Approach
A lightweight Agile approach was used to simulate real-world delivery for a small team or startup environment.

- Planning & Requirements
- Design
- Implementation (2 sprints)
- Testing
- Deployment & Review

Development was time-boxed into two sprints to control scope and prioritise core functionality.

---

## Tech Stack
**Frontend**
- Next.js (TypeScript)
- WebSocket client

**Backend**
- NestJS (TypeScript)
- Socket.IO

**Database**
- PostgreSQL
- Prisma ORM

**Security**
- JWT authentication (HttpOnly cookies)
- Server-side identity enforcement
- Role-based access control
- Rate limiting and input sanitisation

**Infrastructure**
- Docker
- Cloud deployment (e.g. Render / Fly.io)

---

## Key Features
- Secure user authentication
- Real-time messaging using WebSockets
- Message persistence
- Typing indicators and online presence
- Access-controlled conversations

---

## Security Considerations
- User identity is resolved server-side only
- Client does not submit sender identifiers
- Conversation membership is validated on every message
- Messages are sanitised before storage
- Rate limiting applied to messaging endpoints

---

## Project Timeline
**Week 1**
- Planning, requirements, and architecture design

**Week 2 (Sprint 1)**
- Authentication
- Real-time messaging
- Message persistence

**Week 3 (Sprint 2)**
- Security hardening
- UX enhancements
- Deployment and documentation

---

## Documentation
- SDLC details: `docs/sdlc.md`
- Architecture diagram: `docs/architecture.png`

---

## Screenshots
Screenshots of the planning process, sprint boards, and application UI are included to demonstrate the development lifecycle.

---

## Future Improvements to be considered (Advanced Features)
- Read receipts
- Message search
- File attachments
- Automated testing