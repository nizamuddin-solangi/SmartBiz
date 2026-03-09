# SmartBiz — All-in-One Business Management & Service Marketplace

SmartBiz is a production-grade SaaS platform where businesses can manage their operations and customers can discover and book services. This project demonstrates high-level software engineering standards with a modern tech stack.

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18+)
- **npm** (v9+)

### 1. Backend Setup
```bash
cd backend
npm install
# Setup database schema (Uses SQLite for easy local setup)
npx prisma migrate dev --name init
# Start development server
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), TypeScript, TailwindCSS, ShadCN UI, Framer Motion.
- **Backend**: Node.js, Express.js, TypeScript.
- **ORM**: Prisma.
- **Database**: PostgreSQL (Dockerized).
- **State Management**: Zustand.

## ✨ Key Features

- **Multi-Role Access**: Dedicated dashboards for Customers, Business Owners, and Admins.
- **Business Management**: Tools for owners to manage services and bookings.
- **Service Discovery**: Real-time search and filtering for customers.
- **Premium UI**: Modern design with responsive layouts and smooth animations.

## 🏗️ Project Structure
- `/backend`: Express API with Prisma ORM.
- `/frontend`: Vite-based React application.
- `docker-compose.yml`: Database orchestration.

## 🔐 Credentials (Demo)
*Note: You can register your own accounts, or use seeding (if implemented).*

---
Made with ❤️ by the SmartBiz Engineering Team.
