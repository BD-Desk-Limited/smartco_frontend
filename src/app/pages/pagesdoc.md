# SmartCo Frontend - Pages Documentation

## Overview

This document provides comprehensive documentation for all routes in the SmartCo frontend application. SmartCo is a business management platform developed by BD-Desk Limited that streamlines sales, inventory, and management processes.

**Technology Stack:**
- Next.js 15 with App Router
- React 18
- Tailwind CSS
- PWA enabled with service worker
- JWT-based authentication

**Application Structure:**
- Uses Next.js App Router architecture
- Client-side rendered pages (marked with 'use client')
- Progressive Web App (PWA) capabilities
- Role-based access control (Admin, Manager, Sales Point)

## Root Configuration

### Redirects
- Root path (`/`) automatically redirects to `/pages/splash/splash1`
- Configured in `next.config.mjs`

### Global Layout
- Wraps all pages with multiple context providers:
  - `AuthProvider` - Authentication state management
  - `SetupProvider` - Application setup configuration
  - `BulkUserUploadProvider` - Bulk user operations
  - `BulkMaterialUploadProvider` - Bulk material operations  
  - `BulkbranchUploadProvider` - Bulk branch operations
  - `CompanyDataProvider` - Company information management
  - `CreateProductsProvider` - Product creation workflows

## Route Summary

### Public Routes (No Authentication Required)
Located in the following folders:

#### `/pages/splash/` folder
- `/pages/splash/splash1` - Initial splash screen with auto-redirect
- `/pages/splash/splash2` - Second splash screen in onboarding
- `/pages/splash/splash3` - Final splash screen before authentication

#### `/pages/auth/` folder  
- `/pages/auth/login` - Main login page for general users
- `/pages/auth/login/sales-point` - Specialized login for sales point users
- `/pages/auth/forgot-password` - Password recovery workflow
- `/pages/auth/reset-password` - New password setting after recovery
- `/pages/auth/verify-otp` - OTP verification for various flows
- `/pages/auth/sign-up` - New user registration

### Protected Routes (Authentication Required)
Located in the following folders:

#### `/pages/auth/` folder (Authenticated Users)
- `/pages/auth/authorize-device` - Device authorization (Admin role required)
- `/pages/auth/login-attempt-notification` - Security notification for login attempts
- `/pages/auth/logout-all-devices` - Global logout functionality

#### `/pages/account/admin/` folder (Admin Role Required)
**Main Dashboard:**
- `/pages/account/admin` - Main admin dashboard

**Branch Management (Branch_Management permission):**
- `/pages/account/admin/branch-management` - Branch management hub
- `/pages/account/admin/branch-management/create-branch` - Create new branch
- `/pages/account/admin/branch-management/edit-branch` - Edit existing branch
- `/pages/account/admin/branch-management/view-branch-details` - Branch details view

**Material Management (Materials_Management permission):**
- `/pages/account/admin/manage-materials` - Material management dashboard
- `/pages/account/admin/manage-materials/create-material` - Add new materials
- `/pages/account/admin/manage-materials/edit-material` - Modify material information
- `/pages/account/admin/manage-materials/view-materials` - List all materials
- `/pages/account/admin/manage-materials/view-material-details` - Detailed material info
- `/pages/account/admin/manage-materials/create-grouped-material` - Create material groups
- `/pages/account/admin/manage-materials/edit-grouped-material` - Modify material groups
- `/pages/account/admin/manage-materials/view-grouped-materials` - View grouped materials
- `/pages/account/admin/manage-materials/bulk-material-upload` - Bulk material upload
- `/pages/account/admin/manage-materials/bulk-upload-review` - Review bulk uploads

**User Management (Users_Management permission):**
- `/pages/account/admin/users-management` - User management dashboard
- `/pages/account/admin/users-management/create-user` - Create new user account
- `/pages/account/admin/users-management/edit-user` - Modify user accounts
- `/pages/account/admin/users-management/create-bulk-user` - Bulk user creation

**Product Management:**
- `/pages/account/admin/product-management/product-details` - Product information management

**Purchase Management:**
- `/pages/account/admin/purchases` - Purchase order management

#### `/pages/account/manager/` folder (Manager Role Required)
- `/pages/account/manager` - Manager-level dashboard

#### `/pages/account/sales-point/` folder (Sales Point Role Required)
- `/pages/account/sales-point` - Sales point operator interface

## Route Structure

