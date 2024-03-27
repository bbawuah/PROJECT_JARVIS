# GOPRO project [IN PROGRESS]

This project offers an innovative solution for streaming and managing video footage from a GoPro camera. Utilizing a custom-built API, users can send commands to start and stop photo and video recordings and manage real-time streaming.

## Key functionalities

GoPro Control API: A flexible API that integrates with the GoPro to controlbasic functions such as starting/stopping recordings and live streaming.
Video Streaming: The API supports converting MPEG-TS packets from the GoProinto HLS format, facilitating video streaming to various devices.
Celery with Redis for Background Processing: Video streaming functionalityis handled through a background worker in Celery with Redis, optimizingserver performance.
Frontend Interface: A simple user interface, developed using Vite, React, TypeScript, and Tailwind CSS.

## AI Integration in PROJECT_JARVIS

PROJECT_JARVIS harnesses the power of advanced Artificial Intelligence to extend the capabilities of standard video streaming. By integrating a state-of-the-art Large Language Model (LLM), specifically gpt-4-vision-preview, the application does not just stream video content but enriches it with intelligent analysis in real-time.
Real-time Analysis and Interaction:

  - Every frame captured from the GoPro stream is analyzed by the LLM, enabling the detection of complex patterns or items of interest, such as potential hazards or objects resembling weapons.
  - The implementation of this AI extends to providing instant feedback through a Text To Speech (TTS) model trained on my voice, offering a personalized narration of the detected content.

### Educational and Safety Applications:

  - For educational streams, such as nature walks, the LLM can identify and provide information about various flora and fauna, adding an informative layer to the viewing experience.
  - In a sports context, the model can describe actions as they happen, giving viewers a play-by-play commentary.

### Technical Workflow:

  - Utilizing FFMPEG, the server manages the conversion of incoming packets to the appropriate format and handles the periodic frame capture.
  - Post-analysis, the AI-generated content is delivered as audio through the TTS model, complementing the visual feed.
  - Robust background processing is achieved using Celery with Redis, ensuring seamless performance and scalability.

The fusion of real-time AI analysis with action camera technology promises to revolutionize content creation, providing not only security and educational benefits but also an engaging, narrative-driven user experience.

## Technologies Used:

Backend: Custom API
Frontend: Vite, React, TypeScript, Tailwind CSS
Data Processing: Celery, Redis
Video Processing: HLS for streaming

## Requirements

- A GoPRO camera
- Python 3.8
- Nodejs
- Celery
- Redis

Make sure you have [Python](https://www.python.org/downloads/) installed on your computer.
For streaming, the API is running a background worker with Celery and Redis as a broker.
It expects this to be running here [::redis://localhost:6379/0](::redis://localhost:6379/0). If you don't want to use this background worker, you can change the code as you like.

### Installing

#### Gopro-api

This API provides a flexible interface for integrating with GoPro cameras, utilizing a wireless HTTP connection over WiFi. This enables users to effortlessly connect to their GoPro and send various commands, such as starting/stopping recordings and managing live streaming.

```
cd gopro-api
```

You can start installing the API by running the following command in your terminal:

#### Install the API dependencies

```
pip install -r requirements.txt
```

#### Run the application

This API is using FastAPI as a webserver. To run the app use the following command.

```
uvicorn main:app --reload
```

#### Install the Frontend dependencies

#### Navigate to the project folder gopro-frontend

```
cd gopro-frontend
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
