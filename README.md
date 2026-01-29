# ResQNow - Roadside Assistance Platform

## About This Project

ResQNow is a comprehensive roadside assistance platform that connects vehicle owners with nearby technicians for quick and reliable service.

## Getting Started

### Prerequisites

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd resqnow

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Features

- 24/7 Roadside Assistance
- Real-time Technician Matching
- Service Request Tracking
- User Authentication & Profiles
- Admin Dashboard for Technician Management
- Responsive Design

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **UI Components**: shadcn/ui
- **Backend**: Supabase (Authentication, Database, Real-time)
- **Routing**: React Router DOM

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── services/           # API service functions
├── contexts/           # React contexts
├── integrations/       # Third-party integrations
└── lib/               # Utility functions
```

## Environment & Backend Setup

### Frontend vs Edge Functions env

- **Project root `.env`** is for the **frontend (Vite)** only. It uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` (or `VITE_SUPABASE_ANON_KEY`). The Edge Functions **do not** read this file.
- **Edge Functions** run on Supabase’s servers. They get `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` from **Supabase** (auto-injected when deployed). Any extra secrets (e.g. `RESEND_API_KEY`) must be set in **Supabase Dashboard → Project Settings → Edge Functions → Secrets** (or via `supabase secrets set`). For local dev, see `supabase/.env.example`.

### Supabase Edge Functions

Technician registration and admin email notifications use Supabase Edge Functions. Set these in your Supabase project (Dashboard → Edge Functions → Secrets or project settings):

| Variable | Required | Description |
|----------|----------|-------------|
| `SUPABASE_URL` | Yes | Supabase project URL (set automatically when deployed) |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Used by `register-technician` and `get-technician-applications` (creates auth user + technician row; fetches list for admin) |
| `RESEND_API_KEY` | No | [Resend](https://resend.com) API key to send approval/rejection emails; if unset, emails are logged only |
| `EMAIL_FROM` | No | Sender address for emails (e.g. `ResQNow <onboarding@yourdomain.com>`); defaults to Resend onboarding address |

**Edge Functions used in the technician flow:** `register-technician`, `get-technician-applications`, `send-technician-email`. Deploy all three so registration, admin applications list, and approval/rejection emails work.

### Admin Access to Applications

The Admin Applications page (`/admin/applications`) fetches technicians via the **get-technician-applications** Edge Function (service role), so the list is not blocked by RLS. You must still be logged in as an **admin** for the function to return data:

1. Log in to the app as a user that exists in `auth.users`.
2. Ensure that user has the **admin** role: insert a row into `public.user_roles` with `user_id = <your auth user id>` and `role = 'admin'`.

Example (run in Supabase SQL editor after creating an admin user):

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('<auth-users-uuid>', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

Without this, the technicians list will be empty for non-technician admins because RLS only allows admins (or the technician themselves) to select technician rows.

## Development

To start the development server:

```sh
npm run dev
```

The application will be available at `http://localhost:8080`

## Building for Production

```sh
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
