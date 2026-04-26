# 🧩 Local Structured Data Extractor API

![Python](https://img.shields.io/badge/Python-3.10%2B-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Framework-009688)
![React](https://img.shields.io/badge/React-UI-61DAFB)
![Ollama](https://img.shields.io/badge/Ollama-Llama_3.1-orange)

A full-stack, privacy-preserving application that transforms messy, unstructured text into clean, strictly typed JSON schemas. This tool utilizes a React frontend and a FastAPI backend powered by the `instructor` library and Pydantic to force a local Large Language Model into returning deterministic data structures every single time.

---

## 📝 Table of Contents

- [Features](#-features)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Running the Application](#-running-the-application)
- [Dependencies](#-dependencies)

---

## ✨ Features

* **100% Local & Private:** Processes all sensitive text data locally on your machine without relying on external cloud APIs like OpenAI. 🔒
* **Guaranteed JSON Schemas:** Uses the `instructor` library to patch the LLM client, enforcing strict adherence to Pydantic models so the output never breaks your app. 🧩
* **Full-Stack Architecture:** Features a robust FastAPI backend for AI processing and a responsive React (Vite) frontend with synchronized Flexbox layouts and a one-click clipboard copy feature. 💻
* **Intelligent Fallbacks:** Built-in "escape hatches" allow the LLM to gracefully handle conversational filler and gibberish without hallucinating fake entities. 🛡️

---

## 📂 Project Structure

* `backend/`
  * `main.py` - The FastAPI server. Defines the Pydantic schemas, initializes the local Ollama client, and handles the extraction endpoint.
  * `requirements.txt` - Python dependencies.
* `frontend/`
  * `src/App.tsx` - The React user interface featuring the dual-pane input/output display.
  * `package.json` - Node.js dependencies and run scripts.

---

## 🛠️ Prerequisites

1. **Python 3.10+**
2. **Node.js & npm** (For the React frontend)
3. **Ollama:** The backend engine to run the Large Language Model locally.

---

## 📥 Installation & Setup

### 1. Backend Setup (Python)
Navigate to the `backend` directory and install the required packages:

```bash
cd backend
python -m venv env
source env/bin/activate   # On Windows: env\Scripts\activate
pip install -r "requirements.txt"
```

### 2. Frontend Setup (React/Vite)
Navigate to the `frontend` directory and install the node modules:

```bash
cd frontend
npm install
```

### 3. Install and Configure Ollama
This project specifically uses Llama 3.1 (8 Billion parameters) for its excellent reasoning and concise schema-following capabilities.

1. Download and install Ollama from ollama.com.
2. Open your terminal or command prompt.
3. Pull the specific Qwen 3.5 model by running the following command:

```bash 
ollama pull qwen3.5:9b
 ````

4. Note: The download is approximately 6.6GB. Once it finishes, Ollama runs automatically in the background as a local host service (defaulting to http://localhost:11434).

---

## 🚀 Running the Application

You will need two terminal windows open to run the full stack simultaneously.

### **Terminal 1: Start the FastAPI Backend**

```bash
cd backend
# Make sure your virtual environment is activated
uvicorn app:app --host 0.0.0.0 --port 6969
```

### **Terminal 2: Start the React Frontend**

```bash
cd frontend
npm run dev
```

Open the provided Local URL in your browser (usually http://localhost:5173). Paste some messy text into the top text box, click Extract Data, and watch the perfectly structured JSON appear on the bottom!

---

## 📦 Dependencies
* Python 3.10+
* Node.js
* FastAPI & Uvicorn
* React (Vite)
* Pydantic
* Instructor
* Ollama (qwen3.5:9b)

---