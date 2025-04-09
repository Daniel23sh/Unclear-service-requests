from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict
import re

# Import the asynchronous ChatGPT analyzer function from the correct file.
from chatbot_analyzer import identify_problem_and_category_with_chatgpt

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserInput(BaseModel):
    message: str

@app.post("/analyze_chatgpt")
async def analyze_input_chatgpt(user_input: UserInput):
    """
    This endpoint uses the ChatGPT API to analyze the user message asynchronously.
    """
    try:
        result = await identify_problem_and_category_with_chatgpt(user_input.message)
        print (f"ChatGPT analysis result: {result}")
        return result
    except Exception as e:
        return {"error": str(e)}

# Run the server with:
# python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
