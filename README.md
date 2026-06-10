# ShieldxSSL

Professional SSL certificate reseller platform for RapidSSL-style products with a public marketing website, customer portal, admin portal, support tickets, email templates, and manual PayPal payment instructions.

## What Is Included

- Public SSL reseller website with homepage, comparison table, product pages, testimonials, FAQ, and responsive SaaS-style design.
- Customer registration, login/logout, password reset request logging, profile management, product browsing, order history, CSR/domain submission, SAN management, validation method selection, reissue requests, certificate download, and support tickets.
- Admin dashboard with total orders, active certificates, pending orders, expiring certificates, revenue statistics, new customers, and recent activity.
- Admin management for customers, SSL orders, payment status, issuance status, certificate uploads, product pricing/features, ticket replies/closing, and editable email templates.
- Prisma SQLite schema covering users, products, orders, certificates, tickets, replies, email templates, and activity logs.
- Seeded plans:
  - Single Domain SSL: $30/year
  - Multi-Domain SSL: $50/year, first 3 hostnames included, additional SANs $15/year each
  - Wildcard SSL: $125/year

## Manual Payment Flow

No payment gateway is integrated. New customer and admin-created orders are always created with `Pending Payment` status. Customers see PayPal instructions and send payment outside the website. Admins manually mark payment as received and update SSL issuance statuses.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create environment file:

   ```bash
   cp .env.example .env
   ```

3. Update `.env`:

   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="use-a-long-random-secret"
   PAYPAL_PAYMENT_EMAIL="your-paypal-email@example.com"
   ```

4. Create the database and seed demo data:

   ```bash
   npx prisma migrate dev --name init
   npm run prisma:seed
   ```

5. Start the app:

   ```bash
   npm run dev
   ```

6. Open `http://localhost:3000`.

## Demo Accounts

Change or remove these accounts before production use.

## Production Notes

- Set a strong `JWT_SECRET`.
- Configure SMTP variables to send real emails. Without SMTP, email sends are recorded to activity logs.
- Use HTTPS in production.
- Replace demo contact and PayPal details.
- Review certificate upload and file attachment storage for your hosting environment.
