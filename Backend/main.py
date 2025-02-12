# backend/main.py
import math
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import shutil
import whisper
import os

app = FastAPI()

# List your allowed origins (e.g., your React dev server)
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # or allow all origins by using ["*"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the Whisper model (choose the size appropriate for your use case)
model = whisper.load_model("tiny") # models: tiny, base, medium, large, turbo

def seconds_to_srt_timestamp(seconds: float) -> str:
    """Convert seconds to SRT timestamp format: HH:MM:SS,ms"""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    milliseconds = int((seconds - int(seconds)) * 1000)
    return f"{hours:02}:{minutes:02}:{secs:02},{milliseconds:03}"

def generate_srt_content(segments: list) -> str:
    """Generate SRT formatted text from Whisper segments."""
    srt_lines = []
    for index, segment in enumerate(segments, start=1):
        start_ts = seconds_to_srt_timestamp(segment["start"])
        end_ts = seconds_to_srt_timestamp(segment["end"])
        text = segment["text"].strip()
        srt_lines.append(f"{index}")
        srt_lines.append(f"{start_ts} --> {end_ts}")
        srt_lines.append(text)
        srt_lines.append("")  # Blank line after each subtitle
    return "\n".join(srt_lines)

@app.post("/transcribe")
async def transcribe(
    file: UploadFile = File(...),
    translate: bool = Form(False),
    target_lang: str = Form("en")
):
    # Save the uploaded file to disk (you may want to generate a unique name)
    temp_file_path = "temp_input"
    with open(temp_file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Choose the task: either transcription or translation
    task = "translate" if translate else "transcribe"
    # Whisper accepts parameters such as language if needed.
    result = model.transcribe(temp_file_path, task=task, language=target_lang)

    # Remove the temporary file if desired
    os.remove(temp_file_path)

    # Generate SRT content from the segments
    srt_content = generate_srt_content(result.get("segments", []))
    # You can return the SRT content directly or write it to a file and provide a download URL.
    return {
        "transcription": result.get("text", ""),
        "srt": srt_content
    }
