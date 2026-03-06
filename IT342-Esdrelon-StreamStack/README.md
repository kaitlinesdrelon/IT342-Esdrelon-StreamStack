# StreamStack — Phase 1 Documentation

IT342-G5 | Systems Integration and Architecture 1

## Phase 1 Checklist

- [x] User Registration (name, email, password)
- [x] Input validation (client + server side)
- [x] Duplicate email prevention (409 Conflict)
- [x] Password hashing with BCrypt (strength 12)
- [x] User Login with JWT token response
- [x] Protected routes (web + mobile)
- [x] PostgreSQL `users` table via JPA
- [x] React web frontend (Register, Login, Dashboard)
- [x] Kotlin Android app (Register, Login, Dashboard)

---

## Database Setup

```sql
-- Create the database
CREATE DATABASE streamstack;

-- The users table is auto-created by Hibernate (ddl-auto=update)
-- Final schema:
CREATE TABLE users (
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(255)        NOT NULL,
    email      VARCHAR(255) UNIQUE NOT NULL,
    password   VARCHAR(255)        NOT NULL,
    role       VARCHAR(50)         NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP           NOT NULL
);
```

---

## API Reference

| Method | Endpoint             | Auth | Description          |
|--------|----------------------|------|----------------------|
| POST   | /api/auth/register   | No   | Create new account   |
| POST   | /api/auth/login      | No   | Login, returns JWT   |
| POST   | /api/auth/logout     | Yes  | Logout (stateless)   |
| GET    | /api/health          | No   | Health check         |

### Register — Sample Request
```json
POST /api/auth/register
{
  "name": "Mary Kaitlin",
  "email": "mary@example.com",
  "password": "Secret123",
  "confirmPassword": "Secret123"
}
```

### Login — Sample Request
```json
POST /api/auth/login
{
  "email": "mary@example.com",
  "password": "Secret123"
}
```

### Success Response
```json
{
  "success": true,
  "data": {
    "user": { "id": 1, "name": "Mary Kaitlin", "email": "mary@example.com", "role": "USER" },
    "token": "eyJhbGciOiJIUzI1NiJ9..."
  },
  "error": null,
  "timestamp": "2026-02-20T10:00:00Z"
}
```

---

## GitHub Commit Instructions

```bash
git init
git add .
git checkout -b branch_name     //for new branch 
git commit -m "IT342 Phase 1 - User Registration and Login Completed"
git branch -M main
git remote add origin https://github.com/<your-username>/StreamStack.git
git push -u origin main
```


```how to commit in a different repo
git branch
git checkout -b feature-name
git checkout main //if you want to go back to main
git add .
git commit -m "Comment"
git push origin <branch-name>
```


```if it has error : fatal: not a git repository (or any of the parent directories): .git
git init
git remote add origin https://github.com/kaitlinesdrelon/IT342-Esdrelon-StreamStack.git
git add .
git commit -m "Initial commit - project setup".
git push -u origin main
```


``` if it has this error : fatal: 'origin' does not appear to be a git repository [fatal: Could not read from remote repository.]
git remote add origin https://github.com/kaitlinesdrelon/IT342-Esdrelon-StreamStack.git
git remote -v
git push origin <branch-name>
```