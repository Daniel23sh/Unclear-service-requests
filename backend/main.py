from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import mysql.connector
from chatbot_analyzer import identify_problem_and_category_with_chatgpt

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db_config = {
    "host": "database-1.c41c0cegyp3p.us-east-1.rds.amazonaws.com",
    "port": 3306,
    "user": "admin",
    "password": "12345678",
    "database": "handyman_service",
}

class Handyman(BaseModel):
    first_name: str
    last_name: str
    phone: str
    profession: str
    city: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class UserInput(BaseModel):
    message: str

@app.post("/register")
def register_handyman(data: Handyman):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        # Check for existing email
        cursor.execute("SELECT id FROM professionals WHERE email = %s", (data.email,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Email already exists. Please choose a different one.")
        # Insert new professional
        cursor.execute("""
            INSERT INTO professionals
              (first_name, last_name, phone, specialization, city, email, password)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
            data.first_name,
            data.last_name,
            data.phone,
            data.profession,
            data.city,
            data.email,
            data.password
        ))
        conn.commit()
    finally:
        cursor.close()
        conn.close()
    return {"message": "Handyman registered successfully"}

@app.post("/login")
def login(request: LoginRequest):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        # Look up the user by email
        cursor.execute("""
            SELECT id, first_name, last_name, password
            FROM professionals
            WHERE email = %s
        """, (request.email,))
        user = cursor.fetchone()
        if not user or user["password"] != request.password:
            raise HTTPException(status_code=400, detail="Invalid email or password.")
        # Return a simple success message (you could issue a token here)
        return {
            "message": "Login successful",
            "user": {
                "id": user["id"],
                "first_name": user["first_name"],
                "last_name": user["last_name"]
            }
        }
    finally:
        cursor.close()
        conn.close()

@app.post("/analyze_chatgpt")
async def analyze_input_chatgpt(user_input: UserInput):
    """
    This endpoint uses the ChatGPT API to analyze the user message asynchronously.
    """
    try:
        result = await identify_problem_and_category_with_chatgpt(user_input.message)
        print(f"ChatGPT analysis result: {result}")
        return result
    except Exception as e:
        return {"error": str(e)}

@app.get("/pros")
def get_pros_data():
    """
    This endpoint retrieves the professionals' full name, specialization as category,
    number of reviews, and average rating (ordered by highest average rating).
    """
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        query = """
            SELECT 
                CONCAT(p.first_name, ' ', p.last_name) AS name,
                p.specialization AS category,
                COUNT(r.id) AS number_of_reviews,
                AVG(r.rating) AS average_rating, img_person AS image, price
            FROM professionals p
            LEFT JOIN reviews r ON p.id = r.professional_id
            GROUP BY p.id, p.first_name, p.last_name, p.specialization
            ORDER BY average_rating DESC;
        """
        cursor.execute(query)
        results = cursor.fetchall()
        return {"pros": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

# Run the server with:
# python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
