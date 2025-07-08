# Gambarie Summer Events

A modern React application for managing events and activities in Gambarie, featuring multilingual support, admin functionality, and a clean, responsive design.

## Features

- 🌍 **Multilingual Support**: English and Italian translations
- 📅 **Event Management**: Create, edit, and display events with filtering capabilities
- 🎯 **Activity Tracking**: Manage various activities and their details
- 👨‍💼 **Admin Panel**: Complete admin interface for content management
- 🔐 **Authentication**: Secure user authentication with Supabase
- 📱 **Responsive Design**: Mobile-first design with Tailwind CSS
- 🛡️ **Security**: Built-in CAPTCHA protection with Cloudflare Turnstile
- 🎨 **Modern UI**: Clean interface using shadcn/ui components

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **Internationalization**: i18next
- **Security**: Cloudflare Turnstile

## Prerequisites

Before running this application, make sure you have:

- Node.js 18+ installed
- npm or yarn package manager
- A Supabase account and project
- (Optional) Cloudflare Turnstile site key for CAPTCHA
- (Optional) Umami Analytics for website tracking

## Installation

1. Clone the repository:
```bash
git clone https://github.com/pennaFedele/gambarie-summer-events.git
cd gambarie-summer-events
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Edit the `.env` file with your actual values:
```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_TURNSTILE_SITE_KEY=your_turnstile_site_key_here
VITE_CAPTCHA_ENABLED=true
VITE_UMAMI_SCRIPT_URL=https://your-umami-instance.com/script.js
VITE_UMAMI_WEBSITE_ID=your-website-id
```

5. Set up your Supabase database by running the SQL migrations in the `supabase/migrations/` folder.

6. (Optional) Configure Umami Analytics by updating the script tag in `index.html` with your analytics configuration.

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build

Create a production build:
```bash
npm run build
```

## Database Setup

This application uses Supabase as its backend. The database schema includes:

- **events**: Event management
- **activities**: Activity tracking
- **long_events**: Extended event information
- **app_settings**: Application configuration

Run the migration files in the `supabase/migrations/` directory to set up your database schema.

## Analytics (Optional)

This project includes optional Umami Analytics support for website tracking. The analytics are loaded dynamically based on environment variables.

To enable analytics:

1. Set up your own Umami instance or use a hosted service
2. Add your Umami configuration to your `.env` file:
   ```env
   VITE_UMAMI_SCRIPT_URL=https://your-umami-instance.com/script.js
   VITE_UMAMI_WEBSITE_ID=your-website-id
   ```
3. The analytics will be automatically initialized when the app loads

**Features**:
- Only loads if both `VITE_UMAMI_SCRIPT_URL` and `VITE_UMAMI_WEBSITE_ID` are configured
- Gracefully handles missing configuration without errors
- Dynamically injects the Umami script into the page head

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/pennaFedele/gambarie-summer-events/issues) on GitHub.