### 1. Splash Pages (`/pages/splash/`)

#### `/pages/splash/splash1`
- **Purpose**: Initial splash screen with auto-redirect
- **Functionality**: 
  - Displays brand blue background
  - Auto-redirects to `splash2` after 3 seconds
  - Entry point for new users
- **Access**: Public
- **Technical**: Client-side component with useRouter hook

#### `/pages/splash/splash2`
- **Purpose**: Second splash screen in onboarding sequence
- **Functionality**: Continuation of splash sequence
- **Access**: Public
- **Navigation**: Links to splash3

#### `/pages/splash/splash3`
- **Purpose**: Final splash screen before authentication
- **Functionality**: 
  - Last step in onboarding
  - Gateway to login process
- **Access**: Public
- **Navigation**: Links to login pages

### 2. Authentication Pages (`/pages/auth/`)

#### `/pages/auth/login`
- **Purpose**: Main login page for general users
- **Functionality**:
  - Split-screen layout (50% carousel, 50% login form)
  - Picture carousel component
  - Login form with validation
  - Back navigation to splash3
  - Copyright footer with privacy/terms links
- **Components**: `PictureCarousel`, `LoginForm`
- **Access**: Public
- **Navigation**: Back to splash3, forward to dashboards

#### `/pages/auth/login/sales-point`
- **Purpose**: Specialized login for sales point users
- **Functionality**: 
  - Sales point specific authentication
  - Different UI/UX for point-of-sale scenarios
- **Components**: `SalesPoint`
- **Access**: Public
- **User Type**: Sales point operators

#### `/pages/auth/authorize-device`
- **Purpose**: Device authorization for security
- **Functionality**:
  - Validates device authorization
  - Admin-only access requirement
  - Error handling for unauthorized devices
  - Security checkpoint after login
- **Components**: `PictureCarousel`, `LoginAuthorize`
- **Access**: Authenticated users only (Admin role required)
- **Security**: Device-based access control

#### `/pages/auth/forgot-password`
- **Purpose**: Password recovery workflow
- **Functionality**: Password reset request form
- **Components**: `ForgotPassword`
- **Access**: Public
- **Flow**: Email → OTP → Reset

#### `/pages/auth/reset-password`
- **Purpose**: New password setting after recovery
- **Functionality**: Secure password reset form
- **Components**: `ResetPassword`
- **Access**: Public (with valid reset token)
- **Security**: Token-based validation

#### `/pages/auth/verify-otp`
- **Purpose**: OTP verification for various flows
- **Functionality**:
  - Multi-purpose OTP verification
  - Used in signup, password reset, device auth
- **Components**: `OTPForm`, `OTPInput`
- **Access**: Public (context-dependent)
- **Security**: Time-limited OTP validation

#### `/pages/auth/sign-up`
- **Purpose**: New user registration
- **Functionality**: User account creation form
- **Components**: `SignUp`
- **Access**: Public
- **Flow**: Registration → Email verification → Login

#### `/pages/auth/login-attempt-notification`
- **Purpose**: Security notification for login attempts
- **Functionality**:
  - Displays login attempt information
  - Security monitoring
- **Components**: `LoginAttempt`
- **Access**: Authenticated users
- **Security**: Audit trail for login activities

#### `/pages/auth/logout-all-devices`
- **Purpose**: Global logout functionality
- **Functionality**:
  - Terminates sessions across all devices
  - Security feature for compromised accounts
- **Access**: Authenticated users
- **Security**: Session management

### 3. Account Pages (`/pages/account/`)

#### Admin Dashboard & Management (`/pages/account/admin/`)

##### `/pages/account/admin`
- **Purpose**: Main admin dashboard
- **Functionality**:
  - Administrative overview and controls
  - System-wide metrics and navigation
- **Components**: `AdminDashboardPage`
- **Access**: Admin role only
- **Features**: Complete system oversight

##### Branch Management (`/pages/account/admin/branch-management/`)

###### `/pages/account/admin/branch-management`
- **Purpose**: Branch management hub
- **Functionality**: 
  - List and manage all company branches
  - CRUD operations for branches
- **Components**: `BranchManagementPage`
- **Access**: Admin with Branch_Management permission
- **Features**: Multi-location business support

###### `/pages/account/admin/branch-management/create-branch`
- **Purpose**: Create new branch
- **Functionality**: Branch creation form with validation
- **Access**: Admin with Branch_Management permission
- **Features**: Location setup, staff assignment

