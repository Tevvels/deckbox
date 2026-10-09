# DeckBox

A comprehensive deck‑building and community‑driven card management system designed for Magic: The Gathering players. Build decks, browse community lists, and manage your MTG collection with a clean, modern interface.

---

## 🏷️ Badges

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)
![VS Code](https://img.shields.io/badge/VSCode-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white)

---

## 🔗 Live Links

- **Live Demo:** https://deckbox-r8ok.vercel.app  
- **Backend API:** https://deckbox.onrender.com  

---

## 📸 Preview

![Demo](https://github.com/Tevvels/deckbox/blob/main/Deckbox/client/src/photos/screenshot_fullscreen.png)

---

## 🚀 Features

- **Deck Creation** – Search MTG cards via Scryfall and build decks digitally  
- **Commander Color Identity Enforcement** – Fully implemented legality checks  
- **Public Deck Display** – Browse decks created by other users  
- **User Authentication** – JWT‑based login and registration  
- **Responsive UI** – Clean, modern React interface  

---

## 🛠️ Tech Stack

**Frontend:** React, CSS  
**Backend:** Node.js, Express  
**Database:** MongoDB + Mongoose  
**Auth:** JWT  
**Deployment:** Vercel + Render  

---

## 💻 Getting Started

Follow these steps to run DeckBox locally.

---

### 1. Clone the repository

```bash
git clone https://github.com/Tevvels/deckbox.git
cd deckbox
```

---

### 2. Install dependencies

#### Backend:

```bash
cd server
npm install
```

#### Frontend:

```bash
cd ../client
npm install
```

---

### 3. Environment Variables

Create a `.env` file inside the **server** directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CORS_ORIGIN=http://localhost:3000
```

If your frontend needs environment variables, create:

```env
# client/.env (optional)
```

---

### 4. Start the backend

```bash
cd server
npm run dev
```

Backend runs at:

```
http://localhost:5000
```

---

### 5. Start the frontend

```bash
cd client
npm start
```

Frontend runs at:

```
http://localhost:3000
```

---

### ✔ Your app is now running locally.

---

## 📦 Folder Structure

```
deckbox/
├── client/        # React frontend
├── server/        # Express backend
└── README.md
```

---

## 🧠 What I Learned

- Building full MERN stack applications  
- Managing complex React state with custom hooks  
- Integrating external APIs (Scryfall)  
- Enforcing Commander color identity rules  
- Deploying full‑stack apps (Vercel + Render)  

---

## 📬 Contact

Created by **Christopher Watkins**  
GitHub: https://github.com/Tevvels
