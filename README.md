# Restaurant App Backend

This repository contains the backend server for a restaurant management application. The server is built using Node.js, Express, TypeScript, and PostgreSQL.

## Getting Started

1. **Clone the repository:**
   git clone <repository-url>
2 **Install Dependencies
   npm install
3 **Run server
   ts-node server.ts
## API Endpoints
### Authentication

### POST /admin/log-in
 Log in as an admin.

### GET /get-user
Get user details.

### Admin
POST /reg-manager

### Register a manager (Admin only).
POST /reg-staff/:uid

### Register a staff member (Admin or Manager).
POST /login-user

### Log in as a user.
DELETE /delete-user/:id

### Delete a user (Admin or Manager).

### Menu
GET /menu/get-menu

## Get the menu.

POST /menu/add-menu/:u_id/
### Add a menu item (Staff or Manager).

PATCH /menu/edit-menu/:u_id/:menu_id
### Edit a menu item (Staff or Manager).

DELETE /menu/delete-menu/:u_id/:menu_id
### Delete a menu item (Staff or Manager).

## Restaurant
GET /restaurant/get-restaurant
### Get restaurant details.

POST /restaurant/add-restaurant
### Add a new restaurant (Admin only).

PATCH /restaurant/edit-restaurant/:id
### Edit restaurant details (Admin only).

DELETE /restaurant/delete-restaurant/:id
### Delete a restaurant (Admin only).
## Table

GET /table/assign-table/:uid
###Assign a table to a user (Staff or Manager).

POST /table/order/:uid
###Process an order (Staff or Manager).

POST /table/payment/
### Process a payment (Staff or Manager).   