###### `/pages/account/admin/branch-management/edit-branch`
- **Purpose**: Edit existing branch details
- **Functionality**: Branch modification form
- **Access**: Admin with Branch_Management permission
- **Features**: Update branch information, reassign staff

###### `/pages/account/admin/branch-management/view-branch-details`
- **Purpose**: Detailed branch information view
- **Functionality**: Comprehensive branch data display
- **Access**: Admin with Branch_Management permission
- **Features**: Analytics, staff list, performance metrics

##### Material Management (`/pages/account/admin/manage-materials/`)

###### `/pages/account/admin/manage-materials`
- **Purpose**: Material management dashboard
- **Functionality**: 
  - Inventory oversight
  - Material CRUD operations
- **Components**: Material management interface
- **Access**: Admin with Materials_Management permission
- **Features**: Stock control, supplier management

###### `/pages/account/admin/manage-materials/create-material`
- **Purpose**: Add new materials to inventory
- **Functionality**: Material creation form
- **Access**: Admin with Materials_Management permission
- **Features**: SKU generation, supplier linking, categorization

###### `/pages/account/admin/manage-materials/edit-material`
- **Purpose**: Modify existing material information
- **Functionality**: Material update form
- **Access**: Admin with Materials_Management permission
- **Features**: Price updates, description changes, status modifications

###### `/pages/account/admin/manage-materials/view-materials`
- **Purpose**: List all materials in inventory
- **Functionality**: 
  - Searchable material list
  - Filtering and sorting capabilities
- **Access**: Admin with Materials_Management permission
- **Features**: Bulk operations, export functionality

###### `/pages/account/admin/manage-materials/view-material-details`
- **Purpose**: Detailed material information
- **Functionality**: Comprehensive material data view
- **Access**: Admin with Materials_Management permission
- **Features**: Transaction history, stock levels, supplier info

###### `/pages/account/admin/manage-materials/create-grouped-material`
- **Purpose**: Create material groups/categories
- **Functionality**: Grouping materials for better organization
- **Access**: Admin with Materials_Management permission
- **Features**: Category management, bulk assignment

###### `/pages/account/admin/manage-materials/edit-grouped-material`
- **Purpose**: Modify material groups
- **Functionality**: Update material groupings
- **Access**: Admin with Materials_Management permission
- **Features**: Group reassignment, category modifications

###### `/pages/account/admin/manage-materials/view-grouped-materials`
- **Purpose**: View materials organized by groups
- **Functionality**: 
  - Grouped material display
  - Category-based navigation
- **Access**: Admin with Materials_Management permission
- **Features**: Group analytics, category performance

###### `/pages/account/admin/manage-materials/bulk-material-upload`
- **Purpose**: Bulk upload materials via file import
- **Functionality**: 
  - Excel/CSV file processing
  - Bulk material creation
- **Access**: Admin with Materials_Management permission
- **Features**: Template download, validation, error reporting

###### `/pages/account/admin/manage-materials/bulk-upload-review`
- **Purpose**: Review bulk upload before processing
- **Functionality**: 
  - Preview uploaded data
  - Validation results display
- **Access**: Admin with Materials_Management permission
- **Features**: Error correction, selective import

##### User Management (`/pages/account/admin/users-management/`)

###### `/pages/account/admin/users-management`
- **Purpose**: User management dashboard
- **Functionality**: 
  - User list and administration
  - Role and permission management
- **Components**: `UserManagementPage`
- **Access**: Admin with Users_Management permission
- **Features**: User lifecycle management

###### `/pages/account/admin/users-management/create-user`
- **Purpose**: Create new user account
- **Functionality**: 
  - User creation form
  - Role assignment
  - Permission setting
- **Access**: Admin with Users_Management permission
- **Features**: Role-based setup, initial credentials

###### `/pages/account/admin/users-management/edit-user`
- **Purpose**: Modify existing user accounts
- **Functionality**: 
  - User detail updates
  - Role/permission changes
- **Access**: Admin with Users_Management permission
- **Features**: Status management, role transitions

###### `/pages/account/admin/users-management/create-bulk-user`
- **Purpose**: Bulk user creation via file upload
- **Functionality**: 
  - Excel/CSV user import
  - Bulk account creation
- **Access**: Admin with Users_Management permission
- **Features**: Template-based import, credential generation

