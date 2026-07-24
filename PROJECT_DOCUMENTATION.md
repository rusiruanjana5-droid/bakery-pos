# Bakery POS System - Project Documentation

## 1. 🎯 PROJECT OVERVIEW
- **Project Name:** Bakery POS (Point of Sale) System
- **Description:** A comprehensive bakery management system that handles product inventory, supplier management, goods received notes (GRN), POS billing, special offers, and user administration. The system features dynamic category/sub-category management for products, suppliers, and GRN tracking, with role-based access control for administrators and cashiers.

## 2. 🛠 TECH STACK & ARCHITECTURE
- **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS, TypeScript
- **Backend:** Next.js Server Actions (Node.js), Prisma ORM
- **Database:** MySQL (via Prisma)
- **Authentication:** Iron-Session (cookie-based session management)
- **Deployment & Hosting:** Vercel (recommended), Docker compatible

## 3. 🔑 CORE FEATURES & FUNCTIONALITIES

### 1. Dynamic Category & Sub-Category Management
- **Description:** Full CRUD operations for main categories and sub-categories with parent-child relationships
- **Details:**
  - Admin-only access to create/edit/delete categories
  - Categories linked to Products, Suppliers, and GRN records
  - Dependent dropdown UI pattern (Main Category → Sub-category)
  - Safe deletion with SetNull to prevent data corruption
  - Active/Inactive toggle for categories
  - Real-time synchronization across all forms and filters

### 2. Product Management
- **Description:** Complete product inventory management with category assignment
- **Details:**
  - Add/Edit/Delete products with dynamic category/sub-category selection
  - Track cost price, selling price, and current stock
  - Supplier assignment for each product
  - Category-based filtering in product table
  - Stock updates via GRN entries
  - Legacy category string retained for backward compatibility

### 3. Supplier Management
- **Description:** Supplier database with supply category tracking
- **Details:**
  - Add/Edit/Delete suppliers with contact information
  - Assign supply categories (what they supply)
  - Category-based filtering in supplier table
  - Track supplier products and GRN history
  - View supplier details with related transactions

### 4. Goods Received Note (GRN) System
- **Description:** Track inventory receipts with category tracking
- **Details:**
  - Create GRN entries for received goods
  - Track product, quantity, unit cost, and supplier
  - Category/sub-category assignment for GRN records
  - Automatic stock increment on GRN creation
  - Product filtering by category during GRN entry
  - Invoice-style item entry with multiple items per GRN

### 5. POS Billing Screen
- **Description:** Point of sale interface for cashier operations
- **Details:**
  - Dynamic category-based product filtering
  - Add products to cart with quantity selection
- Special offers integration
- Multiple payment methods support
- Customer information capture
- Receipt generation capability
- Real-time stock updates

### 6. Special Offers Management
- **Description:** Create and manage promotional product bundles
- **Details:**
  - Admin-only access to create special offers
  - Define promo price and included products
  - Mark items as free or paid in bundles
  - Active/Inactive toggle for offers
  - Integration with POS billing screen

### 7. User Management
- **Description:** Role-based user administration
- **Details:**
  - Admin and Cashier roles
  - Password hashing with bcrypt
  - Session-based authentication
  - Admin-only user management interface

### 8. Store Profile & Settings
- **Description:** Customizable store branding and configuration
- **Details:**
  - Shop name, slogan, and description
  - Logo upload capability
  - Theme customization (solid/gradient)
  - Primary color and gradient settings
  - Contact information (phone, address, email)
  - Receipt printer size configuration
  - Default delivery charge settings
  - Currency symbol customization
  - Social media links (Facebook, WhatsApp)

### 9. Dashboard Analytics
- **Description:** Business insights and visualizations
- **Details:**
  - Sales overview with charts (Recharts)
  - Product performance metrics
  - Supplier performance tracking
  - GRN statistics
  - Revenue trends

## 4. ⚙️ EXECUTION WORKFLOW

### Phase 1: Project Initialization ✅
- Set up Next.js 15 with App Router
- Configure TypeScript and Tailwind CSS
- Install dependencies (Prisma, bcrypt, iron-session, exceljs, recharts, lucide-react)
- Configure environment variables (.env)
- Set up project structure with proper folder organization

### Phase 2: Database Setup ✅
- Define Prisma schema with models:
  - User (authentication)
  - Category & SubCategory (dynamic categories)
  - Product (inventory)
  - Supplier (vendor management)
  - GRN (goods received notes)
  - Order (sales transactions)
  - StoreSettings (store configuration)
  - SpecialOffer (promotional bundles)
- Set up database migrations with `prisma db push`
- Configure Prisma Client generation
- Create seed data for initial categories and users

