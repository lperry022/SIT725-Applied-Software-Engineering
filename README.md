# ForensiX – Digital Forensics CTF (MVC • Express • EJS • MongoDB)

ForensiX is a browser-based Capture-The-Flag platform for learning digital forensics and incident response.  
It uses a clean **MVC** split (Models / Views / Controllers), a neon **Materialize** UI, and a **MongoDB** backend.

---

## 🌐 Live (local)
http://localhost:3000

---

## ✨ Features

- **Challenge catalog** with responsive cards
- **Play view** per challenge with **server-side flag verification**
- Difficulty & category tags, image preview, optional hints/steps
- **EJS** templates with **Materialize CSS** components and mobile sidenav
- JSON **API** for challenges (used by the home grid)
- Security-minded defaults (flags never sent to the client; excluded from listings)

---

## 🧱 Tech Stack

- **Backend:** Node.js, Express, Mongoose
- **Views:** EJS + Materialize CSS + Material Icons
- **Database:** MongoDB (Atlas or local)
- **Env:** dotenv

---

## 📁 Project Structure (MVC)

├─ controllers/
│ ├─ challengeController.js
│ ├─ submissionController.js
│ └─ userController.js
├─ models/
│ ├─ challenge.js # Mongoose schema
│ ├─ challengeModel.js # Data access (list/find/verify/CRUD)
│ ├─ submissionModel.js # Submissions + (optional) scoreboard
│ └─ userModel.js
├─ public/ # Static assets served at /
│ ├─ css/styles.css
│ ├─ images/challenge.png
│ └─ js/script.js
├─ routes/
│ └─ challenges.js # Page + API routes
├─ views/ # EJS templates
│ ├─ home.ejs
│ ├─ challenges.ejs
│ ├─ play.ejs
│ └─ submissionResult.ejs
├─ scripts/
│ └─ seed.js # Sample data seeding (optional)
├─ .env # NEVER commit this file
├─ server.js # App entry (starts after Mongo connects)
└─ package.json