##### Product Management (`/pages/account/admin/product-management/`)

###### `/pages/account/admin/product-management/product-details`
- **Purpose**: Detailed product information management
- **Functionality**: 
  - Product data entry and modification
  - Pricing and inventory management
- **Access**: Admin role
- **Features**: Product lifecycle management, pricing strategies

##### Purchase Management (`/pages/account/admin/purchases/`)

###### `/pages/account/admin/purchases`
- **Purpose**: Purchase order and procurement management
- **Functionality**: 
  - Purchase order processing
  - Supplier management
  - Inventory restocking
- **Access**: Admin role
- **Features**: Procurement workflows, supplier relations

#### Manager Dashboard (`/pages/account/manager/`)

##### `/pages/account/manager`
- **Purpose**: Manager-level dashboard
- **Functionality**: 
  - Mid-level management interface
  - Department-specific controls
- **Access**: Manager role
- **Features**: Team oversight, departmental analytics
- **Status**: Currently shows placeholder content

#### Sales Point Dashboard (`/pages/account/sales-point/`)

##### `/pages/account/sales-point`
- **Purpose**: Sales point operator interface
- **Functionality**: 
  - Point-of-sale operations
  - Transaction processing
  - Customer service tools
- **Access**: Sales point role
- **Features**: POS interface, transaction history, customer management
- **UI Elements**: Go Back button for navigation

## Security & Access Control

### Authentication System
- **Token-based**: JWT authentication with session storage
- **Token Validation**: Automatic expiry checking and renewal
- **Device Authorization**: Additional security layer for sensitive operations
- **Multi-factor**: OTP verification for critical actions

### Role-Based Access Control (RBAC)
- **Admin**: Full system access, user management, configuration
- **Manager**: Departmental control, team management, reporting
- **Sales Point**: POS operations, customer service, basic inventory

### Permission System
Access levels defined in `src/utilities/accessLevels.jsx`:
- `Branch_Management`: Branch operations and oversight
- `IT_Management`: Technical system management
- `Materials_Management`: Inventory and material control
- `Tax_Management`: Financial and tax-related operations
- `Users_Management`: User account administration
- `All_Access`: Complete system privileges

### Security Features
- **Protected Routes**: Authentication checks on sensitive pages
- **Device Authorization**: Hardware-based security validation
- **Session Management**: Global logout and session control
- **Audit Trail**: Login attempt tracking and monitoring

## Navigation Patterns

### Public Flow
1. `/` (redirects to splash1)
2. `/pages/splash/splash1` → `/pages/splash/splash2` → `/pages/splash/splash3`
3. `/pages/auth/login` or `/pages/auth/sign-up`
4. Authentication & device authorization
5. Role-based dashboard routing

### Authenticated Flow
- **Admin Users**: Access to all admin management interfaces
- **Manager Users**: Department-specific management tools
- **Sales Point Users**: POS and customer service interfaces

### Error Handling
- Unauthorized access redirects to appropriate login pages
- Token expiry triggers automatic logout and redirect
- Device authorization failures show error messages with guidance

## Technical Implementation Notes

### Context Providers
The application uses multiple React contexts for state management:
- Authentication state and user session management
- Bulk operation workflows for data import/export
- Company configuration and setup processes
- Product creation and inventory management workflows

### PWA Configuration
- Service worker enabled for offline functionality
- Manifest file for app installation
- Optimized for mobile and desktop usage

### Responsive Design
- Tailwind CSS for styling
- Mobile-first responsive design approach
- Split-screen layouts for larger screens

### Performance Considerations
- Client-side rendering for interactive components
- Lazy loading and code splitting via Next.js
- Optimized image handling with Next.js Image component

## Development Notes

### File Organization
- Each route has its own `page.jsx` file following Next.js App Router conventions
- Components are organized by feature/module in the `components` directory
- Reusable utilities and contexts are properly separated
- Services layer handles API communication

### Naming Conventions
- Page files: `page.jsx` (Next.js App Router requirement)
- Components: PascalCase naming
- Directories: kebab-case for routes, camelCase for components
- Context files: camelCase with Context suffix

### Future Considerations
- Manager dashboard requires complete implementation
- Additional role-based features may need new permission levels
- Internationalization support for multi-language deployment
- Enhanced PWA features for offline operations

---

**Last Updated**: October 24, 2025  
**Version**: 0.1.0  
**Maintained by**: BD-Desk Limited Development Team