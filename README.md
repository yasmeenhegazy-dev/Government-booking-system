# Government Booking System

Government appointment booking platform built with **React (Vite)**, **Node.js**, **Express**, and **MongoDB**.

## Project Overview

The **Government Booking System** is a web-based platform designed to organize appointment scheduling for government service centers.
The system allows citizens to book appointments online before visiting the branch, helping reduce overcrowding, long waiting times, and improving service efficiency.

This platform provides a structured scheduling system with role-based access for citizens, employees, and administrators.

---

## Objectives

* Reduce physical queues in government service centers
* Improve service organization and efficiency
* Allow citizens to schedule appointments online
* Provide better time management for both citizens and employees
* Generate administrative reports for decision-making

---

## System Roles

### Citizen

* Register and login
* View available government services
* Select branch and available time slot
* Book an appointment
* Receive booking confirmation with QR Code
* Track appointment status

### Employee

* View daily appointments
* Verify appointments using QR Code
* Update appointment status
* Manage daily bookings

### Admin

* Manage government services
* Manage branches
* Control daily branch capacity
* Manage users and roles
* View system reports, analytics, and activity logs

---

## Technology Stack

### Frontend

* React 18 + Vite
* React Router 6
* Tailwind CSS
* axios, react-toastify, lucide-react, qrcode.react, html5-qrcode

### Backend

* Node.js
* Express.js
* Mongoose
* bcrypt (password hashing)
* nodemailer (booking confirmations + OTP)

### Database

* MongoDB (auto-spun-up via mongodb-memory-server for dev — no external Mongo needed)

---

## Project Structure

```
government-booking-system/
├── frontend/                # Vite + React app
│   ├── src/
│   │   ├── components/      # Layout / CitizenLayout / EmployeeLayout / AdminLayout
│   │   ├── lib/             # api client + auth hooks + i18n
│   │   ├── pages/
│   │   │   ├── auth/        # Login / Register / ForgetPassword / ResetPassword
│   │   │   ├── citizen/     # Dashboard / Appointments / Confirmation / Profile
│   │   │   ├── employee/    # Dashboard / Appointments / Scan / Profile
│   │   │   └── admin/       # Dashboard / Reports / Slots / Appointments / Logs / Manage / Profile
│   │   └── styles/
│   ├── index.html
│   └── vite.config.js
├── backend/                 # Express + Mongoose
│   ├── models/              # User / Service / Branch / Slot / Appointment / Employee
│   ├── routes/              # auth / services / branches / slots / appointments / employees / admin
│   ├── services/            # mailer + activity log
│   ├── config/db.js         # MongoDB connection + seed
│   └── server.js
└── README.md
```

---

## Run Instructions

### Prerequisites

* Node.js v18+

### Backend

```bash
cd backend
npm install
npm run dev          # http://localhost:5000
```

The seeded database includes 6 services, 4 physical branches, ~3000 slots, 5 demo employees, and pre-registered user accounts (`Employee@123` password).

### Frontend

```bash
cd frontend
npm install
npm run dev          # http://localhost:3000
```

---

## API Highlights

### Auth

| Method | Endpoint                  | Purpose                             |
|--------|---------------------------|-------------------------------------|
| POST   | /api/auth/register        | Register a user (citizen/employee)  |
| POST   | /api/auth/login           | Login by email or national ID       |
| POST   | /api/auth/sendOtp         | Send OTP for password reset         |
| POST   | /api/auth/resetpassword   | Reset password with OTP             |

### Booking

| Method | Endpoint                              | Purpose                       |
|--------|---------------------------------------|-------------------------------|
| GET    | /api/services                         | List services                 |
| GET    | /api/branches?serviceId=ID            | Branches for a service        |
| GET    | /api/slots?branchId=ID                | Available slots               |
| POST   | /api/appointments                     | Create booking                |
| GET    | /api/appointments/user?nationalId=NID | Citizen's appointments        |
| PUT    | /api/appointments/:id/cancel          | Cancel own appointment        |

### Employee

| Method | Endpoint                              | Purpose                       |
|--------|---------------------------------------|-------------------------------|
| GET    | /api/appointments/all-upcoming        | Every upcoming booking        |
| GET    | /api/appointments/by-date?date=Y-M-D  | Bookings for a specific date  |
| POST   | /api/appointments/verify-qr           | Check-in via scanned QR       |
| PUT    | /api/appointments/:id/status          | Update appointment status     |

### Admin

| Method | Endpoint                              | Purpose                       |
|--------|---------------------------------------|-------------------------------|
| GET    | /api/admin/stats                      | Totals + today snapshot       |
| GET    | /api/admin/reports?days=N             | Daily breakdown               |
| GET/PUT| /api/admin/slots                      | Capacity logic                |
| GET    | /api/admin/appointments               | Admin-wide bookings           |
| GET    | /api/admin/logs                       | Activity log                  |
| GET/POST/PUT/DELETE | /api/admin/users      | User CRUD                     |
| GET/POST/PUT/DELETE | /api/admin/services   | Service CRUD                  |
| GET/POST/PUT/DELETE | /api/admin/branches   | Branch CRUD                   |
| GET/POST/PUT/DELETE | /api/admin/roles      | Role CRUD (in-memory)         |

---

## Key Features

* Auth flow with bcrypt-hashed passwords and OTP-based password reset
* Multi-step booking: Service → Branch → Time Slot → Confirm
* Double-booking prevention via atomic capacity check
* Server-side validation (express-validator) and client-side validation
* QR-code confirmation, scanned by the employee dashboard
* Three role-based dashboards: citizen, employee, admin
* Admin CRUD over services/branches/users/roles with cascade delete
* Capacity control on slots and activity-log tracking of admin actions
* Responsive RTL Arabic UI with the navy `#002B5B` / gold `#C5A059` brand palette

---

## Team Members

* Yasmeen Khaled Ibrahim Hegazy
* Mennatallah Ibrahim Ali Fergany
* Mariam Reda Ibrahim
* Shahd Elsayed Essa
* Abdelrahman Ahmed Emam
* Jomaa Saeed Mansour

---

## License

This project is developed as part of a **Graduation Project for React Frontend Development Track at DEPI**.
