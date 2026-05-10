# Government Booking System - Citizen Booking Module

A full-stack government appointment booking system built with **Next.js**, **Express**, and **MongoDB**.

---

## Project Structure

```
Government Booking System/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   ├── Service.js         # Service model
│   │   ├── Branch.js          # Branch model
│   │   ├── Slot.js            # Time slot model
│   │   └── Appointment.js     # Appointment model
│   ├── routes/
│   │   ├── services.js        # GET /api/services
│   │   ├── branches.js        # GET /api/branches?serviceId=
│   │   ├── slots.js           # GET /api/slots?branchId=
│   │   └── appointments.js    # POST /api/appointments
│   ├── seeds/
│   │   └── seed.js            # Database seeder
│   ├── .env                   # Environment variables
│   ├── server.js              # Express entry point
│   └── package.json
├── frontend/
│   ├── components/
│   │   ├── Layout.jsx         # Main layout with header/footer
│   │   ├── LoadingSpinner.jsx
│   │   └── ErrorMessage.jsx
│   ├── lib/
│   │   └── api.js             # Axios API client
│   ├── pages/
│   │   ├── _app.jsx           # App wrapper
│   │   ├── index.jsx          # Services page
│   │   ├── branches.jsx       # Branch selection
│   │   ├── slots.jsx          # Time slot selection
│   │   ├── confirm.jsx        # Booking form
│   │   └── success.jsx        # Confirmation page
│   ├── styles/
│   │   └── globals.css        # Tailwind + global styles
│   └── package.json
└── README.md
```

---

## Prerequisites

- **Node.js** v18+
- **MongoDB** running locally on port 27017 (or update `MONGODB_URI` in `backend/.env`)

---

## Step-by-Step Run Instructions

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Seed the Database

```bash
npm run seed
```

This creates 6 government services, 24 branches, and ~2800 time slots.

### 3. Start the Backend Server

```bash
npm run dev
```

Backend runs on **http://localhost:5000**

### 4. Install Frontend Dependencies (new terminal)

```bash
cd frontend
npm install
```

### 5. Start the Frontend

```bash
npm run dev
```

Frontend runs on **http://localhost:3000**

---

## API Endpoints

| Method | Endpoint             | Description                    |
|--------|----------------------|--------------------------------|
| GET    | /api/services        | List all active services       |
| GET    | /api/branches?serviceId=ID | Branches for a service   |
| GET    | /api/slots?branchId=ID    | Available slots for branch |
| POST   | /api/appointments    | Create a booking               |
| GET    | /api/appointments/user?nationalId=NID | Citizen's appointments  |
| GET    | /api/appointments/reference/:ref | Lookup appointment by reference |
| PUT    | /api/appointments/:id/cancel | Cancel an appointment (owner only) |

## Citizen Dashboard

After booking, the citizen can access their dashboard at `/citizen/dashboard`:

- **Dashboard** — overview with stats and upcoming bookings
- **Appointments** — full list with filters (all / upcoming / completed / cancelled) and cancel action
- **Confirmation (QR)** — QR code for the upcoming booking, scanned by the office staff
- **Profile** — personal details and activity summary

The session is keyed off the national ID (no password). The flow is:
booking → success page → "Go to my dashboard" → citizen area.
Citizens who already booked can re-enter via `/citizen/login` using their national ID.

### POST /api/appointments Body

```json
{
  "serviceId": "...",
  "branchId": "...",
  "slotId": "...",
  "citizenName": "Ahmed Mohamed",
  "citizenEmail": "ahmed@example.com",
  "citizenPhone": "+201001234567",
  "nationalId": "29001011234567"
}
```

---

## Key Features

- **Multi-step booking flow**: Service → Branch → Time Slot → Confirm
- **Double-booking prevention**: MongoDB transactions ensure atomic slot reservation
- **Input validation**: Server-side (express-validator) + client-side
- **Responsive UI**: Tailwind CSS, mobile-friendly design
- **Government-style theme**: Professional blue color scheme
- **Booking reference**: Unique reference code generated per appointment
- **Error handling**: User-friendly error messages throughout
