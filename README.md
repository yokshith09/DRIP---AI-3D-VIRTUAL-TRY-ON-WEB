# DRIP — Premium Fast-Fashion E-Commerce with 3D AI Try-On

DRIP is a premium, contemporary fast-fashion e-commerce platform featuring an integrated **3D AI Fitting Room (Avatar Studio)** and a **Personalized Style DNA Scanner**. The application couples high-fidelity streetwear aesthetic collections with machine-learning-driven digital draping simulations to solve sizing uncertainty and return friction in online shopping.

---

## 🛠 Technology Stack

### Core Frameworks & Libraries
* **Frontend**: React 19, Next.js 16.1 (App Router, Turbopack, SSR/CSR rendering split)
* **Styling & Theme**: Tailwind CSS v4 (incorporating CSS-variable custom color mappings), Lucide Icons, dynamic `@import` Google Font families
* **State Management**: Zustand with persistent client-side middleware (`localStorage` syncing)
* **Image Compression**: `browser-image-compression` (safeguards selfie uploads by shrinking canvas memory footprints before transmission)

### Scraper & Engine Integration
* **Product Importer Scraper**: Node fetch pipeline parsing HTML metadata headers (`og:image`, `og:title`)
* **VTON (Virtual Try-On) Engine**: Backed by dynamic API bindings (`REPLICATE_API_TOKEN`, `HF_TOKEN`, `PIAPI_KEY`). Integrates a robust 4-second delay canvas simulation fallback to guarantee high-fidelity draping drapes even if API keys are missing.
* **Database**: Static local SQL-grade array profiles mapped in `src/data/products.ts`, synced client-side with Supabase auth metadata.

---

## 🔒 Authentication & Security Architecture (OWASP Compliant)

To protect user data and prevent malicious abuse (e.g., API credit draining), DRIP enforces a strict security perimeter:
* **Session Middleware**: Global Next.js middleware (`src/middleware.ts`) utilizing `@supabase/ssr` to securely parse HTTP-only cookies, intercepting unauthenticated traffic.
* **API Route Protection**: Backend routes (like `/api/try-on`) enforce server-side session validation. Requests without a valid login context are immediately rejected with `401 Unauthorized`.
* **Role-Based Access Control (RBAC)**: The `/admin` dashboard strictly requires the authenticated user email to be `admin@drip.com`. Unauthorized users are immediately kicked back to the homepage.
* **Rate-Limited Email/Password, OTP Auth & Recovery**: Resolves Supabase's free-tier OTP limits by supporting standard password registration alongside Magic Links (`src/app/login/page.tsx`), supplemented with UI-level artificial delays to thwart basic timing and brute-force attacks. Includes full password reset flow with redirect handling.
* **Generic Error Handling**: Auth flows intentionally return generic errors (e.g., "Invalid login credentials") to prevent malicious email enumeration.

---

## ⚡ Core Features & Folder Navigation

### 1. 3D Trial Studio (Avatar Studio)
* **Path**: [`src/app/avatar-studio/page.tsx`](src/app/avatar-studio/page.tsx)
* **Description**: The core fitting room sandbox. Supports:
  * Male (Alex) and Female (Sophia) base models.
  * Custom body photo upload (integrated with automatic client-side compression).
  * Wardrobe filters dynamically mapping database items.
  * Draping trigger states feeding garment coordinates to VTON API.

### 2. Custom Product URL Importer
* **API Path**: [`src/app/api/import-product/route.ts`](src/app/api/import-product/route.ts)
* **Studio Drawer Entry**: Wardrobe panel $\rightarrow$ `Custom Imports` tab $\rightarrow$ `Import URL` card.
* **Description**: Lets users scan and import garments from H&M, Zara, Nike, or any fashion retailer by pasting a product link. The scraper grabs details and places the custom dress in the user's try-on closet.

#### Scraper Security Architecture:
* **SSRF Mitigation**: Runs a DNS lookup on hostnames prior to fetching, blocking all local, private, loopback (`127.0.0.0/8`, `10.0.0.0/8`, `192.168.0.0/16`), and link-local (AWS metadata `169.254.169.254`) ranges.
* **Port Restrictions**: Intercepts requests pointing to custom ports, restricting traffic exclusively to standard `80` (HTTP) and `443` (HTTPS) ports.
* **Denial of Service Capping**: Verifies `Content-Length` headers, throwing an error for payloads $> 2\text{MB}$.
* **Timeout Enforcement**: Enforces a strict 5-second connection deadline using `AbortController` to prevent Slowloris attacks.
* **XSS Mitigation**: Sanitizes scraped names (stripping HTML tags) and validates that the scraped image URL matches a secure `http:`/`https:` protocol.

### 3. Style DNA Blueprint
* **Page Path**: [`src/app/profile/style-dna/page.tsx`](src/app/profile/style-dna/page.tsx)
* **Component Path**: [`src/components/StyleDNAOnboarding.tsx`](src/components/StyleDNAOnboarding.tsx)
* **Description**: A multi-step styling scanner wizard. Captures shoulder/hip dimensions via digital tailor calipers, scans skin undertones, style vibes (minimalist, streetwear, classic, bohemian), and budget bounds. Generates a blueprint card and filters the catalog for personalized matches using `src/lib/productMatcher.ts`.