### Phase 3: Backend & API ✅
- Build server actions for:
  - Authentication (login, logout, session management)
  - Category/SubCategory CRUD operations
  - Product CRUD operations
  - Supplier CRUD operations
  - GRN CRUD operations
  - Special Offer CRUD operations
  - User management (admin only)
  - Store settings management
- Implement proper error handling
- Add request validation
- Configure session middleware with iron-session

### Phase 4: Frontend & UI ✅
- Create responsive layout with Sidebar navigation
- Build reusable components:
  - CategorySelector (dependent dropdowns)
  - Modal components
  - Form components
  - Table components with filtering
- Implement pages:
  - Dashboard with analytics
  - Products management
  - Suppliers management
  - GRN management
  - POS billing screen
  - Special offers management
  - Category management (admin only)
  - User management (admin only)
  - Store profile settings
- Add loading states and error boundaries
- Implement role-based access control

### Phase 5: Integration ✅
- Connect all frontend components with server actions
- Implement real-time data revalidation
- Set up form submissions with FormData
- Integrate category system across all forms
- Connect POS with product inventory
- Link GRN entries to stock updates
- Integrate special offers with POS billing

### Phase 6: Quality Assurance ✅
- Test all CRUD operations
- Verify category synchronization across pages
- Test role-based access control
- Verify stock updates on GRN creation
- Test POS billing flow
- Check responsive design on different screen sizes
- Verify database constraints and relations
- Test category deletion safety (SetNull behavior)

## 5. 📌 CODING STANDARDS & CONSTRAINTS

### TypeScript Standards
- Strict typing enforced (avoid `any` types where possible)
- Interface definitions for all data structures
- Proper type annotations for function parameters and return values
- Generic types used where appropriate

### Code Organization
- Modular component structure
- Server actions separated in `/src/actions/`
- Reusable components in `/src/components/`
- Page components in `/src/app/`
- Database schema in `/prisma/schema.prisma`

### Security Best Practices
- Password hashing with bcrypt
- Session-based authentication with iron-session
- SQL injection prevention via Prisma ORM
- Role-based access control on sensitive operations
- Environment variables for sensitive configuration

### Code Quality
- DRY principle followed (reusable CategorySelector component)
- Clean, readable code with proper formatting
- Comments for complex logic
- Consistent naming conventions
- Tailwind CSS for styling (custom CSS minimized)

### Database Constraints
- Foreign key relationships with proper cascade rules
- Unique constraints where needed (e.g., category name)
- Nullable fields for optional data
- SetNull on delete for category fields to prevent data loss

### Git Workflow
- Meaningful commit messages for each feature
- Branch structure for feature development
- Proper .gitignore for sensitive files

## 6. 📁 PROJECT STRUCTURE

```
Bakery-POS/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data script
├── src/
│   ├── actions/               # Server actions
│   │   ├── auth.ts
│   │   ├── category.ts
│   │   ├── grn.ts
│   │   ├── product.ts
│   │   ├── supplier.ts
│   │   └── specialOffer.ts
│   ├── app/                   # Next.js App Router pages
│   │   ├── admin/            # Admin-only pages
│   │   │   ├── categories/
│   │   │   ├── special-offers/
│   │   │   ├── users/
│   │   │   └── profile/
│   │   ├── grn/
│   │   ├── pos/
│   │   ├── products/
│   │   ├── suppliers/
│   │   └── page.tsx          # Dashboard
│   ├── components/           # Reusable components
│   │   ├── CategorySelector.tsx
│   │   ├── Sidebar.tsx
│   │   ├── POSPageClient.tsx
│   │   └── ...
│   ├── db/                   # Database client
│   │   └── index.ts
│   └── lib/                  # Utility functions
│       └── session.ts       # Session management
├── .env                      # Environment variables
├── package.json
└── tsconfig.json
```

## 7. 🚀 DEPLOYMENT INSTRUCTIONS

### Environment Variables Required
```env
DATABASE_URL="mysql://user:password@localhost:3306/bakery_pos"
SESSION_PASSWORD="your-secret-session-password"
```

### Build & Run Commands
```bash
# Install dependencies
npm install

# Generate Prisma Client
npm run db:generate

# Push database schema
npm run db:push

# Seed database
npm run seed

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Vercel Deployment
1. Connect GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch
4. Ensure MySQL database is accessible (use external MySQL service)

## 8. 🔮 FUTURE ENHANCEMENTS

- **Receipt Printing:** Direct thermal printer integration
- **Barcode Scanning:** Product lookup via barcode
- **Multi-location Support:** Track inventory across multiple bakery locations
- **Advanced Reporting:** Export reports to Excel/PDF
- **Customer Loyalty Program:** Points and rewards system
- **Online Ordering:** Customer-facing ordering interface
- **Payment Gateway Integration:** Digital payment methods
- **Mobile App:** Native mobile application for POS
- **Real-time Notifications:** Low stock alerts, order notifications
- **API Integration:** Third-party delivery service integration
