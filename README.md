# Baby Sapiens - AI Parenting Copilot with Bress 💜

Modern landing page with authentication and AI chat specialized in parenting support using **Clerk**, **Next.js 14**, **TypeScript**, **shadcn/ui**, **Tailwind CSS**, and **Botpress**.

## 🌟 Features

- ✅ **Complete Authentication** with Clerk v6 (Sign in/Sign up/OAuth)
- ✅ **Bress AI Assistant** - Evidence-based parenting guidance from pregnancy to age 5
- ✅ **2025 Design System** with glassmorphism and neomorphism (Purple & Turquoise palette)
- ✅ **Intuitive Interface** with conversational AI support
- ✅ **Botpress Integration** with real parenting expertise
- ✅ **shadcn/ui Components** accessible and modern
- ✅ **TypeScript** complete with type safety
- ✅ **Responsive Design** optimized for all devices
- ✅ **Internationalization** ready with next-intl

## 🚀 Installation

### 1. Clone the project
```bash
cd "Landing Baby Sapiens"
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file:

```env
# Clerk Authentication (Required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_XXXXXXXX
CLERK_SECRET_KEY=sk_test_XXXXXXXX

# Clerk URLs (Optional - defaults shown)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/chat
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/chat

# Botpress Webchat (Optional - uses embedded configuration)
NEXT_PUBLIC_BOTPRESS_CLIENT_ID=f657ad35-3575-4861-92bd-e52dac005765
```

#### Configure Clerk:
1. Create an account at [Clerk.com](https://clerk.com)
2. Create a new application
3. Copy the keys from your Clerk dashboard

### 4. Run the project
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 💬 Bress AI Assistant

### Evidence-Based Support
Bress provides intelligent responses for parenting queries based on:

- **WHO** (World Health Organization)
- **AAP** (American Academy of Pediatrics)
- **ACOG** (American College of Obstetricians and Gynecologists)
- **CDC** (Centers for Disease Control and Prevention)
- **NHS/NICE** (National Health Service/National Institute for Health and Care Excellence)

### Key Topics
- 🤰 **Pregnancy Journey** - Week-by-week guidance and symptom tracking
- 🍼 **Feeding Support** - Breastfeeding, formula, and solid foods
- 😴 **Sleep Solutions** - Healthy sleep habits and routines
- 🌱 **Development Milestones** - Tracking from 0-5 years
- 🤒 **Health & Safety** - When to worry and emergency guidance
- 💜 **Emotional Wellness** - Support for parents' mental health

### Features
- 🗣️ **Personalized Conversations** with context awareness
- 📊 **Evidence-based Answers** from trusted medical sources
- ⏱️ **24/7 Availability** for those 3am questions
- 📱 **Mobile-optimized** interface for on-the-go parents
- 🔒 **Privacy-focused** with secure data handling

## 📁 Project Structure

```
src/
├── app/
│   ├── [locale]/           # Internationalized routes
│   │   ├── layout.tsx       # Main layout with ClerkProvider
│   │   ├── page.tsx         # Landing page with integrated SignIn
│   │   ├── chat/           
│   │   │   └── page.tsx     # Bress AI chat interface
│   │   └── dashboard/       
│   │       └── page.tsx     # Redirects to chat
│   ├── globals.css          # 2025 design system with glassmorphism
│   ├── sign-in/            
│   │   └── [[...sign-in]]/
│   │       └── page.tsx     # Dedicated login page
│   └── sign-up/            
│       └── [[...sign-up]]/
│           └── page.tsx     # Dedicated registration page
├── components/
│   └── ui/                  # shadcn/ui components
│       ├── button.tsx
│       └── card.tsx
├── lib/
│   └── utils.ts             # Utility functions (cn function)
├── i18n.ts                  # Internationalization config
├── navigation.ts            # Navigation helpers
├── messages/                # Translation files
│   └── en.json             
└── middleware.ts            # Route protection with Clerk
```

## 🔐 Authentication Configuration

### Available Authentication Methods:
- Email/Password
- Google OAuth
- GitHub OAuth
- Microsoft OAuth
- Apple OAuth

### Theme Customization:
The Clerk theme is customized in `src/app/[locale]/layout.tsx` with:
- Purple gradient buttons
- Glassmorphism cards
- Neomorphism effects
- Custom fonts and colors

## 🎨 Design System 2025

### Color Palette
- **Primary Purple**: `hsl(255, 65%, 55%)` - Inspired by Bress logo
- **Secondary Turquoise**: `hsl(172, 85%, 45%)` - Accent color
- **Soft Pastels**: Pink, Yellow, Green for baby-friendly accents
- **Glassmorphism**: Advanced transparency effects
- **Neomorphism**: Soft, tactile UI elements

### Visual Features
- Advanced glassmorphism with organic shapes
- Neomorphic cards with soft shadows
- Animated background blobs
- Micro-animations (float, pulse)
- Decorative elements (stars, hearts)
- Custom scrollbar design
- Gradient text effects

## 🎯 Main Features

### Landing Page (`/`)
- Split-screen design with branding on the left
- Integrated Clerk form on the right
- Modern glassmorphism with 2025 trends
- Testimonials and trust badges
- Animated background elements
- Mobile responsive

### Chat Interface (`/[locale]/chat`)
- Bress AI with personalized parenting support
- Evidence-based responses
- Beautiful purple/turquoise theme
- Decorative baby-friendly elements
- Real-time conversation with Botpress
- Mobile-optimized interface

### Middleware
- Automatically protects routes
- Public routes: `/`, `/sign-in`, `/sign-up`
- Protected routes: `/[locale]/chat`, `/dashboard`
- Internationalization support

## 🛠️ Technologies Used

- **Next.js 14** - React framework with App Router
- **React 18.3** - Stable version compatible with Botpress
- **TypeScript** - Complete type safety
- **Clerk v6** - Authentication and user management
- **@botpress/webchat v3.2** - AI chat integration
- **shadcn/ui** - Accessible UI components
- **Tailwind CSS** - Utility-first styling with custom design system
- **Lucide Icons** - Modern icon set
- **next-intl** - Internationalization support
- **Radix UI** - UI primitives

## ⚠️ Compatibility Note

This project uses **React 18.3** for Botpress webchat compatibility. The Botpress library specifically requires React 18 to function correctly. Do not upgrade to React 19 as it will cause evaluation errors.

## 📝 Available Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Run production build
npm run lint     # Linting
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables
4. Deploy!

### Required Environment Variables:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
```

