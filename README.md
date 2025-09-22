# SCI-FOOD-HIGH

Vue 3 + Vite + TypeScript app with Firebase for auth and Firestore. Tailwind CSS for styling per SCI-FOOD-HIGH palette.

## Setup

1) Copy `.env.example` to `.env` and fill Firebase config.

```bash
cp .env.example .env
```

2) Create Firebase project with Email/Password auth enabled. Add a web app and copy credentials into `.env`.

3) Install dependencies and run:

```bash
npm install
npm run dev
```

### Collections

- `menu`: { name: string, price: number }
- `orders`: { userId: string, slot: 'AM Recess'|'Lunch'|'PM Recess', items: {id,name,quantity}[], status: 'pending'|'confirmed'|'completed', claimCode: string, createdAt: number }

### Auth

- Demo login maps identifier to email: `<identifier>@scifood.local` with password.
  - Students use Learner Reference Number as identifier.
  - Staff use Name as identifier.
  - Create users in Firebase Auth with matching emails to test.
