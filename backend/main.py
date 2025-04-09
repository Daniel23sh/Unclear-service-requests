from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import mysql.connector

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Correct MySQL connection config
db_config = {
    "host": "database-1.c41c0cegyp3p.us-east-1.rds.amazonaws.com",
    "port": 3306,
    "user": "admin",  # ⬅️ change this
    "password": "12345678",  # ⬅️ change this
    "database": "handyman_service",
}

# ✅ Data model for handyman
class Handyman(BaseModel):
    first_name: str
    last_name: str
    phone: str
    profession: str
    city: str
    email: str
    password: str

# ✅ Register endpoint using table: proffesionals
@app.post("/register")
def register_handyman(data: Handyman):
    try:
        print("📥 Received registration:", data.dict())

        conn = mysql.connector.connect(**db_config)
        print("✅ Connected to DB")
        cursor = conn.cursor()

        query = """
            INSERT INTO professionals (first_name, last_name, phone, specialization, city, email, password)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        values = (
            data.first_name,
            data.last_name,
            data.phone,
            data.profession,
            data.city,
            data.email,
            data.password
        )

        print("🧾 Executing SQL with values:", values)
        cursor.execute(query, values)
        conn.commit()
        cursor.close()
        conn.close()

        print("✅ Registered handyman:", values)
        return {"message": "Handyman registered successfully"}

    except mysql.connector.Error as err:
        print("❌ MySQL Error:", err)
        raise HTTPException(status_code=500, detail=f"MySQL error: {err}")

    except Exception as e:
        print("❌ Server Error:", e)
        raise HTTPException(status_code=500, detail=f"Server error: {e}")
