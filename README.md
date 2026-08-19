# Smart Locker

A restaurant menu & category management system: a Spring Boot REST API secured with JWT, paired with a
React admin dashboard for managing categories, menu items, and staff accounts. Built as a portfolio
project to practice patterns you'd actually find in production — layered service architecture, role-based
auth, containerized builds, and a real CI/CD pipeline with environment promotion.

> **Scope:** this repo currently covers the **admin side** only (dashboard + backend API). There is no
> customer-facing ordering app yet — see [Roadmap](#roadmap--known-limitations).

## Tech stack

**Backend**
- Java 17, Spring Boot, Spring Security (JWT, stateless sessions)
- Spring Data JPA + PostgreSQL
- JUnit 5 / Mockito for unit tests

**Frontend**
- React 19, Redux Toolkit, React Router
- Chakra UI, Vite
- Vitest + Testing Library

**Infrastructure**
- Docker (multi-stage builds, dedicated `test` stage per image)
- GitHub Actions CI/CD with environment promotion (dev → test → prod)
- GitHub Container Registry (GHCR)

## Architecture

The backend is organized by domain, not by layer-across-everything: each of `auth`, `category`, and `menu`
has its own `controller` / `service` / `repository` / `dto` / `exception` packages, with a shared
`common` module for cross-cutting response shapes and a `GlobalExceptionHandler` translating domain
exceptions into structured HTTP error responses.

Security is a stateless JWT filter chain (`JwtAuthenticationFilter`) sitting in front of Spring Security,
with BCrypt password hashing and role-based route authorization (`/admin/api/**` requires `ROLE_ADMIN`).

**API surface**

| Method | Path |
|---|---|
| POST | `/admin/api/auth/signup`, `/signin` |
| POST | `/user/api/auth/signup`, `/signin` |
| GET/POST/PUT/DELETE | `/admin/api/category/**` |
| GET/POST | `/admin/api/menu/**` |

### CI/CD: build once, promote forward

The pipeline is deliberately **not** "rebuild on every branch." Only `dev` compiles anything:
