from fastapi import FastAPI, Request, HTTPException
import os
from services.gopro import GoProService
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi.staticfiles import StaticFiles
from celery import Celery
from pathlib import Path
from utils.logger import logger

celery_app = Celery("worker", broker="redis://localhost:6379/0")

# Add CORS middleware origins
origins = [
    "http://localhost",
    "http://localhost:3000",
]

# Set the locale to English (for GoPro api)
os.environ["LANG"] = "en_US"

app = FastAPI()

app.mount("/streaming", StaticFiles(directory="streaming"), name="streaming")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create a GoProService instance
goProService = GoProService()
# "GoPro 4127"

async_result = None


@celery_app.task
def udp_stream():
    goProService.start_stream()


@app.get("/")
def read_root():
    return {"GoProAPI": "By LABBAWUAH"}


@app.post("/connect")
async def connect(request: Request):
    try:
        body = await request.json()
        response = await goProService.connect(body["target"])
        return response
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=404, detail=str("Error while connecting to GoPro")
        )


@app.get("/is_connected")
def is_connected():
    response = goProService.is_connected()
    return response


@app.post("/disconnect")
async def disconnect():
    try:
        response = await goProService.disconnect()
        return response
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=404, detail=str("Error while disconnecting from GoPro")
        )


@app.post("/take_photo")
async def take_photo():
    try:
        response = await goProService.take_photo()
        return response
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=404, detail=str("Error while taking photo with GoPro")
        )


@app.get("/photo/{photo_id}")
def get_photo(photo_id: str):
    if not Path(f"photos/100GOPRO/{photo_id}").exists():
        raise HTTPException(status_code=404, detail=f"Photo {photo_id} not found")

    def iter_file(photo_id_inner):
        with open(Path("photos/100GOPRO/", photo_id_inner), mode="rb") as f:
            yield from f

    return StreamingResponse(iter_file(photo_id), media_type="image/jpg")


@app.get("/video/{video_id}")
def get_video(video_id: str):
    if not Path(f"videos/100GOPRO/{video_id}").exists():
        raise HTTPException(status_code=404, detail=f"Video {video_id} not found")

    def iter_file(video_id_inner):
        with open(Path("videos/100GOPRO/", video_id_inner), mode="rb") as f:
            yield from f

    return StreamingResponse(iter_file(video_id), media_type="video/mp4")


@app.post("/take_video")
async def take_video(request: Request):
    try:
        body = await request.json()
        response = await goProService.start_video(body["record_time"])

        return response
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=404, detail=str("Error while taking video with GoPro")
        )


@app.post("/stop_video")
async def stop_video():
    try:
        response = await goProService.stop_video()
        return response
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=404, detail=str("Error while stopping video with GoPro")
        )


@app.post("/start_stream")
async def start_stream():
    try:
        global async_result
        response = await goProService.start_prepare_stream()
        result = udp_stream.delay()
        async_result = result
        return response
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=404, detail=str("Error while starting stream with GoPro")
        )


@app.post("/stop_stream")
async def stop_stream():
    try:
        global async_result
        response = await goProService.stop_stream()

        if async_result:
            async_result.revoke(terminate=True)
            async_result = None

        return response
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=404, detail=str("Error while stopping stream with GoPro")
        )


@app.post("/power_down")
async def power_down():
    try:
        response = await goProService.power_down()
        return response
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=404, detail=str("Error while powering down with GoPro")
        )
