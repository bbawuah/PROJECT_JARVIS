from fastapi import FastAPI, Request
import os
from services.gopro import GoProService
from fastapi.middleware.cors import CORSMiddleware
from celery import Celery
import logging

celery_app = Celery('worker', broker='redis://localhost:6379/0')

# Add CORS middleware origins
origins = [
    "http://localhost",
    "http://localhost:3000",
]

# Set the locale to English (for GoPro api)
os.environ['LANG'] = 'en_US' 

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

log =logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger: logging.Logger = logging.getLogger("log")

# Create a GoProService instance
goProService = GoProService() 
# "GoPro 4127"

async_result = None

@celery_app.task
def udp_stream():
    logger.info("running")
    goProService.start_stream()

@app.get("/")
def read_root():
    return {"GoProAPI": "By LABBAWUAH"}

@app.post("/connect")
async def connect(request: Request):
    body = await request.json()
    response = await goProService.connect(body["target"])

    return response

@app.post("/disconnect")
async def disconnect():
    response = await goProService.disconnect()
    return response

@app.post("/take_photo")
async def take_photo():
    response = await goProService.take_photo()
    return response

@app.post("/take_video")
async def take_video(request: Request):
    body = await request.json()
    response = await goProService.start_video(body["record_time"])

    return response

@app.post("/stop_video")
async def stop_video():
    response = await goProService.stop_video()
    return response

@app.post("/start_stream")
async def start_stream():
    global async_result
    response = await goProService.start_prepare_stream()
    result = udp_stream.delay()
    async_result = result
    return response

@app.post("/stop_stream")
async def stop_stream():
    global async_result
    response = await goProService.stop_stream()

    if async_result:
        async_result.revoke(terminate=True)
        async_result = None

    return response

@app.post("/power_down")
async def power_down():
    response = await goProService.power_down()
    return response