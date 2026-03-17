# Sadhguru-Wisdom-API

## Step 01 - Research & Analysis

### Tech Stack

- **Frontend**: React.js + Vite
- **Backend**: Express.js
- **Database**: MongoDB

### Architecture

- **Repository Structure**: Monorepo
- **Database Schema**: Plain text and other related information.
- **API Endpoints**: `GET` `/quote` -> Generate Random Quote
- **Deployment**:
  - **Fronted**: Vercel
  - **Backend**: Koyeb
  - **Database**: MongoDB Atlas
  - **Version Control System (VCS)**: Git
  - **Workflow/Code Management**: GitHub

| Decision            | Choice                                        |
| ------------------- | --------------------------------------------- |
| Frontend            | React + Vite                                  |
| Backend             | Express.js                                    |
| Repo structure      | Monorepo                                      |
| Quote schema        | Plain text only and other related information |
| API endpoint        | GET /quote → random quote                     |
| Frontend Deployment | Vercel                                        |
| Backend Deployment  | Koyeb                                         |
| Database Deployment | MongoDB (Atlas free tier)                     |

## Step 02 - Design (Project Structure and Folder Structure)

## 2.1 Project Structure (Monorepo)

```md
sadhguru-quotes/
├── client/ # React + Vite (Frontend)
│ ├── public/
│ ├── src/
│ │ ├── components/ # Reusable UI components
│ │ ├── pages/ # Page-level components
│ │ │ └── Home.jsx
│ │ ├── services/ # API call logic (axios/fetch)
│ │ │ └── quoteService.js
│ │ ├── App.jsx
│ │ └── main.jsx
│ ├── .env # VITE_API_URL
│ ├── index.html
│ └── package.json
│
├── server/ # Express.js (Backend)
│ ├── src/
│ │ ├── config/
│ │ │ └── db.js # MongoDB connection
│ │ ├── models/
│ │ │ └── Quote.js # Mongoose schema
│ │ ├── controllers/
│ │ │ └── quoteController.js # Business logic
│ │ ├── routes/
│ │ │ └── quoteRoutes.js # Route definitions
│ │ └── app.js # Express app setup
│ ├── .env # PORT, MONGO_URI
│ ├── server.js # Entry point
│ └── package.json
│
├── .gitignore
└── README.md
```

### Why This Structure

- `services/` on **client** side, API calls never live inside components. If your API URL changes, you change it in one place. This is the **Single Responsibility** principle in action.
- `controllers/` on **server** side, Routes only define the path. Business logic lives in controllers. Route file stays clean and readable.
- `config/db.js` — DB connection is isolated. Not dumped in `server.js`.
  `server.js` vs `app.js` — `app.js` sets up Express (middleware, routes). server.js just starts the server. This separation makes testing easier later.
- No `src/` on client root level confusion because, Vite expects `index.html` at root of `client/`. Everything else goes in `src/`.

### API Request Flow (End to End)

1. User hits "/" → Vercel serves React app

2. User's browser calls `GET` `/quote`
   → Koyeb (Express)
   → quoteRoutes.js
   → quoteController.js
   → Quote.js (Mongoose)
   → MongoDB Atlas
   → returns { quote: "..." }
   → renders on UI
