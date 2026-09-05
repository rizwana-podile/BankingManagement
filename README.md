# ðŸ›ï¸ Aura Apex Bank (AAB) â€” Enterprise Full-Stack Banking Management System

[![Node.js](https://img.shields.io/badge/Node.js-v26+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%20ODM-47A248?logo=mongodb&logoColor=white)](https://mongodb.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT%20%2B%20bcrypt-000000?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Status](https://img.shields.io/badge/Status-Production%20Grade-success)]()

An enterprise-grade, full-stack digital banking management platform inspired by the functionality and usability of major schedule commercial banks, engineered with completely original branding, modern UI/UX design, atomic database operations, real-time notification pipelines, and three dedicated role-based dashboards (**Customer**, **Bank Staff**, and **Administrator**).

---

## ðŸŒ Live URLs & Access

| Service | URL | Description |
| :--- | :--- | :--- |
| **Frontend Web Application** | [http://localhost:5175](http://localhost:5175) | Vite + React 18 Single-Page App |
| **Backend REST API Server** | [http://localhost:5000](http://localhost:5000) | Express.js Core Banking API Engine |
| **API Health Status** | [http://localhost:5000/api/health](http://localhost:5000/api/health) | Real-time System Heartbeat |
| **Demo Credentials Endpoint** | [http://localhost:5000/api/demo-users](http://localhost:5000/api/demo-users) | Pre-configured evaluation users |

---

## ðŸ”‘ Demo Credentials (1-Click Login Available in UI)

The login screen features an interactive **1-Click Quick Login** card that pre-fills and signs into any of the following accounts:

| Role | Name | Email | Password | Primary Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Customer (Primary)** | Rahul Sharma | `rahul.sharma@example.com` | `Customer@123` | Savings + Salary A/Cs, â‚¹1,20,000+ Balance, Debit/Credit Cards, Active Loans, FDs, Transfer history |
| **Customer (Secondary)** | Priya Patel | `priya.patel@example.com` | `Customer@123` | Target recipient for testing real-time inter-customer money transfers |
| **Bank Staff / Employee** | Rajesh Kumar | `rajesh.kumar@auraapex.com` | `Staff@123` | KYC approval queue, loan underwriting & fund disbursement, account freezing, AML fraud monitoring |
| **System Administrator** | Vikramaditya Singhania | `admin@auraapex.com` | `Admin@123` | Bank-wide financial analytics, User IAM CRUD, branch network, system broadcast alerts, audit logs |

---

## ðŸš€ Key Architectural Features

### 1. Three Separate Operational Dashboards

#### ðŸ‘¤ Dashboard 1: Customer / Retail User
* **Financial Command Center**: Real-time aggregated balance ticker across all linked accounts, Quick Actions, recent transactions list, and cash-flow breakdown.
* **Accounts Portfolio**: Dedicated savings, current, and corporate salary accounts with copyable 12-digit account numbers, branch IFSC (`AURA0001001`), ledger balance, and downloadable transaction statements.
* **Atomic Money Transfer**:
  * Multi-rail electronic transfers: **IMPS (Instant 24x7)**, **NEFT (RBI Batches)**, **RTGS (High-Value â‰¥ â‚¹2 Lakh)**, and **UPI Remit (Virtual Payment Address)**.
  * Real-time validation checks: Insufficient balance protection, account match verification, 11-character IFSC format checks.
  * Atomic double-entry database execution: Sender deducted, receiver credited, dual ledger transaction records written.
  * 2-Step Confirmation Modal with 4-digit Security PIN simulation.
  * Instant printable and downloadable official bank transaction receipts with cryptographic reference numbers.
* **Beneficiary Directory**: Saved recipient management with instant validation and fast-transfer shortcuts.
* **Card Management**: 3D-styled interactive virtual RuPay Platinum & Visa Signature cards with flip animation, mask/unmask security toggle, daily ATM limit slider, ATM/Online transaction switches, PIN change modal, one-click block/unblock, and new card issuance.
* **Credit & Loan Facilities**: Home Loan, Personal Loan, Vehicle Loan tracking; live repayment schedules with one-click EMI auto-deduction; and a Loan Application Modal featuring a **Dynamic Live EMI Calculator**.
* **Term & Fixed Deposits (FD)**: Compounding returns up to 7.6% p.a. with quarterly compounding; live maturity value estimator; active FD management; and premature liquidation simulation with interest deduction warnings.
* **Utility Bill Payments (BBPS)**: Utility clearing for Electricity, Water, Mobile Recharge, Broadband, DTH Satellite, Insurance Premiums, and Credit Card bills with instant receipt generation.
* **Profile & Security Center**: Personal demographics, government verified KYC status (PAN & Aadhaar), communication preference toggles, password rotation, 2FA toggle simulation, and remote session termination.

#### ðŸ‘” Dashboard 2: Bank Employee / Branch Staff
* **Operations Overview**: Branch liquidity indicators: Total Customers, Active Accounts, Total Deposits, Withdrawals, Pending KYC queue, Pending Loans, and Today's Cleared Volume.
* **Customer Directory**: Searchable directory by customer name, customer ID, mobile, email, or status. Inspect full customer dossiers, linked accounts, and freeze/lock accounts.
* **Account Operations**: Sanction and open new Savings, Current, or Salary accounts for customers with custom initial balances; toggle administrative account freezes with reason logging.
* **KYC Verification Queue**: Review submitted identity proofs (Aadhaar, PAN, Address proofs); approve or reject customer KYC with reviewer notes, automatically triggering customer notification alerts.
* **Loan Credit Appraisal Desk**: Underwrite retail loan applications; inspect applicant income and simulated CIBIL score (720-800+); approve loan terms or reject with remarks; **disburse sanctioned funds directly into customer accounts** in real time.
* **Real-Time Transaction Monitoring**: Live transaction feed with filters for High-Value (â‰¥ â‚¹1,00,000), Suspicious AML patterns, and Failed transactions; toggle AML compliance flags with reason notes.

#### ðŸ‘‘ Dashboard 3: System Administrator
* **Executive Bank Analytics**: Comprehensive bank-wide metrics visualized using Recharts:
  * Monthly Transaction Volume (Area chart with gradient fill)
  * Deposits vs Withdrawals Balance (Bar chart)
  * Customer Base Expansion Growth Trend (Line chart)
  * Payment Rails Channel Share (Donut chart for UPI, IMPS, NEFT, RTGS)
* **Identity & Access Management (IAM)**: Create, edit, disable, enable, and reset passwords for any customer, employee, manager, or admin user.
* **Branch Network Configuration**: Manage physical branch locations across India (Mumbai, New Delhi, Bengaluru), assign unique IFSC codes, branch codes, managers, and contact details.
* **System Broadcast Dispatcher**: Publish urgent system-wide or targeted notification banners (All Users, Customers Only, Employees Only) for maintenance windows, policy updates, or fraud warnings.
* **Immutable Security Audit Trail**: Chronological, searchable audit trail recording all critical banking events (`LOGIN`, `TRANSFER`, `KYC_APPROVE`, `REVIEW_LOAN`, `DISBURSE_LOAN`, `ACCOUNT_FREEZE`, `CREATE_USER`) with timestamps, actor IDs, and IP addresses.
* **Audited Financial Statements**: Printable and downloadable consolidated balance sheet and daily clearing reports.

---

### 2. Dual-Engine MongoDB Architecture (100% Zero-Config Execution)

The backend connects automatically using a robust dual-mode connection strategy in `backend/config/db.js`:
1. If `MONGODB_URI` is specified and a local/cloud MongoDB daemon is running, it connects directly.
2. If no MongoDB service is running, it **automatically launches an in-memory MongoDB server via `mongodb-memory-server`** directly within Node.js.
3. Automatically seeds the database on initial startup with **10+ realistic Indian customer profiles, branches, accounts, transactions, cards, loans, and audit logs**.

---

## ðŸ› ï¸ Technology Stack

```
Frontend:
â”œâ”€â”€ React 18.3 (Single-Page Application)
â”œâ”€â”€ Vite 5.4 (Build tool & HMR dev server)
â”œâ”€â”€ Tailwind CSS 3.4 (Modern dark enterprise banking theme)
â”œâ”€â”€ Lucide React (Financial & operational icon system)
â”œâ”€â”€ Recharts 2.12 (Interactive SVG charts & analytics)
â”œâ”€â”€ Axios 1.7 (HTTP client with JWT interceptors)
â””â”€â”€ React Router v6.26 (Client-side routing with Role Guards)

Backend:
â”œâ”€â”€ Node.js 26+
â”œâ”€â”€ Express.js 4.21 (REST API routing & middleware)
â”œâ”€â”€ Mongoose 8.6 (Object Data Modeling)
â”œâ”€â”€ mongodb-memory-server (Zero-configuration in-memory database)
â”œâ”€â”€ JSON Web Tokens (JWT authentication)
â”œâ”€â”€ bcryptjs (Salted password hashing)
â”œâ”€â”€ CORS & Morgan (Security and request logging)
â””â”€â”€ Custom Audit Logging Engine
```

---

## ðŸ“‚ Project Structure

```
apex-banking-system/
â”œâ”€â”€ backend/
â”‚   â”œâ”€â”€ config/
â”‚   â”‚   â””â”€â”€ db.js                 # Smart MongoDB connection + fallback
â”‚   â”œâ”€â”€ controllers/
â”‚   â”‚   â”œâ”€â”€ authController.js     # Auth, profile, password, 2FA
â”‚   â”‚   â”œâ”€â”€ accountController.js  # Accounts, statements, ledgers
â”‚   â”‚   â”œâ”€â”€ transferController.js # Atomic transfers & receipts
â”‚   â”‚   â”œâ”€â”€ beneficiaryController.js
â”‚   â”‚   â”œâ”€â”€ cardController.js     # Virtual cards & PIN management
â”‚   â”‚   â”œâ”€â”€ loanController.js     # Applications & EMI repayments
â”‚   â”‚   â”œâ”€â”€ fdController.js       # Fixed deposit creation & maturity
â”‚   â”‚   â”œâ”€â”€ billController.js     # BBPS utility payments
â”‚   â”‚   â”œâ”€â”€ notificationController.js # Notification inbox & mark read
â”‚   â”‚   â”œâ”€â”€ staffController.js    # KYC, customer locks, disbursement
â”‚   â”‚   â””â”€â”€ adminController.js    # IAM, branches, analytics, reports
â”‚   â”œâ”€â”€ middleware/
â”‚   â”‚   â”œâ”€â”€ auth.js               # JWT verification & RBAC
â”‚   â”‚   â”œâ”€â”€ auditLogger.js        # Audit logging helper
â”‚   â”‚   â””â”€â”€ errorHandler.js       # Central error handling
â”‚   â”œâ”€â”€ models/                   # 13 Mongoose Schemas
â”‚   â”œâ”€â”€ routes/                   # Modular Express routes
â”‚   â”œâ”€â”€ seed/
â”‚   â”‚   â””â”€â”€ seedData.js           # Realistic 10+ customer dataset
â”‚   â”œâ”€â”€ server.js                 # Server bootstrap & seeding
â”‚   â”œâ”€â”€ package.json
â”‚   â””â”€â”€ .env.example
â”œâ”€â”€ frontend/
â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”‚   â”œâ”€â”€ common/           # Navbar, Sidebar, Footer, ReceiptModal, StatCard, Toast
â”‚   â”‚   â”œâ”€â”€ context/
â”‚   â”‚   â”‚   â”œâ”€â”€ AuthContext.jsx   # State, user tokens, active account
â”‚   â”‚   â”‚   â””â”€â”€ NotificationContext.jsx # Live notification polling
â”‚   â”‚   â”œâ”€â”€ pages/
â”‚   â”‚   â”‚   â”œâ”€â”€ public/           # Landing, About, Services, Contact, Login, Register
â”‚   â”‚   â”‚   â”œâ”€â”€ customer/         # Overview, Accounts, Transfer, Cards, Loans, FDs, Bills...
â”‚   â”‚   â”‚   â”œâ”€â”€ staff/            # StaffOverview, Customers, Accounts, KYC, Loans, Txns
â”‚   â”‚   â”‚   â””â”€â”€ admin/            # AdminOverview, Users, Branches, Broadcast, Audit, Reports
â”‚   â”‚   â”œâ”€â”€ services/
â”‚   â”‚   â”‚   â””â”€â”€ api.js            # Axios client with JWT interceptor
â”‚   â”‚   â”œâ”€â”€ App.jsx               # Routes & ProtectedRoute guards
â”‚   â”‚   â””â”€â”€ index.css             # Tailwind + Print Receipt CSS
â”‚   â”œâ”€â”€ package.json
â”‚   â””â”€â”€ vite.config.js
â”œâ”€â”€ test-e2e-banking.js           # Automated end-to-end test suite
â””â”€â”€ README.md
```

---

## âš¡ Installation & Running Locally

### Step 1: Clone or Navigate to Project
```bash
cd apex-banking-system
```

### Step 2: Start Backend Server
```bash
cd backend
npm install
node server.js
```
*Backend runs at `http://localhost:5000`*.

### Step 3: Start Frontend Client
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs at `http://localhost:5175`*.

### Step 4: Run Automated Verification Suite
To execute the complete end-to-end verification script:
```bash
node test-e2e-banking.js
```

---

## ðŸ›¡ï¸ Security Implementation

1. **Password Protection**: Passwords are never stored in plaintext. They are salted and hashed using `bcryptjs` with 10 salt rounds.
2. **Stateless JWT Authorization**: API requests are verified using JWT tokens passed in the `Authorization: Bearer <token>` header with a 30-day expiration window.
3. **Role-Based Access Control (RBAC)**: Enforced both at the Express route level (`authorize('customer', 'employee', 'admin')`) and React router level (`<ProtectedRoute allowedRoles={[...]}>`). Customers cannot access `/staff` or `/admin` routes.
4. **Account Lockout Policy**: Simulates automatic account locking after 5 consecutive failed login attempts.
5. **Printable Cryptographic Receipts**: Every financial transaction generates an official receipt containing a unique transaction ID, reference number, timestamp, sender/receiver details, and status badge with print and download options.
6. **Immutable Audit Trail**: Key banking operations write directly to the `AuditLog` collection, recording the actor, action type, IP address, target entity, and timestamp.

---

## ðŸ“œ License
Developed as a production-grade portfolio enterprise Banking Management System. All branding and names ("Aura Apex Bank") are completely original.
