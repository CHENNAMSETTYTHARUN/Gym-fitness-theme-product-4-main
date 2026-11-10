import hashlib
import sqlite3
import time
from pathlib import Path
from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

app = FastAPI(title="Stackly Fitness Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = Path(__file__).resolve().parent / "database.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT NOT NULL,
            password TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

init_db()

class SignupData(BaseModel):
    name: str
    email: str
    phone: str
    password: str
    confirmPassword: Optional[str] = None
    terms: Optional[bool] = True

class LoginData(BaseModel):
    email: str
    password: str
    remember: Optional[bool] = False

def check_password(entered: str, stored: str) -> bool:
    if entered == stored:
        return True
    if hashlib.sha256(entered.encode()).hexdigest() == stored:
        return True
    return False

@app.post("/api/signup", status_code=201)
@app.post("/signup", status_code=201)
def signup(data: SignupData):
    email = data.email.strip().lower()
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=409, detail="This email is already registered. Please log in.")

    user_id = f"user_{int(time.time() * 1000)}"
    cursor.execute(
        "INSERT INTO users (id, name, email, phone, password) VALUES (?, ?, ?, ?, ?)",
        (user_id, data.name.strip(), email, data.phone.strip(), data.password)
    )
    conn.commit()
    conn.close()

    return {
        "success": True,
        "message": "Account created successfully! Please log in.",
        "user": {"id": user_id, "name": data.name.strip(), "email": email}
    }

@app.post("/api/login")
@app.post("/login")
def login(data: LoginData):
    email = data.email.strip().lower()
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, email, password FROM users WHERE email = ?", (email,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="No account found with this email. Please sign up first.")

    user_id, name, user_email, stored_password = row
    if not check_password(data.password, stored_password):
        raise HTTPException(status_code=401, detail="Incorrect password. Please try again.")

    return {
        "success": True,
        "message": f"Welcome back, {name}!",
        "user": {"id": user_id, "name": name, "email": user_email}
    }

@app.post("/api/logout")
@app.get("/api/logout")
@app.post("/logout")
@app.get("/logout")
def logout():
    return {"success": True, "message": "Successfully logged out."}

@app.get("/api/users")
def get_users():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, email, phone FROM users")
    users = [{"id": r[0], "name": r[1], "email": r[2], "phone": r[3]} for r in cursor.fetchall()]
    conn.close()
    return users

@app.get("/api/health")
def health():
    return {"status": "ok"}

candidate_dirs = [
    Path(__file__).resolve().parent.parent / "gym-fitness-theme-product-4-main",
    Path(__file__).resolve().parent / "gym-fitness-theme-product-4-main",
    Path(__file__).resolve().parent.parent,
    Path.cwd() / "gym-fitness-theme-product-4-main",
    Path.cwd(),
]
for candidate in candidate_dirs:
    if (candidate / "index.html").exists():
        app.mount("/", StaticFiles(directory=str(candidate), html=True), name="frontend")
        break

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
