# Frontend Design Document

## Overview

TopUpin is a game top-up marketplace web application.

Design inspiration:

- Itemku
- Codashop

Style:

- Clean
- Simple
- Marketplace-oriented
- Easy to navigate
- Mobile-friendly

Focus on usability rather than visual complexity.

---

## User Roles

### Guest

Can access:

- Main Page
- Login Page
- Register Page
- Catalog Page

### User

Can access:

- Main Page
- Catalog Page
- Checkout Page
- Account Management Page
- Transaction History Page

### Admin

Can access:

- Admin Page

---

## User Flow

### Guest

Main Page
→ Login

Main Page
→ Register

Main Page
→ Catalog

---

### User

Login
→ Catalog
→ Checkout
→ Transaction History

Login
→ Account Management

---

### Admin

Login
→ Admin Page

---

## Pages

### Main Page

Components:

- Navbar
- Hero Section
- Popular Games Section
- Featured Products
- Footer

Notes:
- Keep the layout simple and uncluttered.
- Avoid excessive banners, animations, and decorative elements.

---

### Login Page

Components:

- Login Form
- Email Input
- Password Input
- Login Button

---

### Register Page

Components:

- Register Form
- Username Input
- Email Input
- Password Input
- Confirm Password Input
- Register Button

---

### Account Management Page

Components:

- Profile Information
- Edit Profile Form
- Save Button

---

### Catalog Page

Components:

- Search Bar
- Product Grid
- Product Card

Notes:
- Use a simple grid layout.
- Avoid complex filtering systems.
- Keep product cards clean and easy to scan.

---

### Checkout Page

Components:

- Product Detail
- Quantity Selector
- Total Price
- Checkout Button

---

### Transaction History Page

Components:

- Transaction Table

Columns:

- Product
- Quantity
- Total Price
- Status
- Date

---

### Admin Page

Components:

- Summary Cards
- Product Table
- User Table
- Transaction Table

Notes:
- No charts required.
- No analytics widgets required.
- Prioritize readability and functionality.

---

## Shared Components

### Navbar

Used on all pages.

### Footer

Used on all pages.

### Product Card

Contains:

- Product Image
- Product Name
- Product Price
- Buy Button

### Form Component

Used for:

- Login
- Register
- Profile

### Table Component

Used for:

- History
- Admin

---
## Design Principles

- Keep interfaces simple and intuitive.
- Use consistent spacing and alignment.
- Minimize unnecessary visual elements.
- Prioritize readability and usability.
- Maintain consistency across all pages.
- Use cards and tables instead of complex layouts.
- Avoid excessive animations and effects.


## Responsive Design

### Mobile

320px - 767px

### Tablet

768px - 1023px

### Desktop

1024px+