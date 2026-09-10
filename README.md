# Mini CRM (MERN Stack)

A small CRM app to manage customers/leads: MongoDB + Express + React + Node.js.

## Project structure

```
mern-crm/
  backend/     Express API + Mongoose models
  frontend/    React app (Vite)
```

## Features
- List, add, edit, delete customers
- Fields: name, email, phone, company, status (lead/active/inactive), notes

---

## 1. Connect to MongoDB

You have two options: a **local** MongoDB or **MongoDB Atlas** (free cloud database, easiest for beginners).

### Option A: MongoDB Atlas (recommended)
1. Go to https://www.mongodb.com/cloud/atlas/register and create a free account.
2. Create a free cluster (M0).
3. Under **Database Access**, create a database user with a username/password.
4. Under **Network Access**, add your IP address (or `0.0.0.0/0` to allow access from anywhere, fine for development).
5. Click **Connect** on your cluster → **Drivers** → copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@<cluster-url>/?retryWrites=true&w=majority
   ```
6. Add your database name into the string, e.g. `.../mern_crm?retryWrites=true...`

### Option B: Local MongoDB
1. Install MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Start the MongoDB service (`mongod`).
3. Your connection string will be:
   ```
   mongodb://127.0.0.1:27017/mern_crm
   ```

### Set the connection string
In `backend/`, copy `.env.example` to `.env`:
```bash
cd backend
cp .env.example .env
```
Open `.env` and paste your connection string into `MONGODB_URI`:
```
MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/mern_crm?retryWrites=true&w=majority
PORT=5000
```

---

## 2. Run the backend

```bash
cd backend
npm install
npm run dev
```

You should see:
```
Connected to MongoDB
Server running on port 5000
```

For the Vercel deployment, add `MONGODB_URI` in the Vercel project settings
under **Settings > Environment Variables** for the **Production** environment,
then redeploy. In MongoDB Atlas, add `0.0.0.0/0` under **Network Access** for
development deployments and URL-encode special characters in the database
password.

Set `JWT_SECRET` to a different long random value in both local `.env` and
Vercel Production environment variables.

### Authentication and roles

The first account is created with `POST /api/auth/register` and becomes an
admin. After that, only an admin can create users through the User Management
section or `POST /api/auth/users`. Sign in at the CRM screen to receive a
token. The roles are `admin`, `sales_manager`, and `staff`; API permissions
are enforced with `401` for missing/invalid tokens and `403` for insufficient
roles.

Test it: open http://localhost:5000 in your browser — you should see "MERN CRM API is running".

## 3. Run the frontend

In a new terminal:
```bash
cd frontend
npm install
npm run dev
```

Open the URL shown (usually http://localhost:5173). You should see the CRM UI, and it will talk to the API at `http://localhost:5000/api` (configured in `frontend/src/api.js`).

---

## API endpoints (backend)

| Method | Route                 | Description          |
|--------|------------------------|-----------------------|
| GET    | /api/customers         | List all customers    |
| GET    | /api/customers/:id     | Get one customer      |
| POST   | /api/customers         | Create a customer     |
| PUT    | /api/customers/:id     | Update a customer     |
| DELETE | /api/customers/:id     | Delete a customer     |

---

## Troubleshooting

- **"MONGODB_URI is not set"** → you forgot to create `backend/.env` from `.env.example`.
- **MongoDB connection error / auth failed** → check your username/password in the connection string (avoid special characters in the password, or URL-encode them), and make sure your IP is whitelisted in Atlas Network Access.
- **Frontend can't reach backend / network error** → make sure the backend is running on port 5000, and check `frontend/src/api.js` has the right `API_BASE_URL`.
- **CORS errors** → the backend already has `cors()` enabled for all origins, so this shouldn't happen in dev.

## Next steps / ideas to extend
- Add authentication (JWT) so each user only sees their own customers
- Add pagination/search/filter on the customer list
- Add deal/pipeline tracking, activity timeline, or file attachments
- Deploy backend (Render/Railway) and frontend (Vercel/Netlify), pointing `API_BASE_URL` at the deployed backend URL
