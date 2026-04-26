import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import instructor
from openai import OpenAI

# Initialize FastAPI
app = FastAPI(title="Local Structured Data Extractor API")

# Enable CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# 1. DEFINE A GENERALIZED DATABASE SCHEMA
# ---------------------------------------------------------
# Since you want to handle *any* messy text, this schema captures universal data points.
class ExtractedEntity(BaseModel):
    entity_name: str = Field(description="The name of the person, organization, concept, or item found.")
    entity_type: str = Field(description="The category (e.g., 'Person', 'Company', 'Date', 'Metric', 'Location').")
    context: str = Field(description="A brief summary of what the text says about this entity.")

class GeneralExtraction(BaseModel):
    contains_extractable_data: bool = Field(description="Set to True if the text contains actual information. Set to False if it is just a greeting (e.g., 'hi'), a single word, or nonsense.")
    type_of_text: str = Field(description="The category of the text (e.g., 'Greeting', 'Question', 'Complaint', 'Gibberish').")
    summary: str = Field(description="A concise summary. If the text is nonsense or a simple greeting, output 'No meaningful content.'")
    sentiment: str = Field(description="The overall tone of the text: 'Positive', 'Negative', or 'Neutral'.")
    key_entities: list[ExtractedEntity] = Field(description="A list of extracted entities. Return an empty list [] if none exist.")
    action_items: list[str] = Field(description="Any tasks or requests. Return an empty list [] if none exist.")

# Request schema for the FastAPI endpoint
class ExtractionRequest(BaseModel):
    raw_text: str

# ---------------------------------------------------------
# 2. INITIALIZE THE LOCAL OLLAMA CLIENT
# ---------------------------------------------------------
# Point the OpenAI client to Ollama's local port.
# Mode.JSON is used here because it is the most reliable way to force local models to output schemas.
client = instructor.from_openai(
    OpenAI(
        base_url="http://localhost:11434/v1",
        api_key="ollama", # The client requires a string here, but Ollama ignores it
    ),
    mode=instructor.Mode.JSON,
)

# ---------------------------------------------------------
# 3. DEFINE THE API ENDPOINT
# ---------------------------------------------------------
@app.post("/extract/general", response_model=GeneralExtraction)
async def extract_data(request: ExtractionRequest):
    try:
        # Pass the request to your local Llama 3.1 model
        extracted_data = client.chat.completions.create(
            model="qwen3.5:9b", 
            response_model=GeneralExtraction,
            messages=[
                {
                    "role": "system", 
                    "content": (
                        "You are a precise data extraction algorithm. Extract structured JSON data according to the schema. "
                        "If the input is conversational filler, a greeting, a general question or nonsensical, set 'contains_extractable_data' to false, "
                        "set the summary to 'No meaningful content.', and return empty lists for entities and action items."
                    )
                },
                {
                    "role": "user", 
                    "content": request.raw_text
                }
            ],
            temperature=0,
        )
        return extracted_data
        
    except Exception as e:
        print(f"Error during extraction: {e}")
        raise HTTPException(status_code=500, detail=str(e))