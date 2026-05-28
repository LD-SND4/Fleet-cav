# Next.js SDD Development Guidelines

> Software Design & Development (SDD) standards for modern Next.js applications.
>
> Focus Areas:
>
> - Architecture
> - Scalability
> - UI/UX
> - Testing
> - Maintainability
> - Performance
> - Accessibility
> - Deployment
> - Team standards

---

# Core Principles

## Main Goals

Every Next.js project should prioritize:

- Scalability
- Maintainability
- Readability
- Reusability
- Accessibility
- Performance
- SEO
- Security
- Responsive Design

---

# Project Structure

## Recommended App Structure

```txt
src/
│
├── app/
│   ├── api/
│   ├── dashboard/
│   ├── auth/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── forms/
│   ├── charts/
│   └── shared/
│
├── services/
│   ├── api/
│   ├── auth/
│   └── analytics/
│
├── hooks/
│
├── lib/
│
├── utils/
│
├── types/
│
├── store/
│
├── tests/
│
└── styles/
```

---

# Architecture Standards

## Use App Router

Prefer:

```txt
/app
```

Avoid legacy Pages Router unless maintaining older projects.

---

## Component Separation

### Server Components

Use for:

- Data fetching
- SEO content
- Static rendering
- Heavy backend logic

### Client Components

Use only when needed:

```tsx
"use client";
```

Examples:

- Forms
- Interactive UI
- Modals
- Charts
- Drag & drop
- Browser APIs

---

## Keep Components Small

Preferred:

```txt
150-250 lines max per component
```

Avoid:

- Massive pages
- Mixed business logic
- Inline API handling

---

# State Management

## Recommended Hierarchy

### Local State

Use:

```tsx
useState
useReducer
```

For:

- Modals
- Inputs
- Local toggles

---

### Shared State

Use:

- Zustand
- Redux Toolkit
- React Context

Avoid excessive prop drilling.

---

### Server State

Use:

- React Query / TanStack Query
- SWR

For:

- API caching
- Async synchronization
- Revalidation

---

# API Standards

## Centralize API Logic

Avoid:

```tsx
fetch()
```

directly inside components repeatedly.

Preferred:

```txt
/services/api
```

Example:

```ts
export async function getUsers() {
  return fetch("/api/users");
}
```

---

# UI/UX Standards

# Responsive Design

## Required Breakpoints

Support:

| Device | Width |
|---|---|
| Mobile | < 768px |
| Tablet | 768px - 1024px |
| Desktop | > 1024px |

---

## Mobile First

Always design mobile first.

Preferred flow:

```txt
Mobile → Tablet → Desktop
```

---

# UI Consistency

## Use Design Systems

Preferred:

- Tailwind CSS
- shadcn/ui
- Radix UI

Maintain:

- consistent spacing
- typography scale
- button styles
- form patterns
- shadows
- border radius

---

# UX Rules

## Loading States

Every async action should include:

- Skeleton loaders
- Spinner
- Placeholder state

Never leave blank screens.

---

## Error States

Every request should handle:

- API failure
- Empty data
- Permission issues
- Timeout handling

---

## Feedback

Users should always receive feedback for:

- Saving
- Deleting
- Errors
- Success states
- Loading actions

---

# Accessibility (A11Y)

## Required Standards

Maintain:

- Semantic HTML
- Keyboard navigation
- Focus visibility
- ARIA labels
- Color contrast
- Screen reader support

---

## Accessibility Checklist

### Required

- Buttons must have labels
- Inputs require labels
- Images require alt text
- Modals require focus trap
- Forms require validation messaging

---

# Performance Standards

# Rendering

## Prefer Server Components

Reduce unnecessary hydration.

---

## Avoid Large Client Bundles

Use:

```tsx
dynamic()
```

for heavy components.

Example:

```tsx
const Chart = dynamic(() => import("./Chart"), {
  ssr: false,
});
```

---

# Optimization

## Images

Always use:

```tsx
next/image
```

Never raw `<img />` unless necessary.

---

## Fonts

Use:

```tsx
next/font
```

Avoid external font loading.

---

## Route Loading

Use:

