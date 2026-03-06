# SaaS Project Architecture: Small Local Businesses

This document outlines the proposed architecture for a new SaaS platform targeting small local businesses, offering appointment booking, client management, automated reminders, and a basic business website. The focus is on a clean, efficient, and scalable solution using modern web technologies.

## 1. Project Structure

We will adopt a monorepo approach using `pnpm` (or `npm`/`yarn` workspaces) to manage multiple applications and packages within a single repository. This promotes code sharing, consistent tooling, and simplified dependency management.

```
/project-root
├── apps/
│   ├── web/           # Next.js frontend for business owners and public website
│   └── api/           # NestJS backend API
├── packages/
│   ├── ui/            # Reusable UI components (e.g., Shadcn UI, Radix UI)
│   ├── types/         # Shared TypeScript types and interfaces
│   ├── config/        # Shared configurations (ESLint, Prettier, TypeScript, etc.)
│   └── db/            # Database client and schema (Prisma)
├── .env.example       # Example environment variables
├── pnpm-workspace.yaml
└── README.md
```

## 2. Frontend (Next.js - `apps/web`)

**Framework:** Next.js (latest version with App Router)

**Description:** This application will serve as both the public-facing business website (showcasing services, contact info, booking portal) and the authenticated dashboard for business owners (managing clients, appointments, settings).

**Key Technologies:**
*   **React:** For building user interfaces.
*   **TypeScript:** For type safety and improved developer experience.
*   **Tailwind CSS:** For utility-first styling and rapid UI development.
*   **UI Library (e.g., Shadcn UI / Radix UI):** Provides accessible, customizable, and high-quality UI components, built on top of Radix UI primitives and styled with Tailwind CSS.
*   **Authentication:** NextAuth.js (Auth.js) for handling various authentication providers (email/password, Google, etc.).
*   **Data Fetching:** React Query (TanStack Query) for efficient data fetching, caching, and state management.

**Features:**
*   **Public Website:** Customizable pages for business info, services, contact, booking form.
*   **Client Booking Portal:** Intuitive interface for clients to book appointments.
*   **Business Dashboard:**
    *   Client Management (view, add, edit clients).
    *   Appointment Management (schedule, reschedule, cancel).
    *   Service Configuration.
    *   Automated Reminder Settings.
    *   Subscription Management (via Stripe Customer Portal).

## 3. Backend (NestJS - `apps/api`)

**Framework:** NestJS

**Description:** A progressive Node.js framework for building efficient, reliable, and scalable server-side applications. It uses TypeScript by default and combines elements of OOP, FP, and FRP.

**Key Technologies:**
*   **Node.js:** Runtime environment.
*   **TypeScript:** Primary language.
*   **Database:** PostgreSQL (Relational Database) for its robustness, scalability, and rich feature set.
*   **ORM:** Prisma (Object-Relational Mapper) for type-safe database access, migrations, and schema management. This will be defined in `packages/db`.
*   **Authentication & Authorization:** JWT (JSON Web Tokens) for API authentication, integrated with NextAuth.js on the frontend. Role-Based Access Control (RBAC) for granular permissions.
*   **API Type:** RESTful API for standard CRUD operations.
*   **Validation:** Class-validator & Class-transformer for robust request payload validation.
*   **Queues (e.g., BullMQ / Redis):** For handling background tasks like sending automated reminders (SMS/email), processing Stripe webhooks, and other non-critical, time-consuming operations asynchronously.

**Core Modules:**
*   **Auth Module:** User registration, login, JWT token generation/validation.
*   **User Module:** Business owner profiles.
*   **Client Module:** CRUD operations for client data.
*   **Appointment Module:** Scheduling logic, availability management, booking, cancellations.
*   **Service Module:** Define services offered by the business.
*   **Notification Module:** Sending email and SMS reminders (integrates with a queue system).
*   **Website Module:** API endpoints for managing public website content (if dynamic).
*   **Payment Module (Placeholder for Stripe):** Handles subscription logic, webhooks, and API interactions with Stripe. (Implementation deferred until API keys are provided).

## 4. Core Features Integration

*   **Appointment Booking:** Frontend allows clients to select services, view availability (fetched from backend), choose a time slot, and provide contact info. Backend manages availability, creates appointments, and triggers reminder queues.
*   **Client Management:** Business owners use the Next.js dashboard to add, view, edit, and search client profiles. Backend provides secure CRUD API endpoints.
*   **Automated Reminders (SMS/Email):** Configurable by business owners via the dashboard. Backend uses a queue system (e.g., BullMQ) to process reminder jobs. A dedicated worker consumes jobs from the queue and integrates with third-party services (e.g., Twilio for SMS, SendGrid/Resend for Email).
*   **Basic Business Website:** Frontend Next.js application will render static and dynamic content for the business website. Business owners can customize basic content and branding via the dashboard (if content is dynamic, otherwise static content is deployed).

## 5. API Key Management

Secure handling of API keys is crucial.

*   **Environment Variables:** All API keys and sensitive credentials will be stored as environment variables (`.env` files in development, secure secrets management in production).
*   **Backend Responsibility:** Sensitive API keys (e.g., Stripe Secret Key, Twilio Auth Token, Email API Key) will ONLY be accessed by the backend. The frontend will never directly hold or expose these keys.
*   **Frontend Public Keys:** Only public-facing keys (e.g., Stripe Publishable Key) can be exposed to the frontend, retrieved securely from environment variables or a build process.
*   **Secrets Management (Production):** In production environments, environment variables will be managed by a secure secrets management service provided by the cloud provider (e.g., AWS Secrets Manager, Google Secret Manager, Kubernetes Secrets) or a dedicated solution like HashiCorp Vault.

## 6. Stripe Integration (Deferred)

Once API keys are available, Stripe integration will proceed:

*   **Frontend:** Utilize Stripe.js and `@stripe/react-stripe-js` for secure payment collection (subscriptions, payment methods) and redirection to the Stripe Customer Portal for billing management.
*   **Backend (Payment Module):**
    *   Create and manage Stripe Customers.
    *   Handle Stripe Subscriptions (create, update, cancel).
    *   Process Stripe Webhooks for asynchronous event handling (e.g., `invoice.payment_succeeded`, `customer.subscription.updated`).
    *   Securely store minimal necessary Stripe IDs (Customer ID, Subscription ID) in the database.

## 7. Scalability Considerations

*   **Stateless Services:** Both Next.js and NestJS applications will be designed to be stateless, allowing for easy horizontal scaling by adding more instances.
*   **Database Scaling:** PostgreSQL supports various scaling strategies, including read replicas, sharding, and managed services (AWS RDS, Google Cloud SQL).
*   **Message Queues:** Using a message queue (e.g., Redis-backed BullMQ) decouples background tasks from the main request/response cycle, improving responsiveness and allowing independent scaling of workers.
*   **CDN:** Content Delivery Network for Next.js static assets and images to improve global performance.
*   **Caching:** Implementing caching strategies (e.g., Redis for API responses, Vercel/Next.js caching for frontend) to reduce database load and improve response times.
*   **Load Balancing:** Deploying behind a load balancer to distribute traffic across multiple instances of frontend and backend services.

This architecture provides a solid foundation for building a robust, maintainable, and scalable SaaS platform.