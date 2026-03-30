# Fayda Jobs Ethiopia

## Project info

**URL**: https://faydajobs.com

## About

Fayda Jobs Ethiopia is a modern job board platform connecting Ethiopian job seekers with employers across various sectors including NGO jobs, government positions, banking, IT, and more.

## Features

- **Job Listings**: Browse jobs by category, location, and type
- **Advanced Search**: Filter jobs by keywords, categories, and locations
- **Job Details**: View comprehensive job information and application details
- **Admin Dashboard**: Manage job postings and applications
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technologies Used

This project is built with:

- Next.js 15+ (App Router)
- TypeScript
- React 18
- Tailwind CSS
- shadcn/ui components
- Supabase (Backend & Database)
- React Query (Data Fetching)
- Framer Motion (Animations)

## Getting Started

### Prerequisites

- Node.js 18+ and npm installed
- Supabase account and project setup

### Installation

```bash
# Step 1: Clone the repository
git clone https://github.com/chombit/fayda-jobs-ethiopia.git

# Step 2: Navigate to the project directory
cd fayda-jobs-ethiopia

# Step 3: Install dependencies
npm install

# Step 4: Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Step 5: Run the development server
npm run dev
```

### Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
NEXT_PUBLIC_SUPABASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

### Environment Variables for Production

Add these environment variables in Vercel Dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` 
- `NEXT_PUBLIC_SUPABASE_PROJECT_ID`
- `NEXT_PUBLIC_SITE_URL`

## Database Setup

Run the SQL scripts in the `supabase/` directory:

1. `simple-setup.sql` - Basic tables and sample data
2. `admin-setup-clean.sql` - Admin functionality

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── jobs/              # Job-related pages
│   ├── admin/              # Admin dashboard
│   └── layout.tsx          # Root layout
├── src/
│   ├── components/         # React components
│   ├── lib/               # Utilities and helpers
│   └── hooks/             # Custom React hooks
├── supabase/              # Database scripts
└── public/                # Static assets
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For support or questions, please open an issue on GitHub.
