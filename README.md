# Thinkmoda Course Builder

A comprehensive online course management platform built with Next.js and Supabase.

## Features

- **User Authentication**: Secure user registration and login
- **Course Management**: Create and organize courses with sections and lessons
- **Progress Tracking**: Track user progress through courses
- **Admin Dashboard**: Manage users, courses, and content
- **Responsive Design**: Modern UI with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Backend**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Authentication**: Custom auth with bcrypt
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ThinkModa/ThinkMODA_Labs.git
cd ThinkMODA_Labs
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses the following main tables:
- `users` - User accounts with authentication
- `courses` - Course information and content
- `sections` - Course sections organization
- `lessons` - Individual lesson content
- `user_courses` - User course assignments
- `user_progress` - User learning progress tracking

## Deployment

This project is configured for deployment on Vercel with automatic deployments from the main branch.

### Environment Variables (Production)

Make sure to set the following environment variables in your Vercel project:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## User Creation

Users can be created through the signup form on the landing page. The system supports:
- Basic user registration with email/password
- Admin user management
- Role-based access control (ADMIN/BASIC)

## Usage

### For Students
1. Sign up with email and password
2. Access assigned courses
3. Progress through lessons and sections
4. Track learning progress

### For Administrators  
1. Sign in with admin credentials
2. Access admin dashboard
3. Manage users and course assignments
4. Create and organize course content

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

© 2025 ThinkMODA. All rights reserved.

---

*Last updated: January 2025 - Environment configuration and user creation system deployed*                      # Manual deployment trigger - Wed Aug  6 11:46:57 CDT 2025
# Pro deployment test - Wed Aug  6 11:57:11 CDT 2025
# Deployment test
