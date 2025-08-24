# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Baby Sapiens** - AI-powered parenting support platform featuring Bress, an evidence-based parenting copilot for families from pregnancy through age 5. Built with Next.js 14, Clerk authentication, Botpress integration, and a modern 2025 design system with glassmorphism and neomorphism.

## Core Architecture

### Authentication & Routing
- **Clerk v6**: Complete authentication with OAuth support (Google, GitHub, Microsoft, Apple)
- **next-intl**: Internationalization with locale-based routing
- **Middleware Stack**: Combined Clerk authentication + intl routing in `src/middleware.ts`
- **Public Routes**: `/`, `/sign-in(.*)`, `/sign-up(.*)`
- **Protected Routes**: `/[locale]/chat`, `/dashboard` (auto-protected by middleware)

### Internationalization (i18n)
- **Locale Support**: Currently `en` only, extensible via `src/i18n.ts`
- **Dynamic Routing**: `[locale]` parameter in routes
- **Message Files**: `src/messages/[locale].json`
- **Navigation Helper**: Custom navigation from `src/navigation.ts`
- **Locale Prefix**: Set to `never` (URLs don't show locale)

### Bress AI Integration
- **Botpress Webchat v3.2**: Embedded AI parenting assistant at `/[locale]/chat`
- **Bot Configuration**: Real Bress bot with ID `cb13f3bc-fe1c-4c9a-810b-e991283cd9e6`
- **Client ID**: `f657ad35-3575-4861-92bd-e52dac005765`
- **Evidence Sources**: WHO, AAP, ACOG, CDC, NHS/NICE
- **Support Range**: Pregnancy through age 5
- **Key Topics**: Sleep, feeding, development, health, emotional wellness

## Development Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Start production server  
npm run start

# Linting
npm run lint
```

## Environment Variables

Required in `.env.local`:
```env
# Clerk Authentication (Required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk URLs (Optional - defaults to these values)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/chat
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/chat

# Botpress (Optional - uses hardcoded values if not set)
NEXT_PUBLIC_BOTPRESS_CLIENT_ID=f657ad35-3575-4861-92bd-e52dac005765
```

## Key Implementation Details

### TypeScript Configuration
- **Path Alias**: `@/*` maps to `./src/*`
- **Strict Mode**: Enabled for type safety
- **Target**: ES2017 with modern library support

### Design System (2025 Modern)
- **Color Palette**: Purple/Turquoise inspired by Bress logo
  - Primary: `hsl(255, 65%, 55%)` (Bress Purple)
  - Secondary: `hsl(172, 85%, 45%)` (Bress Turquoise)
  - Soft pastels for baby-friendly accents
- **Effects**: 
  - Advanced glassmorphism with organic shapes
  - Neomorphism with soft shadows
  - Animated background blobs
  - Micro-animations (float, pulse)
- **Utilities**: `.glass-card`, `.neo-soft`, `.gradient-text-bress`
- **Components**: shadcn/ui Button and Card in `src/components/ui/`

### React Compatibility
- **React 18.3**: Specifically maintained for Botpress compatibility
- **Note**: Do NOT upgrade to React 19 - causes Botpress evaluation errors

## Route Structure

```
/                           # Landing with integrated sign-in
/sign-in/[[...sign-in]]    # Clerk sign-in catch-all
/sign-up/[[...sign-up]]    # Clerk sign-up catch-all
/[locale]/chat             # Protected Bress chat interface
/dashboard                 # Protected dashboard (redirects to chat)
```

## Deployment

### Vercel Configuration
- **Framework**: Next.js auto-detected
- **Build Command**: `next build`
- **Install Command**: `npm install`
- **Configuration**: `vercel.json` present

### Prerequisites
1. Set up Clerk application at clerk.com
2. Configure environment variables
3. Deploy to Vercel or similar platform
4. Ensure all TypeScript checks pass

## Technical Constraints

### Botpress Integration
- Webchat script loaded via Next.js Script component
- Custom styling injected to override Botpress defaults
- Initialization handled in `useEffect` with retry logic
- Bot opens automatically on page load
- Configured for parenting-specific conversations

### Middleware Execution Order
1. International routing middleware runs first
2. Clerk authentication checks second
3. Response returned with proper locale handling

### Component Patterns
- Server Components by default
- Client Components only when needed (`'use client'`)
- Clerk components require client-side rendering
- Botpress integration requires client-side initialization

## Bress-Specific Configuration

### AI Assistant Behavior
- Warm and serene tone
- Evidence-based responses only
- No medical diagnosis or prescription
- Refers to professional help when needed
- Adapts to user's parenting stage (pregnancy, postpartum, toddler)

### Data Variables (Maintained by Bress)
- `stage`: Current parenting stage
- `age_months`: Child's age in months
- `feeding`: Feeding method (breast, formula, mixed, solids)
- `prefs`: User preferences for response style

### Response Format
- Brief, actionable guidance
- Evidence citations when requested
- Emergency escalation when appropriate
- Multi-language support (Spanish/English)