```txt
loading.tsx
```

for route transitions.

---

# SEO Standards

## Metadata

Every route should define:

```ts
export const metadata = {}
```

Include:

- title
- description
- open graph
- twitter metadata

---

## Semantic Structure

Use proper:

```html
<header>
<main>
<section>
<footer>
<nav>
```

---

# Authentication Standards

## Recommended Providers

Preferred:

- NextAuth/Auth.js
- Clerk
- Supabase Auth

---

## Security Rules

Never:

- expose secrets
- store tokens insecurely
- trust frontend validation alone

Always validate server-side.

---

# Form Standards

## Validation

Preferred:

- React Hook Form
- Zod

Example:

```ts
const schema = z.object({
  email: z.string().email(),
});
```

---

# Testing Standards

# Unit Testing

## Recommended Tools

- Vitest
- Jest
- React Testing Library

Test:

- Components
- Hooks
- Utility functions

---

# E2E Testing

## Recommended

- Playwright
- Cypress

Critical flows:

- Login
- Checkout
- Dashboard navigation
- Form submission

---

# API Testing

Test:

- Error responses
- Auth protection
- Validation
- Rate limits

---

# CI/CD Standards

# Recommended Pipelines

## Verify On Pull Requests

Must run:

```txt
Lint
Typecheck
Tests
Build
```

---

## Example Commands

```bash
npm run lint
npm run test
npm run build
```

---

# Code Quality Standards

# Naming

## Components

```txt
PascalCase
```

Example:

```txt
UserCard.tsx
```

---

## Hooks

```txt
useSomething
```

Example:

```txt
useAuth.ts
```

---

## Utilities

```txt
camelCase
```

Example:

```txt
formatCurrency.ts
```

---

# Clean Code Rules

## Avoid

- Massive files
- Duplicate logic
- Inline business rules
- Deep nested conditionals
- Hardcoded values

---

## Prefer

- Reusable components
- Constants
- Config files
- Utility helpers
- Composition patterns

---

# Logging & Monitoring

# Recommended Services

- Sentry
- LogRocket
- PostHog
- Vercel Analytics

Track:

- Errors
- Performance
- User flows
- Crashes

---

# Deployment Standards

# Recommended Platforms

Preferred:

- Vercel
- Docker
- AWS
- Azure

---

# Environment Variables

## Rules

Never commit:

```txt
.env
```

Use:

```txt
.env.local
.env.production
```

---

# Git Standards

# Branch Naming

```txt
feature/auth-page
fix/dashboard-crash
refactor/api-service
```

---

# Commit Standards

Preferred:

```txt
feat:
fix:
refactor:
test:
docs:
```

Example:

```txt
feat: add shipment dashboard filters
```

---

# Documentation Standards

Every project should include:

- README.md
- Environment setup
- Deployment steps
- API references
- Folder structure
- Architecture explanation

---

# Maintenance Guidelines

# Refactoring

Review regularly:

- duplicate components
- unused packages
- bundle size
- dead code
- accessibility regressions

---

# Dependency Management

Review monthly:

```bash
npm outdated
```

Update cautiously.

---

# Recommended Stack

## UI

- Tailwind CSS
- shadcn/ui
- Framer Motion

## Forms

- React Hook Form
- Zod

## State

- Zustand
- TanStack Query

## Testing

- Vitest
- Playwright

## Backend

- Next.js Route Handlers
- Supabase
- Prisma
- PostgreSQL

---

# Final Development Checklist

## Before Production

- [ ] Mobile responsive
- [ ] Accessibility tested
- [ ] Lighthouse reviewed
- [ ] SEO metadata added
- [ ] Error boundaries implemented
- [ ] Loading states implemented
- [ ] Empty states implemented
- [ ] API validation completed
- [ ] Build passes successfully
- [ ] Tests passing
- [ ] Environment variables secured
- [ ] Analytics configured
- [ ] Monitoring configured

---

# Critical Reminder

Next.js evolves rapidly.

Always verify:

- Routing conventions
- Server Component behavior
- Caching behavior
- Metadata APIs
- Deployment notes

using official documentation for the installed version.