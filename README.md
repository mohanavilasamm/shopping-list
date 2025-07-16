# ShopEase: A Modern Shopping List Application

This is a full-stack shopping list application built with a modern web development stack. It serves as a demonstration of key development patterns, including:

- Full-stack development with Next.js
- Secure user authentication (email/password and social providers)
- Type-safe database access with a modern ORM
- Integration with a third-party API (Kroger) using a secure proxy

## Features

- **User Accounts:** Secure sign-up and login with email/password, Google, and GitHub.
- **Store Management:** Organize your shopping lists by store.
- **Product Search:** Search for products using the Kroger API.
- **List Management:** Add, remove, and update items on your shopping lists.
- **Modern UI:** A clean, responsive interface with light and dark modes.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** [Drizzle ORM](https://orm.drizzle.team/) with [SQLite](https://www.sqlite.org/index.html)
- **Authentication:** [better-auth](https://www.npmjs.com/package/better-auth)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with [Radix UI](https://www.radix-ui.com/)
- **Deployment:** [Vercel](https://vercel.com/)

## Getting Started

To run this project locally, you'll need to set up the following environment variables.

### 1. Clone the repository

```bash
git clone https://github.com/mohanavilasamm/shopping-list.git
cd shopping-list
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root of the project and add the following variables.

```sh
# Authentication (better-auth)
# For local development, this should be http://localhost:3000
# For production, this must be your public deployed URL (e.g., https://shopease.dev)
AUTH_ORIGIN="http://localhost:3000"

# Social Providers (Optional)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."

# Kroger API
API_BASE_URL="https://api.kroger.com"
API_TOKEN_URL="https://api.kroger.com/v1/connect/oauth2/token"
API_CLIENT_ID="..."
API_CLIENT_SECRET="..."
# Example scope: "product.compact"
API_SCOPE="..."
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
