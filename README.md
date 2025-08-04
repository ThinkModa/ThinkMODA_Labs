# Thinkmoda Course Builder

A modern, responsive desktop application for course management built with Next.js, React, and Supabase.

## Features

- **Dual User System**: Admin and basic user roles with different access levels
- **Course Management**: Create, edit, and manage courses with modular content
- **Dynamic Content**: Support for videos, embedded content, and rich text
- **Progress Tracking**: Monitor user progress and course completion
- **Modern UI**: Clean, minimalist design with proper icons
- **Database Integration**: Prisma ORM with SQLite for local development
- **RESTful API**: Full CRUD operations for courses, sections, and lessons
- **Real-time Updates**: Live synchronization between admin and user interfaces

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: Prisma ORM with SQLite (local) / Supabase (production)
- **Authentication**: Supabase Auth (planned)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd thinkmoda-course-builder
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npx prisma db push
npx prisma generate
```

4. (Optional) Set up environment variables for production:
```bash
cp .env.example .env.local
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Sign-in page
├── components/            # Reusable components
├── lib/                   # Utility functions
├── types/                 # TypeScript type definitions
└── public/               # Static assets
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Database Schema

The application uses Prisma with the following models:

### Core Models
- `User` - User accounts with roles (ADMIN/BASIC)
- `Course` - Course information and metadata
- `Section` - Course sections/categories
- `Lesson` - Individual lessons with modular content
- `UserCourse` - Many-to-many relationship for course assignments

### Relationships
- **Course → Section**: One-to-many
- **Section → Lesson**: One-to-many  
- **User ↔ Course**: Many-to-many (via UserCourse)

### Content Storage
Lessons store content as strings with special formatting:
- `/embed URL` - Embedded content (videos, forms, images)
- `**text**` - Bold text
- `*text*` - Italic text
- `__text__` - Underlined text
- `# text` - Large headings

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

© 2025 Thinkmoda. All rights reserved.                      