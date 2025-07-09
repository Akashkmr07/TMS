# Task Management System (TMS)

A full-stack **Task Management System** (TMS) built using **React.js (with TypeScript)**, **Node.js**, **Express**, and **MongoDB**, styled with **Tailwind CSS** and designed with a modern **purple gradient dark/light theme**. This system helps users create, manage, archive, and delete tasks with authentication and mobile responsiveness.

---

## 🔧 Tech Stack

### Frontend:

* React.js (TypeScript)
* Tailwind CSS
* Lucide Icons
* React Router DOM
Lucide React Icons
* Chart.js (for analytics)
* Axios (for HTTP requests)
* Context API for state management
......

### Backend:

* Node.js
* Express.js
* MongoDB (Atlas)
* Mongoose
* JWT Authentication......

---

## 📌 Features

### ✅ Core Functionality

* User registration and login
* JWT-based authentication
* Create new tasks
* Edit/update tasks
* Delete tasks
* Archive/unarchive tasks
* Filter tasks by status/priority
* Dashboard analytics (Total, In-Progress, Completed, To-Do)
* Dark/light theme with purple gradient UI

---

## 🖼️🧾 Screenshots

###   Task Dashboard
![Dashboard](https://github.com/Akashkmr07/TMS/blob/c1e5a489e34a8befb96531f01bcd4b1fab99a07a/assests/a.png)

### 🔐Login Page
![Login Page](https://github.com/Akashkmr07/TMS/blob/6ef873608ffc3a7086b0627baea5d81e19b11263/assests/l.png)

## ⚙️ Backend Logic

* Routes under `/api/auth` and `/api/tasks`
* Token-based protected routes
* MongoDB schema modeling for users and tasks
* Connection to MongoDB Atlas with environment config

---

## 📱 Responsive Design

* Fully responsive across mobile, tablet, and desktop
* Adaptive layout for sidebar, navbar, and modals

---

## 🎨 UI Design

* Modern UI with dark theme and purple gradients
* Transition animations
* Modal-based task creation and update
* Accessible buttons and hover states
* Clean dashboard interface

---

## 🐞 Known Bugs & Challenges

### ❗ Login/Register Input Delay

* In the registration and login pages, typing input requires clicking the field again after a character.
* Possibly due to uncontrolled/controlled component issue or re-renders in state.
* Fix in progress: likely related to transition + state updates on controlled inputs.

### ❗ Dark/Light Mode

* Theme toggle works on main pages, but some components do not respect theme (e.g., archive page).

### ❗ Minor Visual Glitches

* On some devices, gradient overlaps or text contrast needs polishing.

---

## 💡 What I Learned

* Deepened knowledge of JWT authentication and Express middleware
* Improved React/TypeScript typing and component composition
* Learned how to persist state via context without localStorage
* Enhanced styling with Tailwind's utility-first classes
* Used Git/GitHub effectively to manage project

---

## 🧠 Development Process

* Project created from scratch with custom architecture
* 15+ hours of coding, debugging, refactoring
* AI tools (like ChatGPT) assisted in learning and debugging
* Custom diagrams and flow logic created to understand routes and data flow

---

## 📈 Future Improvements

* Add support for drag-and-drop task sorting
* Fix remaining theme inconsistencies
* Improve form validation UX
* Add due-date reminders or notifications
* Role-based access (admin/user)

---

## 🗂️ Project Structure

/TMS
├── backend
│   ├── controllers/       # Route controllers for auth and tasks
│   ├── middleware/        # JWT auth middleware, error handlers
│   ├── models/            # Mongoose schemas for User, Task
│   ├── routes/            # Express route handlers (/auth, /tasks)
│   ├── node_modules/
│   ├── .env               # Environment variables (not committed)
│   ├── index.js           # Main entry point for Express server
│   ├── package.json
│   └── package-lock.json
│
├── frontend
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # Auth context and provider
│   │   ├── pages/         # Dashboard, Login, Tasks, Archive, etc.
│   │   ├── services/      # API calls to backend (authService, taskService)
│   │   ├── App.tsx        # Root component with routing
│   │   └── main.tsx       # Entry point
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   ├── postcss.config.js
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   ├── eslint.config.js
│   ├── .gitignore
│   ├── README.md          # Frontend-specific or shared instructions
│   ├── package.json
│   └── package-lock.json




---

## 🚀 Getting Started

1. Clone the repo

```bash
git clone https://github.com/yourusername/task-management-system.git
cd task-management-system


Setup backend->
cd backend
npm install
npm run dev
Setup frontend

setup frontend->
cd frontend
npm install
npm run dev
Open in browser:

http://localhost:5173

🙌 Final Words
This Task Management System is a great learning project demonstrating full-stack development with modern tools. While it has bugs and unfinished polish, with more time and focus it can be production-ready. A huge thanks to GPT and AI tools for guidance, but every line is coded with understanding and intent.
