# LinkBird - LinkedIn Lead Generation Platform

A complete LinkedIn lead generation and campaign management platform built with Next.js 15, featuring authentication, dashboard, leads management, and campaigns overview.

## 🚀 Features

### ✅ Completed Features

#### Authentication System
- **Email/Password Authentication** - Complete login and registration flow
- **Google OAuth Integration** - Sign in with Google (configured for Better Auth)
- **Protected Routes** - Automatic redirection for unauthenticated users
- **Session Management** - Persistent user sessions
- **Logout Functionality** - Clean session termination

#### Application Layout & Navigation
- **Responsive Sidebar** - Collapsible navigation with active state indicators
- **Mobile-First Design** - Fully responsive on all devices
- **Clean UI/UX** - Professional interface matching LinkBird design
- **Breadcrumb Navigation** - Clear page hierarchy
- **User Profile Section** - Profile info and logout in sidebar

#### Dashboard Overview
- **Statistics Cards** - Total leads, campaigns, response rates, messages
- **Recent Campaigns** - Quick overview of active campaigns
- **Recent Activity** - Latest lead interactions
- **LinkedIn Accounts** - Connected accounts with usage statistics
- **Performance Metrics** - Visual progress indicators

#### Leads Management
- **Comprehensive Leads Table** - Sortable, filterable leads display
- **Advanced Search & Filters** - Search by name, email, company, campaign, status
- **Lead Detail Side Sheet** - Detailed lead information with smooth animations
- **Status Management** - Update lead status (Pending, Contacted, Responded, Converted)
- **Interaction History** - Track all lead communications
- **Notes System** - Add and view lead notes
- **Campaign Association** - Links leads to specific campaigns

#### Campaigns Management
- **Campaigns Overview** - Complete campaign dashboard
- **Status Tracking** - Active, Paused, Completed, Draft states
- **Performance Metrics** - Lead counts, response rates, progress bars
- **Campaign Statistics** - Visual performance indicators
- **Bulk Actions** - Edit, pause, resume, delete campaigns
- **Search & Filter** - Find campaigns quickly

#### Additional Pages
- **Messages Dashboard** - Message templates and statistics
- **LinkedIn Accounts** - Account management and usage tracking
- **Settings & Billing** - Profile, billing, notifications, security settings

## 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth (credentials + Google OAuth)
- **State Management**: Zustand + TanStack Query
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Animations**: Framer Motion + CSS animations

## 📦 Project Structure

```
linkbird-clone/
├── app/                          # Next.js App Router
│   ├── (auth)/
│   │   ├── login/               # Login page
│   │   └── register/            # Registration page
│   ├── api/auth/[...all]/       # Better Auth API routes
│   ├── dashboard/               # Protected dashboard routes
│   │   ├── campaigns/           # Campaign management
│   │   ├── leads/               # Lead management
│   │   ├── messages/            # Message templates
│   │   ├── accounts/            # LinkedIn accounts
│   │   ├── settings/            # Settings & billing
│   │   └── layout.tsx           # Dashboard layout
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home redirect
├── components/
│   ├── layout/
│   │   └── sidebar.tsx          # Main navigation sidebar
│   ├── ui/                      # Reusable UI components
│   └── providers.tsx            # React Query & Theme providers
├── lib/
│   ├── db/
│   │   ├── index.ts            # Database connection
│   │   └── schema.ts           # Drizzle schema definitions
│   ├── auth.ts                 # Better Auth configuration
│   ├── auth-client.ts          # Client-side auth helpers
│   ├── store.ts                # Zustand state management
│   └── utils.ts                # Utility functions
├── drizzle.config.ts           # Drizzle ORM configuration
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── package.json                # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Google OAuth credentials (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/linkbird-clone.git
   cd linkbird-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update `.env.local` with your values:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/linkbird_clone
   BETTER_AUTH_SECRET=your-secret-key-here
   BETTER_AUTH_URL=http://localhost:3000
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

4. **Set up the database**
   ```bash
   # Generate migrations
   npm run db:generate
   
   # Run migrations
   npm run db:migrate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📋 Database Schema

The application uses the following main entities:

### Users
- Managed automatically by Better Auth
- Stores user profile information
- Links to campaigns, leads, and LinkedIn accounts

### Campaigns
- Campaign management and tracking
- Status: active, inactive, draft
- Associated with users and contains leads

### Leads
- Lead information and contact details
- Status tracking: pending, contacted, responded, converted, rejected
- Linked to campaigns and users
- Interaction history and notes

### LinkedIn Accounts
- Connected LinkedIn account management
- Usage tracking and limits
- Multiple accounts per user support

## 🎨 UI/UX Features

### Design System
- **Color Palette**: Professional blue-based theme matching LinkBird.ai
- **Typography**: Clean, readable font hierarchy
- **Spacing**: Consistent Tailwind spacing scale
- **Components**: Reusable shadcn/ui components
- **Responsive**: Mobile-first responsive design

### Interactive Elements
- **Hover States**: Smooth transitions on interactive elements
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: User-friendly error messages
- **Animations**: Smooth slide-in/out animations for modals and sheets
- **Progress Indicators**: Visual progress bars for campaigns

### Accessibility
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and roles
- **Color Contrast**: WCAG AA compliant color ratios
- **Focus Management**: Clear focus indicators

## 📱 Responsive Design

The application is fully responsive across all device sizes:

- **Mobile (320px+)**: Stack layout, collapsible navigation
- **Tablet (768px+)**: Grid layouts, expanded sidebar
- **Desktop (1024px+)**: Full layout with sidebar, multi-column grids
- **Large Screen (1440px+)**: Optimized for large displays

## 🔧 State Management

### Zustand Store
- Sidebar collapse state
- Selected leads/campaigns
- Filter and search states
- UI state (modals, side sheets)

### TanStack Query
- Data fetching and caching
- Infinite scrolling for leads table
- Optimistic updates
- Background refetching
- Error handling

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically on push

3. **Set up database**
   - Use Vercel Postgres or external PostgreSQL
   - Run migrations in production

### Environment Variables for Production

```env
DATABASE_URL=your-production-database-url
BETTER_AUTH_SECRET=your-production-secret
BETTER_AUTH_URL=https://your-domain.vercel.app
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 🧪 Testing

The application includes comprehensive testing setup:

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Build for production
npm run build
```

## 📈 Performance Optimizations

- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: Bundle analyzer for optimization
- **Caching**: TanStack Query for intelligent caching
- **Database Indexing**: Optimized database queries

## 🔐 Security Features

- **Authentication**: Secure authentication with Better Auth
- **CSRF Protection**: Built-in CSRF protection
- **XSS Prevention**: Automatic XSS protection
- **Environment Variables**: Secure environment variable handling
- **Session Management**: Secure session handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Better Auth](https://better-auth.com/) for authentication
- [Radix UI](https://radix-ui.com/) for accessible primitives
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [LinkBird.ai](https://linkbird.ai/) for design inspiration

## 📞 Support

For support, email support@yourapp.com or join our Slack channel.

---

**Built with ❤️ using Next.js 15 and modern web technologies**
