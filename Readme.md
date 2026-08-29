# RescueMeals

**A full-stack platform for community contribution, coordination, and resource management.**

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)
![AngularJS](https://img.shields.io/badge/AngularJS-E23237?style=flat-square&logo=angularjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Passport.js](https://img.shields.io/badge/Passport.js-34E27A?style=flat-square&logo=passport&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=flat-square&logo=jsonwebtokens&logoColor=white)

---

## 📌 Overview

RescueMeals is a full-stack web application built to help communities organize, share, and manage resources more effectively. It provides structured workflows for contributing, coordinating, and tracking shared resources among users, backed by secure authentication and account management.

The platform is implemented as a complete client-server application: a **Node.js and Express.js** backend handles data, business logic, and authentication, while a dynamic **AngularJS** single-page frontend delivers the user-facing experience. Together, they support protected access to application resources, structured data validation, and automated email notifications for account-related workflows.

---

## 🚀 Key Features

### 🔐 Secure Authentication & Session Management
- JSON Web Token (JWT) based authentication
- Passport.js authentication strategies
- Google OAuth login support
- Local (username/password) authentication strategy
- Protected application resources and session handling

### 🧭 Dynamic Client & Server Routing
- AngularJS client-side routing and UI states
- Server-side routing built with Express.js
- Protected RESTful API access
- Clear separation between frontend and backend routing logic

### 📧 Automated Email Notifications
- Nodemailer integration for transactional email workflows
- Account verification emails
- Password recovery emails
- Confirmation-related email flows

### 🛡️ Data Validation
- Mongoose schema validation across data models
- Helps maintain data integrity
- Structured, consistent database records

### ⚙️ Middleware & Server Management
- HTTP request logging via Morgan
- Session management using Express-Session
- Centralized authentication middleware
- Structured request handling across the backend

---

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| **Frontend** | AngularJS, HTML5, CSS3, Bootstrap 4, JavaScript (ES6+) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Authentication** | Passport.js, JWT, Google OAuth, Local Strategy |
| **Email** | Nodemailer |
| **Middleware & Utilities** | Morgan, Express-Session |

---

## 📁 Project Architecture

```text
RescueMeals/
│
├── app.js               # Application entry point and server configuration
│
├── models/              # Mongoose database schemas and models
│
├── routes/              # Express API route handlers and endpoints
│
├── helpers/             # Utility functions and shared modules
│
├── passport/            # Authentication strategies and session configuration
│
└── public/              # Frontend source files
    │
    ├── app/
    │   ├── views/       # AngularJS HTML template views
    │   ├── services/    # HTTP wrappers and authentication services
    │   └── routes.js    # Client-side routing configuration
    │
    └── css/             # Custom stylesheets and styling
```

**Directory responsibilities:**

- **`app.js`** — Application entry point; configures and starts the Express server.
- **`models/`** — Mongoose schemas and models that define the application's data structures.
- **`routes/`** — Express route handlers that define API endpoints and connect them to backend logic.
- **`helpers/`** — Shared utility functions used across the backend.
- **`passport/`** — Passport.js authentication strategy configuration and session handling.
- **`public/`** — Frontend source code, including:
  - `app/views/` — AngularJS HTML template views
  - `app/services/` — HTTP wrappers and authentication services
  - `app/routes.js` — Client-side routing configuration
  - `css/` — Custom stylesheets and styling

---

## 🔄 How RescueMeals Works

1. A user accesses the RescueMeals application.
2. The user authenticates using one of the supported authentication workflows (JWT, Passport.js local strategy, or Google OAuth).
3. Authentication and authorization mechanisms protect the appropriate application resources.
4. The AngularJS frontend communicates with backend APIs.
5. The Express.js backend processes incoming requests.
6. Mongoose handles database models, queries, and schema validation.
7. Relevant transactional email workflows (e.g., account verification, password recovery) can be triggered via Nodemailer.
8. The frontend displays and manages application data dynamically for the user.

---

## 🔒 Authentication & Security

RescueMeals implements several layers of authentication and access control:

- **JWT-based authentication** — issues and validates JSON Web Tokens for authenticated requests.
- **Passport.js strategies** — handles authentication logic in a modular, pluggable way.
- **Google OAuth** — allows users to sign in with their Google account.
- **Local authentication strategy** — supports traditional username/password login.
- **Protected routes** — restricts access to certain resources based on authentication state.
- **Mongoose validation** — enforces data integrity at the model level.
- **Environment variables** — sensitive credentials (API keys, secrets, connection strings) are kept out of source code and managed through environment configuration.

> The application includes authentication and validation mechanisms designed to help protect application resources. This should not be interpreted as a claim of complete or production-grade security.

---

## 💻 Installation & Local Setup

**Prerequisites:** Node.js and npm, and access to a MongoDB instance (local or hosted).

### 1. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd RescueMeals
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Sensitive credentials should never be hardcoded. Create a `.env` file in the project root using the template below:

```env
PORT=

MONGODB_URI=

JWT_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

EMAIL_USER=
EMAIL_PASSWORD=
```

### 4. Start MongoDB

Ensure MongoDB is running and accessible, and that the connection string matches `MONGODB_URI`.

### 5. Run the Application

```bash
npm start
```

> If the repository uses a different script name, check `package.json` and run the appropriate command.

---

## 🏗️ Backend Architecture

The backend is built around Express.js, which handles server-side routing and request processing. Key components include:

- **Route modules** (`routes/`) organize API logic by feature area.
- **Mongoose models** (`models/`) manage how data is structured, validated, and persisted in MongoDB.
- **Middleware** handles cross-cutting concerns such as request logging (Morgan) and session management (Express-Session).
- **Passport.js** manages authentication strategies, including local and Google OAuth.
- **JWT** supports token-based authenticated access to protected resources.
- **Nodemailer** handles transactional email delivery for flows such as account verification and password recovery.

---

## 🗄️ Data Management & Validation

- **MongoDB** serves as the primary data store for the application.
- **Mongoose** provides schema-based data modeling on top of MongoDB.
- Schema-level validation helps maintain structured, consistent, and valid records across the application's data models.

---

## 🔮 Future Improvements

The items below are potential directions for future development — not existing features:

- Improved analytics and dashboards
- Enhanced resource tracking
- Additional authentication providers
- Improved accessibility
- Automated testing
- API documentation
- Deployment configuration
- Improved notification preferences
- Enhanced responsive UI

---

## 🤝 Contributing

Contributions are welcome. To contribute:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -m "Add your message"`).
5. Push the branch (`git push origin feature/your-feature-name`).
6. Open a Pull Request.

---

## 📄 License

This project does not currently specify a license. Consider adding a `LICENSE` file (e.g., MIT, Apache 2.0) to define how others may use, modify, or distribute this code.

---

## 👤 Author

```
Name: Your Name
GitHub: Your GitHub Profile
```
