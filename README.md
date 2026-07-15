# Student Placement Tracker

A full-stack placement management system built with React (Vite + Tailwind), Spring Boot, and MySQL.

## Tech Stack
- **Frontend:** React (Vite), Tailwind CSS, React Router, Recharts, Axios
- **Backend:** Java 17, Spring Boot 3, Spring Security (JWT), Spring Data JPA
- **Database:** MySQL 8
- **API Testing:** Postman (collection included)
- **Version Control:** Git & GitHub

## Features
- JWT-based admin authentication (login/logout)
- Dashboard with live stats, a placement pipeline visual, and charts
- Student management: add/edit/delete/view, search, filter by branch & CGPA, pagination
- Company management: add/edit/delete
- Placement applications: submit, track, and update status (Applied → Shortlisted → Interview Scheduled → Selected/Rejected)
- Reports: branch-wise and company-wise placement statistics

---

## 1. Database Setup

1. Install MySQL and make sure the server is running.
2. Run the schema:
   ```bash
   mysql -u root -p < database/schema.sql
   ```
   This creates the `placement_tracker` database, all 4 tables, and some sample students/companies/applications for testing.

---

## 2. Backend Setup (Spring Boot)

1. Open `backend/src/main/resources/application.properties` and set your MySQL password:
   ```properties
   spring.datasource.password=YOUR_MYSQL_PASSWORD_HERE
   ```api
2. From the `backend/` folder, run:
   ```bash
   mvn spring-boot:run
   ```
   (or open the folder in IntelliJ/Eclipse and run `PlacementTrackerApplication.java`)
3. On first startup, a default admin account is created automatically:
   - **Username:** `admin`
   - **Password:** `Admin@123`
4. The API is now running at `http://localhost:8080/`.

### Testing the API with Postman
Import `postman/PlacementTracker.postman_collection.json` into Postman. Run the **Login** request first — it automatically saves the JWT token into a collection variable, which every other request then uses automatically.

---

## 3. Frontend Setup (React + Vite)

1. From the `frontend/` folder, install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser and log in with the default admin credentials above.

---

## Project Structure
```
student-placement-tracker/
├── database/
│   └── schema.sql
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/placementtracker/
│       ├── entity/          # JPA entities (Admin, Student, Company, Application)
│       ├── repository/      # Spring Data JPA repositories
│       ├── dto/              # Request/response objects
│       ├── service/          # Business logic
│       ├── controller/       # REST endpoints
│       ├── security/         # JWT filter, util, user details service
│       ├── config/           # Security config, CORS, data seeder
│       └── exception/        # Custom exceptions + global handler
├── frontend/
│   └── src/
│       ├── api/               # Axios client
│       ├── context/           # Auth + Toast context
│       ├── components/        # Reusable UI (Sidebar, DataTable, Modal, etc.)
│       └── pages/              # Login, Dashboard, Students, Companies, Applications, Reports
└── postman/
    └── PlacementTracker.postman_collection.json
```

## Common Errors
| Error | Fix |
|---|---|
| `Communications link failure` on backend startup | MySQL isn't running, or the port/URL in `application.properties` is wrong |
| `Access denied for user 'root'` | Wrong password in `application.properties` |
| Frontend requests fail with a CORS error | Make sure the backend is running on port 8080 and the frontend on port 5173 (matches `SecurityConfig`'s allowed origin) |
| `401 Unauthorized` on every request after login | Token may have expired (default: 24h) — log out and log back in |
| `mvn: command not found` | Install Maven, or use your IDE's built-in run button instead |

## Git & Version Control
```bash
git init
git add .
git commit -m "Initial commit: full-stack placement tracker"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```
Consider adding a `.gitignore` (Java: `target/`, `.idea/`; Node: `node_modules/`, `dist/`) before your first commit.