### 4. Admin Curation Dashboard (CRUD)
* **Path**: [`src/app/admin/page.tsx`](src/app/admin/page.tsx)
* **Description**: A fully functional, interactive catalog management system restricted to administrators.
  * **Interactive Metrics**: Top-level stat blocks act as instant category filters for the data table.
  * **Dynamic Store State**: Leverages Zustand (`src/store/products.ts`) with `localStorage` persistence for client-side state manipulation.
  * **Edit/Delete Actions**: Inline catalog editing allows admins to update product names, prices, categories, and images, persisting changes globally.
  * **Users & Credits Management**: Features a dedicated view mapped to a secure backend `SUPABASE_SERVICE_ROLE_KEY` API route (`/api/admin/users`) to list all registered users, their join dates, and their VTON usage counts to monitor free-tier exhaustion.

### 5. Product Details Section
* **Path**: [`src/app/product/[id]/page.tsx`](src/app/product/[id]/page.tsx)
* **Description**: The e-commerce details page. Employs a scrolling-free design:
  * **Buy Column**: Contains price, brand, colors, sizes, AI styling advice, and checkout actions (fixed on screen).
  * **Image Column**: Capped height portrait views (`sticky top-28`).
  * **Grid Column (Below image)**: A 3-column grid containing Materials, Express Shipping details, and SEO FAQs.

---

## 🏗 System Architecture & Design

### Robust Image Pipeline (Universal Interceptor)
The virtual try-on models (PiAPI Kling and HuggingFace IDM-VTON) strictly require absolute, public URLs. When a user captures a selfie on their device, the browser outputs a Base64 string. 
To guarantee API compatibility without maintaining expensive stateful buckets:
1. **Interceptor**: `/api/try-on` intercepts incoming Base64 strings or local relative paths.
2. **Ephemeral Hosting**: The server autonomously uploads these images to an ephemeral public host (`uguu.se`) with strict timeout protections.
3. **URL Handoff**: The raw `.jpg/.png` URL is extracted and handed off to PiAPI/HF. This guarantees 100% processing success rate by bypassing native library Buffer/Blob corruption bugs.

### Credit Limiting via Auth Metadata (Stateless)
To enforce the **2-free-try-ons per account** limit without maintaining complex relational tables, DRIP leverages **Supabase User Metadata**:
1. When inference initiates, the backend extracts `user.user_metadata.tryons_used` (defaulting to 0).
2. If `tryons_used >= 2` (and the user is not `admin@drip.com`), the API blocks the request and throws a `403 Forbidden`.
3. Upon a successful VTON inference, the backend utilizes the `SUPABASE_SERVICE_ROLE_KEY` to securely increment the metadata counter.

---

## 🎨 Branding System & Color Palette
The app uses a premium editorial design system defined in `src/app/globals.css`:
* **Maroon (`--color-drip-maroon`)**: `#7A0C16` (deep burgundy luxury accent)
* **Cream (`--color-drip-cream`)**: `#FAF4EE` (warm text background contrast)
* **Navy (`--color-drip-navy`)**: `#1A1A2E` (midnight background)
* **Coral (`--color-drip-coral`)**: `#E94560` (vibrant CTA highlight)
* **Green (`--color-drip-green`)**: `#1DB954` (AI Match approval badge)

---

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Create a `.env` or `.env.local` containing:
   ```env
   # Supabase Authentication & Database
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Groq AI Stylist Chatbot (Default model: llama-3.3-70b-versatile)
   GROQ_API_KEY=your_groq_api_key
   GROQ_MODEL=llama-3.3-70b-versatile

   # Razorpay Payment Gateway (Test or Live)
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id

   # Virtual Try-On API Keys (Optional; falls back to canvas VTON simulation if empty)
   HF_TOKEN=your_huggingface_token
   PIAPI_KEY=your_piapi_kling_key
   REPLICATE_API_TOKEN=your_replicate_token
   ```

3. **Initialize Database Tables (Optional for cloud sync)**:
   Run the queries in [`supabase_schema.sql`](supabase_schema.sql) in your Supabase SQL Editor to establish `carts`, `style_dna`, and RLS security policies.

4. **Start the local server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🚢 CI/CD & Vercel Auto-Deployment

This repository includes an automated GitHub Actions pipeline ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)) and Vercel configuration ([`vercel.json`](vercel.json)) for continuous integration and zero-downtime deployment.

### Continuous Integration (CI)
On every Pull Request and push to `main`:
1. Checks out repository and configures Node.js 20 with npm caching.
2. Runs TypeScript type checking (`npx tsc --noEmit`).
3. Executes a production build dry-run (`npm run build`).

### Continuous Deployment (CD)
- **Preview Deployments**: Automated on pull requests.
- **Production Auto-Deploy**: Automatically triggers on pushes to branch `main`.

### Setting Up Vercel Secrets on GitHub:
In your GitHub repository, navigate to **Settings** $\rightarrow$ **Secrets and variables** $\rightarrow$ **Actions** and add:

| Secret Name | Description | Where to Find It |
| :--- | :--- | :--- |
| `VERCEL_TOKEN` | Vercel Personal Access Token | [vercel.com/account/tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | Vercel Account / Team ID | Found in `.vercel/project.json` after running `vercel link` |
| `VERCEL_PROJECT_ID` | Vercel Project ID | Found in Vercel Project Settings $\rightarrow$ General |
| `NEXT_PUBLIC_SUPABASE_URL` | Production Supabase URL | Supabase Dashboard $\rightarrow$ Project Settings $\rightarrow$ API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production Supabase Anon Key | Supabase Dashboard $\rightarrow$ Project Settings $\rightarrow$ API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Key | Supabase Dashboard $\rightarrow$ Project Settings $\rightarrow$ API |
| `GOOGLE_AI_KEY` | Google Gemini API Key | Google AI Studio $\rightarrow$ Get API Key |
| `GROQ_API_KEY` | Groq API Key | Groq Console $\rightarrow$ API Keys |
