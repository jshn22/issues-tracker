# Civic-Assist 🏙️

> Civic-Assist is a simple full-stack web app to report and track civic issues (potholes, streetlight faults, garbage, water leaks) with images and location support.

---

## 🚀 Overview

Civic-Assist lets citizens report local infrastructure issues with a title, description, category, photo and location. Admin users can review and change issue status. The app demonstrates a typical MERN-style architecture with user authentication, file uploads, and a map-based issue detail view.

## ✨ Features

- User registration & login (JWT)
- Password reset (email)
- Create and view issues with optional image upload
- Address autocomplete + map/location support (OpenStreetMap)
- Upvote issues
- Admin dashboard for managing issues (change status / remove)
- Small scripts to create or promote a local Admin account

## 🧰 Tech Stack

- Frontend: React (Vite)
- Backend: Node.js, Express
- Database: MongoDB (Atlas)
- Auth: JSON Web Tokens (JWT)
- Image uploads: Cloudinary (via multer)
- Maps / Geocoding: OpenStreetMap (Nominatim) / Leaflet

---

## 📦 Installation

Follow these steps to run the project locally.

1. Clone the repository

```bash
git clone <your-repo-url>
cd CivicAssist
```

2. Backend setup

```bash
cd server
cp .env.example .env   # create a .env from example (if available)
# Edit .env and set values for MONGO_URI or DATABASE_URL, JWT_SECRET, CLOUDINARY_*, ADMIN_SECRET_KEY, etc.
npm install
# Start server (development)
npm run dev
```

3. Frontend setup

```bash
cd client
npm install
npm run dev
```

Open the frontend URL printed by Vite (usually http://localhost:5173) and the API at http://localhost:5000.

Notes about environment variables
- `DATABASE_URL` — MongoDB Atlas connection string (preferred for cloud)
- `JWT_SECRET` — a secret for signing JWTs
- `CLOUDINARY_*` — Cloudinary credentials (if using image uploads)
when registering via API

---

## ⚡ Quick Usage

- Register a new user via the frontend or POST /api/auth/register
- Login via the frontend or POST /api/auth/login to receive a JWT
- Create an issue via the frontend (Report Issue) or POST /api/issues with the JWT in Authorization header

Example: create an issue (curl)

```bash
curl -X POST http://localhost:5000/api/issues \
	-H "Authorization: Bearer <YOUR_TOKEN>" \
	-H "Content-Type: application/json" \
	-d '{"title":"Pothole on Main St","description":"Large pothole near crosswalk","category":"Pothole","address":"Main St, YourCity"}'
```

---

## 🔌 API Endpoints

Major endpoints (backend lives in `/server`):

- Auth
	- POST /api/auth/register — register (body: username, email, password, optional role/adminKey)
	- POST /api/auth/login — login (body: email, password)
	- GET /api/auth/user — get current user (protected)
	- POST /api/auth/forgot — request password reset
	- POST /api/auth/reset/:token — reset password

- Issues
	- GET /api/issues — list issues (query filters supported)
	- POST /api/issues — create issue (protected, fields: title, description, category, address, optional coordinates, imageUrl)
	- GET /api/issues/:issueId — get issue details
	- POST /api/issues/:issueId/upvote — toggle upvote (protected)
	- PATCH /api/issues/:issueId/status — admin only: change status
	- DELETE /api/issues/:issueId — admin only: delete issue

- Uploads
	- POST /api/upload — multipart image upload (returns imageUrl)

- Comments
	- POST /api/issues/:issueId/comments — add comment (protected)
	- GET /api/issues/:issueId/comments — list comments

Authentication: include `Authorization: Bearer <JWT>` header for protected routes.

---

## 🧩 Useful scripts

- `npm run dev` (in `/server`) — start backend with nodemon
- `npm run start` (in `/server`) — start backend once
- `npm run create-admin` (in `/server`) — run `scripts/createAdmin.js` to create/promote a local admin (uses ADMIN_EMAIL/ADMIN_PASSWORD env vars if provided)
- `npm run dev` (in `/client`) — start frontend (Vite)

---

## 🛡️ Security notes
- Avoid putting secrets into public repos. Use environment variables and a secrets manager in production.

---

## 📄 License

This project is provided under the MIT License — see the `LICENSE` file for details.

## 👤 Author

Jashanpreet kaur

---

Happy hacking! 🔧🎉
# Civic-Assist

This repository is a starter scaffold for Civic-Assist — a map-based civic issue reporting app.

What I created so far:

- Server: Express + Mongoose API with models for User, Issue, Comment.
- Auth routes: register and login with JWT.
- Issue routes: create, list, get, update status (admin), upvote toggle, delete (admin or owner).
- Comment routes: add and list comments for an issue.
- Minimal React (Vite) client skeleton that calls the backend root endpoint.



