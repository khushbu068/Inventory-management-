# Inventory Management Module (MERN)

## Backend
```
cd backend
npm install express mongoose cors dotenv
npm install -D nodemon
npm run seed     # loads the 8 sample materials + test transactions
npm run dev      # http://localhost:5000
```
Edit `.env` if your MongoDB URI differs. Make sure `"type": "module"` is in package.json.

## Frontend (Vite + React + Tailwind v4)
```
cd frontend
npm install react-router-dom
npm install -D tailwindcss @tailwindcss/vite
npm run dev
```
Copy the files into `src/` and replace `vite.config.js`. The dev server proxies `/api` to port 5000.
