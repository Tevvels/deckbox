# DeckBox

A comprehensive deck-building, community-driven card management system designed for Magic: The Gathering players. 

## 🔗 Links

- **Live Demo:** [deckbox-sepia.vercel.app](https://vercel.app)

- **backend API Deployment:** [https://deckbox.onrender.com/]

## Screenshots / Preview


## 🚀 Key Features

- **Deck Creation:** The core engine of the project. Users can search and gather Magic: The Gathering cards to theory-craft and build decks digitally before purchasing physical cards.

- **Public Deck Display:** A community gateway allowing users to browse, research, and compare builds created by other players.

- **User Authentication:** Secure signup and login to save and persist custom decks to a personal profile.


## 🛠️ Tech Stack
- **Frontend:** React, CSS3
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (via Mongoose)
- **Deployment:** Vercel (Frontend)

## 💻 Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org) (v16 or higher recommended)
- [MongoDB](https://mongodb.com) (Local instance or MongoDB Atlas URI)

### Installation & Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com
   cd deckbox
   ```

2. **Install dependencies:**
   *If your frontend and backend are in separate folders, run npm install in both. If using a unified directory:*
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in your root/backend directory and add your connection strings:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```

4. **Run the application:**
   ```bash
   npm start
   ```
   *The app should now be running locally at `http://localhost:3000`.*