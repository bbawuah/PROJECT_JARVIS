# PROJECT_JARVIS

A GoPro that narrates what it sees. Frames from the live stream go to GPT-4 Vision, ElevenLabs turns the description into speech, and that audio is streamed back over HLS next to the video.

Proof of concept, built in March 2024. Not maintained.

This project is a proof of concept that utilizes the power of advanced Artificial Intelligence to extend the capabilities of standard video streaming. By integrating a state-of-the-art Large Language Model (LLM), the application does not just stream video content but enriches it with intelligent analysis in real-time. 

## Key functionalities

GoPro Control API: A flexible API that integrates with the GoPro to control basic functions such as starting/stopping recordings and live streaming.
Video Streaming: The API supports converting MPEG-TS packets from the GoPro into HLS format, facilitating video streaming to various devices.
LLM Integration: Processing frames of the stream and passing it to a LLM `gpt-vision-preview`
TTS: ElevenLabs text-to-speech (Python SDK, `eleven_monolingual_v1`, streamed) turns the model's description into audio, which is sent through HTTP Live Streaming
Celery with Redis for Background Processing: Video streaming functionality is handled through a background worker in Celery with Redis, optimizing server performance.
Frontend Interface: A simple user interface, developed using Vite, React, TypeScript, and Tailwind CSS.

## AI Integration in PROJECT_JARVIS

PROJECT_JARVIS harnesses the power of advanced Artificial Intelligence to extend the capabilities of standard video streaming. By integrating a state-of-the-art Large Language Model (LLM), specifically gpt-4-vision-preview, the application does not just stream video content but enriches it with intelligent analysis in real-time.

### Technical Workflow:

- Utilizing FFMPEG, the server manages the conversion of incoming packets to the appropriate format and handles the periodic frame capture.
- Post-analysis, the AI-generated content is converted to speech with ElevenLabs and delivered as HLS audio, complementing the visual feed.
- Robust background processing is achieved using Celery with Redis, ensuring seamless performance and scalability.

## Technologies Used:

Backend: Python, FastAPI
Frontend: Vite, React, TypeScript, Tailwind CSS
Data Processing: Celery, Redis
Video Processing: FFMPEG/HLS for streaming
AI: OpenAI GPT-4 Vision (image to text), ElevenLabs (text to speech)

## Requirements

- A GoPRO Hero 12
- Python (3.8)
- Nodejs
- Celery
- Redis

Make sure you have [Python](https://www.python.org/downloads/) installed on your computer.
For streaming, the API is running a background worker with Celery and Redis as a broker.
It expects this to be running here [::redis://localhost:6379/0](::redis://localhost:6379/0). If you don't want to use this background worker, you can change the code as you like.

### Installing

#### jarvis-api

This API provides a flexible interface for integrating with GoPro cameras, utilizing a wireless HTTP connection over WiFi. This enables users to effortlessly connect to their GoPro and send various commands, such as starting/stopping recordings and managing live streaming.

```
cd jarvis-api
```

You can start installing the API by running the following command in your terminal:

#### Install the API dependencies

```
pip install -r requirements.txt
```

#### Environment variables

The API reads these at startup:

- `OPEN_AI_API_KEY`
- `ELEVEN_LABS_API_KEY`
- `SSID`, `PASSWORD` (GoPro Wi-Fi)
- `GOPRO_USERNAME`, `GOPRO_PASSWORD`

#### Run the application

This API is using FastAPI as a webserver. To run the app use the following command.

```
uvicorn main:app --reload
```

#### Run Celery background worker
```
celery -A main.celery_app worker --loglevel=INFO
```

### Install the Frontend dependencies

#### Navigate to the project folder jarvis-frontend

```
cd jarvis-frontend
```

#### Install the Frontend dependencies

```
npm install
```

#### Run the Frontend

```
npm run dev
```

## Interesting articles

- [https://gopro.github.io/OpenGoPro/ble/features/cohn.html](https://gopro.github.io/OpenGoPro/ble/features/cohn.html)
- [https://gopro.github.io/OpenGoPro/http#section/Setup](https://gopro.github.io/OpenGoPro/http#section/Setup)
