# 🐾 Pet Care Log

A full-stack web app to track your nintendogs pets! This is made to log your existing in game pets with a simple interface, this has 0 relation to nintendo

---

## 🗂️ Project Structure

```
pet-care-log/
├── frontend/
│   ├── index.html       # Main UI
│   ├── style.css        # Nintendogs-inspired styles
│   └── app.js           # API calls & UI logic
└── backend/
    ├── index.js         # Express server entry point
    ├── db.js            # MySQL connection pool
    ├── schema.sql       # Database schema
    ├── routes/
    │   ├── pets.js      # CRUD routes for pets
    │   └── logs.js      # CRUD routes for care logs
    ├── .env.example     # Environment variable template
    └── package.json
```

---

## ⚙️ Local Setup

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/pet-care-log.git
cd pet-care-log
```

### 2. Set up the database
Open MySQL and run:
```bash
mysql -u root -p < backend/schema.sql
```

### 3. Configure environment variables
```bash
cd backend
cp .env.example .env
# Edit .env with your MySQL credentials
```

### 4. Install and run the backend
```bash
cd backend
npm install
npm start
```

### 5. Open the frontend
Just open `frontend/index.html` in your browser.
> Make sure `API_URL` in `app.js` points to `http://localhost:3000`

---

## 🚀 Deployment

| Component | Platform |
|---|---|
| Frontend  | [Vercel](https://vercel.com) |
| Backend   | [Railway](https://railway.app) |
| Database  | Railway (MySQL plugin) |

### Deploy Backend on Railway
1. Create account at railway.app
2. New Project → Deploy from GitHub repo
3. Select your repo, set root directory to `/backend`
4. Add a MySQL plugin in Railway
5. Set environment variables:
   - `PORT`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`
6. Railway auto-provides these when you link the MySQL plugin
7. Copy your Railway public URL

### Deploy Frontend on Vercel
1. Create account at vercel.com
2. Import your GitHub repo
3. Set root directory to `/frontend`
4. Update `API_URL` in `app.js` to your Railway backend URL
5. Deploy!

---

## 🌐 Live URLs
- **Frontend:** https://petcare-seven-omega.vercel.app/
- **Backend API:** https://petcare-production-39a3.up.railway.app/

---

## 📡 API Endpoints

### Pets
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/pets` | Get all pets |
| GET | `/api/pets/:id` | Get single pet |
| POST | `/api/pets` | Create pet |
| PUT | `/api/pets/:id` | Update pet |
| DELETE | `/api/pets/:id` | Delete pet |

### Logs
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/logs/:petId` | Get logs for a pet |
| POST | `/api/logs` | Create log entry |
| DELETE | `/api/logs/:id` | Delete log entry |
