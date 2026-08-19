# Therma-Lock

## About This Project

Therma-Lock started out as a side project — an idea for a smart locker delivery system where packages could be dropped off and picked up securely, with temperature-aware storage in mind. Along the way, the scope of the original delivery idea shifted, but the engineering work behind it turned into something worth keeping: a full-stack application that now serves as a portfolio project showcasing how I approach backend architecture, frontend development, authentication, testing, and deployment.

Rather than let the code sit unused once the original product idea changed direction, I kept building it out properly — with the same standards I'd apply to a real production system — so it could double as a demonstration of my skills across the stack.

## What This Project Demonstrates

- **Backend engineering** — a Spring Boot (Java 17) API with JWT-based authentication, role-based access control, PostgreSQL persistence via JPA, and a modular structure separating admin and user concerns
- **Frontend engineering** — a React admin interface using Redux Toolkit for state management, with an Axios layer handling auth tokens and session expiry
- **Testing discipline** — unit tests on both backend (JUnit/Mockito) and frontend (Vitest + React Testing Library), scoped deliberately to real logic and business rules rather than padded for coverage numbers
- **DevOps / CI-CD** — multistage Docker builds for both API and frontend, a docker-compose stack for local and CI environments, and a GitHub Actions pipeline following a build-once, promote-many pattern across dev/test/prod stages, publishing to GHCR
- **Security fundamentals** — JWT issuance and validation, password handling, environment-based secrets management, and CORS configuration

## Tech Stack

**Backend:** Spring Boot, Java 17, Maven, Spring Security, JJWT, PostgreSQL, Docker
**Frontend:** React, Redux Toolkit, Axios, Vitest, React Testing Library
**Infrastructure:** Docker, Docker Compose, GitHub Actions, GHCR (GitHub Container Registry)

## Why It's Here

This repo isn't a finished commercial product — it's a working example of how I build software end to end: designing a data model, securing an API, building a usable admin interface on top of it, writing tests where they actually matter, and setting up a CI/CD pipeline that mirrors how a real engineering team would ship changes across environments.

If you're reviewing this as part of my portfolio, feel free to look through the commit history and CI configuration as well as the code itself — a lot of the thinking behind this project shows up in how it evolved, not just in the final state.