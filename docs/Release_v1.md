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

## Step 3: Project Initialization

Do this exactly in order.

---

### 1. Create the Monorepo Root

```bash
mkdir sadhguru-quotes
cd sadhguru-quotes
git init
```

Create root `.gitignore` immediately:

```bash
# .gitignore
node_modules/
.env
dist/
```

---

### 2. Initialize the Client

```bash
npm create vite@latest client -- --template react
cd client
npm install
npm install axios
```

That's all the client needs for now. `axios` goes in `services/` — not raw fetch.

---

### 3. Initialize the Server

```bash
cd ..
mkdir server
cd server
npm init -y
```

Install dependencies:

```bash
npm install express mongoose dotenv cors
npm install --save-dev nodemon
```

| Package    | Why                                            |
| ---------- | ---------------------------------------------- |
| `express`  | The framework                                  |
| `mongoose` | MongoDB ODM — schema, model, queries           |
| `dotenv`   | Loads `.env` variables                         |
| `cors`     | Allows your Vercel frontend to call this API   |
| `nodemon`  | Auto-restarts server on file change during dev |

Update `server/package.json` scripts:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

---

### 4. Build the Server Files

**`server/src/config/db.js`**

```js
const mongoose = require("mongoose");

const connectDB = async () => {
 try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");
 } catch (error) {
  console.error("MongoDB connection failed:", error.message);
  process.exit(1);
 }
};

module.exports = connectDB;
```

**`server/src/models/Quote.js`**

```js
const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema(
 {
  text: {
   type: String,
   required: true,
   trim: true,
  },
 },
 { timestamps: true },
);

module.exports = mongoose.model("Quote", quoteSchema);
```

**`server/src/controllers/quoteController.js`**

```js
const Quote = require("../models/Quote");

const getRandomQuote = async (req, res) => {
 try {
  const count = await Quote.countDocuments();
  const random = Math.floor(Math.random() * count);
  const quote = await Quote.findOne().skip(random);
  res.status(200).json({ quote: quote.text });
 } catch (error) {
  res.status(500).json({ message: "Failed to fetch quote" });
 }
};

module.exports = { getRandomQuote };
```

**`server/src/routes/quoteRoutes.js`**

```js
const express = require("express");
const router = express.Router();
const { getRandomQuote } = require("../controllers/quoteController");

router.get("/quote", getRandomQuote);

module.exports = router;
```

**`server/src/app.js`**

```js
const express = require("express");
const cors = require("cors");
const quoteRoutes = require("./routes/quoteRoutes");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use("/", quoteRoutes);

module.exports = app;
```

**`server/server.js`**

```js
require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
 app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
 });
});
```

**`server/.env`**

```markdown
PORT=5000
MONGO_URI=your_mongodb_atlas_uri_here
CLIENT_URL=http://localhost:5173
```

---

### 5. MongoDB Atlas Setup

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) → create free account
2. Create a **free M0 cluster**
3. Create a **database user** (username + password)
4. Under **Network Access** → Add IP → `0.0.0.0/0` (allow all, fine for this project)
5. Under **Connect** → Drivers → Copy the connection string
6. Paste it into `server/.env` as `MONGO_URI`, replace `<password>` with your DB user password

---

### 6. Test the Server

```bash
cd server
npm run dev
```

You should see:

```markdown
MongoDB connected
Server running on port 5000
```

Hit `http://localhost:5000/quote` in browser or Postman. It'll return empty for now — no quotes in DB yet. That's expected. We'll seed the DB in the next step.

---
