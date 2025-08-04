# ThinkMODA Course Builder

A modern course building platform built with Next.js 14, TypeScript, and Supabase.

## Features

- **User Authentication**: Sign up/sign in with email and password
- **Role-Based Access**: Admin and Basic user roles
- **Course Management**: Create, edit, and delete courses with sections and lessons
- **Rich Content Editor**: Notion-style editor with formatting and embed support
- **Progress Tracking**: Track user progress through lessons
- **Course Visibility**: Open and private course settings
- **Real-time Updates**: Live updates between admin and user interfaces
- **Responsive Design**: Modern UI with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Lucide React icons
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Custom auth with Supabase
- **Deployment**: Ready for Vercel deployment

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ThinkMODA_Labs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Set up Supabase database**
   - Create a new Supabase project
   - Run the SQL migration in `supabase/migrations/001_initial_schema.sql`
   - Or use the Supabase CLI to apply migrations

5. **Start the development server**
   ```bash
   npm run dev
   ```
   
   Or use the custom script for consistent port:
   ```bash
   ./start-dev.sh
   ```

6. **Access the application**
   - Open [http://localhost:3000](http://localhost:3000)
   - Sign up as a new user or use existing credentials

## Supabase Migration

### From Prisma/SQLite to Supabase

If you're migrating from the previous Prisma/SQLite setup:

1. **Set up Supabase project**
   - Create a new project at [supabase.com](https://supabase.com)
   - Get your project URL and API keys

2. **Apply database schema**
   - Copy the SQL from `supabase/migrations/001_initial_schema.sql`
   - Run it in your Supabase SQL editor

3. **Set environment variables**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Migrate existing data**
   ```bash
   node scripts/migrate-to-supabase.js
   ```

5. **Update imports in your code**
   - Replace `lib/services/auth.ts` with `lib/services/auth-supabase.ts`
   - Replace `lib/services/courses.ts` with `lib/services/courses-supabase.ts`
   - Replace `lib/services/progress.ts` with `lib/services/progress-supabase.ts`

## Database Schema

### Tables

- **users**: User accounts with authentication
- **courses**: Course information and settings
- **sections**: Course sections containing lessons
- **lessons**: Individual lesson content
- **user_courses**: Many-to-many relationship between users and courses
- **user_progress**: User progress tracking for lessons

### Row Level Security (RLS)

The database includes comprehensive RLS policies:
- Users can only access their own data
- Admins can manage all content
- Course visibility controls access
- Progress tracking is user-specific

## API Routes

The application uses Supabase client for all database operations, eliminating the need for custom API routes.

## Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Set environment variables**
   - Add your Supabase credentials in Vercel dashboard
   - Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. **Connect custom domain**
   - Add your domain in Vercel project settings
   - Update DNS records as instructed

### Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (for migrations)

## Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `./start-dev.sh`: Start dev server on port 3000

### Database Management

- **Local Development**: Uses Supabase for all environments
- **Migrations**: SQL files in `supabase/migrations/`
- **Data Migration**: Use `scripts/migrate-to-supabase.js`

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes (legacy)
│   ├── user/              # User interface pages
│   └── globals.css        # Global styles
├── lib/                   # Utility libraries
│   ├── services/          # Service layer
│   ├── supabase.ts        # Supabase client
│   └── prisma.ts          # Prisma client (legacy)
├── scripts/               # Utility scripts
├── supabase/              # Supabase configuration
│   └── migrations/        # Database migrations
└── prisma/                # Prisma schema (legacy)
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

© 2025 Thinkmoda. All rights reserved.                      