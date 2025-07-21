# TowBuddy - Roadside Assistance Platform

## About This Project

TowBuddy is a comprehensive roadside assistance platform that connects vehicle owners with nearby technicians for quick and reliable service.

## Getting Started

### Prerequisites

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd towbuddy

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
