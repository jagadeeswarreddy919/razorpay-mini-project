# ResolveX

**Razorpay Buildathon 2026 — Track 2: AI Risk Manager**

> **Track. Investigate. Resolve.**
> 
> *ResolveX is an independent buildathon prototype demonstrating payment-resolution workflows. It is not an official Razorpay product.*

---

## 📌 Problem Statement

**PAYMENT FAILED / PENDING + BANK DEBITED = CUSTOMER UNCERTAINTY**

When a customer's bank account is debited but the merchant transaction fails or remains pending, customers experience anxiety, double deductions, or delayed access to urgent services (such as emergency medical care or essential deliveries).

---

## 🏗 Phase 3 Architecture: Customer Authentication & Payment Access

Phase 3 implements real customer authentication, session security, and the protected **Payment Resolution Center**:

### Primary Customer Journey:
```text
LANDING PAGE (/)
      ↓
TRACK MY PAYMENT
      ↓
PHONE NUMBER (+91 9876543210)
      ↓
SEND OTP
      ↓
OTP VERIFICATION (DEMO: 123456)
      ↓
CUSTOMER VERIFIED (Session Cookie)
      ↓
PAYMENT RESOLUTION CENTER (/customer)
      ↓
RECENT 10 TRANSACTIONS
      ↓
SELECT TRANSACTION
      ↓
TRANSACTION DETAILS (/customer/transactions/[id])
```

---

## 🔐 Auth & Security APIs

- `POST /api/auth/send-otp`: Accepts `{ phoneNumber }`, validates 10-digit Indian numbers, returns `{ success: true, demoMode: true }`.
- `POST /api/auth/verify-otp`: Accepts `{ phoneNumber, otp: "123456" }`, verifies DEMO OTP, sets `resolvex_session` HTTP cookie, and returns customer profile.
- `GET /api/auth/me`: Returns current authenticated customer session data or 401 Unauthorized.
- `POST /api/auth/logout`: Clears session cookie and logs out customer.

---

## 🔒 Session & Scoped Data Security

- `GET /api/payments/recent`: Reads `customerId` strictly from the authenticated server session cookie. Returns only the logged-in customer's 10 latest transactions sorted newest first.
- `GET /api/payments/[id]`: Verifies payment ownership (`payment.customerId === session.customerId`). Prevents unauthorized access or leaking payment existence across customers.

---

## 🧪 Demo Login Credentials

- **Customer Phone**: `9876543210` (Pre-seeded customer **Rahul Sharma**)
- **Demo Verification OTP**: `123456`
- **Flagship Transaction**: ₹10,000 Apollo Emergency Medicine (`FAILED`, `BANK DEBITED ✓`, `MERCHANT NOT CONFIRMED`, `ACK: RX-2026-001847`)

---

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Lucide Icons
- **Database**: SQLite (Zero-config local) / PostgreSQL
- **ORM**: Prisma ORM
- **Validation**: Zod
- **Session Auth**: Cookie-based HttpOnly Server Session

---

## 🚀 Commands

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Sync & Seed
```bash
npm run db:push
npm run db:seed
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Production Build
```bash
npm run build
```

---

## ⚠️ Buildathon Disclaimer

"ResolveX is an independent buildathon prototype and is not an official Razorpay product. Demo transactions and payment states are simulated."
