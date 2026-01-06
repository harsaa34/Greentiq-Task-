# Greentiq-Task-# CRM Dashboard Application

A modern CRM dashboard built with Next.js 14 and PostgreSQL for lead and sales management.

## Features
- Lead management with pagination
- Company details display
- Sales data tracking
- PostgreSQL database
- Responsive UI with Tailwind CSS

## Quick Start

```bash
# Clone repository
git clone https://github.com/harsaa34/Greentiq-Task-.git
cd Greentiq-Task-/dashboard-app

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your DATABASE_URL

# Start development server
npm run dev

Project Structure

dashboard-app/
├── src/app/
│   ├── api/              # API routes
│   ├── components/       # React components
│   ├── leads/           # Lead pages
│   └── page.tsx         # Home page
├── lib/                 # Database config
├── public/             # Static files
└── types/              # TypeScript types

Environment Variables

Create .env.local file:


DATABASE_URL=postgresql://username:password@localhost:5432/dbname


API Endpoints

GET /api/leads - Get all leads

GET /api/leads/[id] - Get single lead

GET /api/sales - Get sales data

POST /api/leads - Create new lead

POST /api/sales - Create new sale

