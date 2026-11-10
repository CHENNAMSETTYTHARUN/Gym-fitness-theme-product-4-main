# Stackly Fitness — Modern Gym & Athletic Website

A high-performance, modern gym and athletic fitness web application built with a responsive frontend (HTML5, CSS3, Vanilla JavaScript) and a Python FastAPI backend with SQLite authentication.

---

## 🚀 Features

- **Responsive Multi-Page Frontend**:
  - **Home** (`index.html`): Hero section, training programs, trainer showcase, testimonials, newsletter subscription.
  - **Programs** (`programs.html`): Workout programs and training tiers.
  - **Sports** (`sports.html`): Specialized athletic conditioning and sport categories.
  - **About** (`about.html`): Mission, story, equipment, and facility details.
  - **Login & Signup** (`login.html`, `signup.html`): Account creation and login with form validation and password visibility toggles.
  - **Privacy Policy & Terms of Use** (`privacy-policy.html`, `terms-of-use.html`): Comprehensive legal policies and fitness health disclaimers with scrollspy navigation.
- **FastAPI Backend (`backend/main.py`)**:
  - RESTful authentication endpoints (`/api/signup`, `/api/login`, `/api/logout`, `/api/users`, `/api/health`).
  - SQLite database (`database.db`) with password hashing.
  - Automatically serves all static frontend assets.
  - Dual-mode frontend: works seamlessly with the live FastAPI backend, or standalone with fallback to browser `localStorage`.

---

## 🛠️ Getting Started

### 1. Prerequisites
- Python 3.8 or higher
- Git

### 2. Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/CHENNAMSETTYTHARUN/Gym-fitness-theme-product-4-main.git
cd Gym-fitness-theme-product-4-main
pip install -r requirements.txt
```

### 3. Run Backend & Frontend (Full-Stack Mode)
Run the application using Python:

```bash
python backend/main.py
```

Or using Uvicorn directly from the project root:

```bash
uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

Open your browser and navigate to:
👉 **`http://127.0.0.1:8000`**

Both the frontend pages and backend API endpoints are served together at `http://127.0.0.1:8000`.

### 4. Standalone Frontend (Static Mode)
You can also open `gym-fitness-theme-product-4-main/index.html` directly in any web browser or via VS Code Live Server. The site includes automatic fallback authentication to local storage if the backend server is offline.

---

## 📁 Project Structure

```text
├── backend/
│   ├── database.db          # SQLite database
│   ├── main.py              # FastAPI application & static mount
│   └── requirements.txt     # Backend dependencies
├── gym-fitness-theme-product-4-main/
│   ├── assets/              # Images, icons, and logo assets
│   ├── index.html           # Home page
│   ├── index.css / .js
│   ├── about.html           # About page
│   ├── about.css / .js
│   ├── programs.html        # Programs page
│   ├── programs.css / .js
│   ├── sports.html          # Sports conditioning page
│   ├── sports.css / .js
│   ├── login.html           # Login page
│   ├── login.css / .js
│   ├── signup.html          # Registration page
│   ├── signup.css / .js
│   ├── privacy-policy.html  # Privacy Policy
│   ├── terms-of-use.html    # Terms of Use
│   ├── legal.css            # Legal pages styling
│   ├── common.css           # Global theme, header & footer styles
│   └── common.js            # Shared header, footer, toast & auth handling
├── .gitignore
├── requirements.txt
└── README.md
```

---

## 📄 License
This project is for educational and commercial use under Stackly Fitness.
