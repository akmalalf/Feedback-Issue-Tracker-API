
# Feedback & Issue Tracker API

RESTful API untuk mengelola feedback dan issue, dibangun dengan **Node.js + Express**, **MongoDB (Mongoose)**, dan **Firebase Storage**.  
Project ini ditujukan sebagai latihan dummy backend agar mendekati standar enterprise (dengan validasi, error handler global, Swagger docs, CI, dll).

---

## 🚀 Tech Stack
- **Backend**: Node.js, Express
- **Database**: MongoDB (Mongoose)
- **Storage**: Firebase Storage (untuk upload screenshot)
- **Auth**: JWT (JSON Web Token)
- **Validation**: Zod
- **Security**: Helmet, CORS whitelist, Rate Limit
- **Docs**: Swagger UI (OpenAPI 3.0)
- **Testing**: Jest + Supertest
- **CI/CD**: GitHub Actions

---

## ⚙️ Quick Start

### 1. Clone repo
```bash
git clone https://github.com/akmalalf/Feedback-Issue-Tracker-API.git
cd Feedback-Issue-Tracker-API
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Buat file `.env` (atau copy dari `.env.example`):

```env
PORT=4000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/feedback
JWT_SECRET=supersecret
FIREBASE_STORAGE_BUCKET=your-bucket-name
```

### 4. Run development server

```bash
npm run dev
```

Akses:

* API: [http://localhost:4000](http://localhost:4000)
* Health check: [http://localhost:4000/healthz](http://localhost:4000/healthz)
* Swagger docs: [http://localhost:4000/docs](http://localhost:4000/docs)

---

## 🔑 Authentication

Gunakan **Bearer Token** setelah login/register.
Tambahkan header berikut pada request ke endpoint yang butuh proteksi:

```
Authorization: Bearer <your-jwt-token>
```

---

## 📌 API Endpoints

### Auth

* `POST /api/auth/register` → register user
* `POST /api/auth/login` → login & dapatkan JWT

### Feedback

* `GET /api/feedback` → list feedback (query: `page`, `limit`, `status`, `priority`, `q`, `sort`)
* `POST /api/feedback` → buat feedback baru
* `GET /api/feedback/:id` → detail feedback
* `PATCH /api/feedback/:id` → update feedback (title/description/priority)
* `PATCH /api/feedback/:id/status` → update status (admin only: `open`, `in_progress`, `resolved`)

### Upload

* `POST /api/feedback/:id/attachments` → upload screenshot (PNG/JPEG/WEBP, max 2MB)

### Utility

* `GET /healthz` → health check API
* `GET /docs` → dokumentasi Swagger UI

---

## 📖 Swagger Docs

Swagger UI tersedia di:

👉 [http://localhost:4000/docs](http://localhost:4000/docs)

Contoh tampilan: endpoint list feedback dengan query param (`page`, `limit`, `status`, `priority`, `q`, `sort`).

---

## 🧪 Testing

Jalankan test dengan:

```bash
npm test
```

Contoh test yang tersedia:

* `GET /healthz` → harus return `{ status: "ok" }`
* Protected route tanpa token → harus return 401

---

## 🤖 CI/CD

### CI (Continuous Integration)

* Workflow **ci.yml**: jalan di setiap push/PR.
* Step: install → lint → test.

### CD (Continuous Deployment)

* Workflow **deploy.yml** (opsional): jalankan deploy ke environment (misalnya Render / App Engine) hanya di branch `main`.

---

## 🔒 Security

* **Helmet**: proteksi header HTTP
* **CORS whitelist**: hanya izinkan origin tertentu
* **Rate limiting**: batasi 300 request / 15 menit / IP
* **Upload hardening**: hanya file gambar <2MB
* **JWT Expiry**: token memiliki masa berlaku

---

## 🗂️ Project Structure

```
src/
├─ app.js               # entrypoint express
├─ routes/              # definisi route (auth, feedback)
├─ controllers/         # logika bisnis
├─ models/              # mongoose schemas
├─ middlewares/         # auth, validate, errorHandler
├─ validators/          # zod schemas
├─ utils/               # helper
├─ docs/                # swagger config
tests/                  # jest + supertest
```

---

## 👤 Author

Alif Taqiyyuddin Akmal
📧 [akmalalif0910@gmail.com](mailto:akmalalif0910@gmail.com)
🔗 [LinkedIn](https://www.linkedin.com/in/alif-taqiyyuddin-akmal-2549ba135/)

---