## 🤖 Botpress Integration

### Current Configuration
The chat uses the official Bress bot with:
- Bot ID: `cb13f3bc-fe1c-4c9a-810b-e991283cd9e6`
- Client ID: `f657ad35-3575-4861-92bd-e52dac005765`
- Evidence-based parenting guidance
- Support from pregnancy through age 5

### Features
- ✅ **Personalized Responses** based on child's age and stage
- ✅ **Evidence-based Information** from trusted medical sources
- ✅ **Multi-language Support** (Spanish/English)
- ✅ **Context Awareness** for follow-up questions
- ✅ **Emergency Guidance** with appropriate escalation

## 📄 License

MIT

## 🤝 Support

For Clerk support, visit [clerk.com/docs](https://clerk.com/docs)
For Botpress support, visit [botpress.com/docs](https://botpress.com/docs)

---

## 🎯 Use Cases

### For Expecting Parents
- Week-by-week pregnancy guidance
- Symptom tracking and understanding
- Birth preparation resources
- Postpartum recovery support

### For New Parents
- Breastfeeding and formula feeding support
- Sleep training and routines
- Developmental milestone tracking
- Emergency guidance and when to call the doctor

### For Toddler Parents
- Behavior management strategies
- Potty training guidance
- Nutrition and meal planning
- Educational activity suggestions

---

**Developed with 💜 by Baby Sapiens - Evidence-based parenting support for modern families**

**Note:** The system includes a fully integrated Bress AI assistant. Configure Clerk authentication keys to enable the complete experience.