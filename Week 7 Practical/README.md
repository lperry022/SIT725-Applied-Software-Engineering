# ForensiX – Digital Forensics CTF Web Application

ForensiX is a browser-based Capture The Flag (CTF) platform designed to help users develop and test their digital forensics and incident response skills. Built with a neon-themed Materialize UI and powered by a MongoDB backend, the application supports dynamically loaded challenges, flag validation, and difficulty tagging.

## 🌐 Live Preview (Localhost)
Visit: `http://localhost:3000`

---

## 🧩 Key Features

### 🎯 Challenge System
- Add and manage CTF-style forensic challenges from MongoDB
- Supports preview and "Play" views with full challenge details
- **Flag Validation:** Users submit answers in a flag format (e.g. `FLAG{example}`), which are verified against the database

### 🟢 Color-Coded Difficulty Tags
- Easy: 🟩 `green`
- Medium: 🟡 `yellow`
- Hard: 🔴 `red`

### 🧪 Challenge Details
- Category tagging (e.g., Steganography, Metadata, etc.)
- Challenge preview with purpose instead of just steps
- Dynamic UI updates based on challenge ID via URL (`?id=`)

### 🧠 Guided Learning
- Hints and flag formats provided for each challenge
- Focused on practicing core digital forensics techniques in a controlled environment

---

## 🎨 UI/UX & Frontend

- **Materialize CSS Integration** for layout, modals, and form controls
- **Neon Themed Branding** with glowing logo and interactive effects
- **Responsive Design** supporting desktop and mobile use
- **Challenge Cards** with frosted glass design and animated entry
- **Navigation Bar** with icons and hover glow feedback
- **Smooth Scrolling** for anchor-linked sections

---

## 🖼️ Screenshots

> See `/screenshots` folder or the attached PDF for UI examples and challenge flow.

---

## 📁 Project Structure

