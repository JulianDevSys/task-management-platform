<p align="center">
  <a href="https://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
</p>

<h1 align="center">🧩 Task Management Platform</h1>
<p align="center">
  Scalable backend system for managing tasks, organizations, and members — built with <strong>NestJS</strong>, <strong>TypeORM</strong>, and <strong>PostgreSQL</strong>.
</p>

---

## 🚀 Overview
This project is a **backend platform inspired by Jira**, designed to manage tasks, organizations, and users with role‑based access control (RBAC).  
It implements **authentication**, **authorization**, **filters**, **notifications**, and **transactional operations** to ensure data consistency and scalability.

---

## 🧠 Key Features
- **Authentication & Authorization:** JWT + Refresh Tokens, Role‑Based Access Control (RBAC).  
- **Organizations & Members:** Create organizations, manage memberships, and invitations.  
- **Tasks & Comments:** CRUD operations with filters, pagination, relational queries, and threaded comments.  
- **File Management:** Upload and download files linked to tasks or organizations.  
- **Notifications:** Real‑time notifications via WebSockets/Redis PubSub.  
- **Security:** Guards, Interceptors, Exception Filters.  
- **Documentation:** Swagger/OpenAPI integration.  
- **Testing:** Jest + Supertest (unit, integration, and e2e).  
- **Infrastructure:** Dockerized PostgreSQL + Redis, CI/CD with GitHub Actions.  
- **Scalability:** Modular architecture following SOLID and Clean Architecture principles.

---

## 🧩 Tech Stack
| Layer | Technologies |
|-------|---------------|
| **Backend Framework** | NestJS (TypeScript) |
| **Database** | PostgreSQL + TypeORM |
| **Cache & Pub/Sub** | Redis |
| **Authentication** | JWT, Refresh Tokens |
| **File Handling** | Multer / Streams |
| **Notifications** | WebSockets + Redis |
| **Testing** | Jest, Supertest |
| **DevOps** | Docker, GitHub Actions, AWS |
| **Documentation** | Swagger / OpenAPI |

---

## ⚙️ Installation
```bash
# Clone repository
$ git clone https://github.com/tuusuario/task-management-platform.git

# Install dependencies
$ npm install

# Run development mode
$ npm run start:dev
