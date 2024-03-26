# GOPRO project [IN PROGRESS]

This project offers an innovative solution for streaming and managing video footage from a GoPro camera. Utilizing a custom-built API, users can send commands to start and stop photo and video recordings and manage real-time streaming.

## Key functionalities

GoPro Control API: A flexible API that integrates with the GoPro to controlbasic functions such as starting/stopping recordings and live streaming.
Video Streaming: The API supports converting MPEG-TS packets from the GoProinto HLS format, facilitating video streaming to various devices.
Celery with Redis for Background Processing: Video streaming functionalityis handled through a background worker in Celery with Redis, optimizingserver performance.
Frontend Interface: A simple user interface, developed using Vite, React, TypeScript, and Tailwind CSS.

## Future Potential

Future Potential with LLM Integration:
In the future, the integration of Large Language Models (LLMs) presents an exciting avenue for enhancing this project. Imagine a scenario where the video streams from the GoPro are not only transmitted but also analyzed in real-time by an LLM. For instance, in a sports event, the LLM could provide live commentary by identifying and describing the action as it happens. Alternatively, in an educational context, such as a nature walk, the LLM could identify and provide information about flora and fauna captured by the camera. This level of interaction opens up new possibilities for content creation, where the LLM adds an informative or entertaining layer to the raw video footage, making it more engaging and educational for viewers.

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
