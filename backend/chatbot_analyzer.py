import openai
import json
import re
from typing import Dict

openai.api_key = os.environ.get("OPENAI_API_KEY")

async def translate_to_english(text: str) -> str:
    """
    If the input is in Hebrew, translate it to English.
    """
    resp = await openai.ChatCompletion.acreate(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a translator. Translate Hebrew to English only."},
            {"role": "user", "content": text}
        ],
        temperature=0.0,
        max_tokens=200
    )
    return resp.choices[0].message.content.strip()

async def identify_problem_and_category_with_chatgpt(message: str) -> Dict:
    """
    Analyze a handyman service user message using the ChatGPT API.
    If the message is in Hebrew, translate it first.
    """
    original = message

    # 1. Detect Hebrew
    if re.search(r'[\u0590-\u05FF]', message):
        message = await translate_to_english(message)

    # 2. Build analysis prompt (always in English)
    prompt = f"""
You are an expert at understanding user issues related to handyman services. Analyze the following English user message and return EXACTLY a JSON object with no extra text.

Original user message (for JSON.user_input): "{original}"

Message to analyze (in English): "{message}"

Output JSON with these keys:
- user_input: the original user message (in its original language)
- identified_problem: concise description of the main problem
- problem_category: one of "plumbing", "electrical", "carpentry", or "unknown"
- clarification_needed: true if problem_category is "unknown", otherwise false
"""

    try:
        response = await openai.ChatCompletion.acreate(
            model="gpt-3.5-turbo",  # or gpt-4 if available
            messages=[{"role": "user", "content": prompt}],
            temperature=0.0,
            max_tokens=200
        )
        output = response.choices[0].message.content.strip()
        return json.loads(output)

    except Exception as e:
        raise Exception("Error processing message with ChatGPT: " + str(e))
