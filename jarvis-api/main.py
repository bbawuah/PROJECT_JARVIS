import os
import time
from fastapi import FastAPI, Request, HTTPException
from services.gopro import GoProService
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi.staticfiles import StaticFiles
from celery import Celery
from pathlib import Path
from utils.logger import logger
from services.open_ai import OpenAIService
from services.eleven_labs import ElevenLabsService
from services.ffmpeg import FfmpegService


celery_app = Celery("worker", broker="redis://localhost:6379/0")

celery_app.conf.task_routes = {
    "main.tasks.udp_stream": {"queue": "stream_queue"},
    "main.tasks.llm_image_to_text": {"queue": "llm_queue"},
    "main.tasks.generate_audio_stream": {"queue": "audio_stream_queue"},
}

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

# create an OpenAIService instance
openAIService = OpenAIService()

# create an ElevenLabsService instance
elevenLabsService = ElevenLabsService()

ffmpegService = FfmpegService()

video_stream_task = None
llm_image_to_text_result_task = None
audio_stream_task = None


@celery_app.task
def udp_stream():
    goProService.start_stream()


@celery_app.task
def llm_image_to_text():
    while True:
        if Path("llm", "llm_frame.jpg").exists():
            logger.info("Starting image to text conversion...")
            speech_text = openAIService.get_image_to_text_response()
            elevenLabsService.create_audio_file(text=speech_text)
            time.sleep(10)
        else:
            logger.info("Could not find an image to convert...")
            time.sleep(10)


@celery_app.task
def generate_audio_stream():
    time_in_seconds = 15
    while True:
        logger.info(
            "Starting audio stream generation for audio segment eleven_labs_audio%d.mp3"
            % ffmpegService.audio_counter
        )
        if Path(
            "audio", "eleven_labs_audio_%d.mp3" % ffmpegService.audio_counter
        ).exists():
            logger.info("Starting audio stream generation for audio segments...")
            ffmpegService.create_hls_audio_stream(
                input_file="audio/eleven_labs_audio_%d.mp3"
                % ffmpegService.audio_counter,
                output_dir="streaming",
            )
            time.sleep(time_in_seconds)
        else:
            time.sleep(time_in_seconds)
            logger.info(
                "Could not find segment eleven_labs_audio_%d.mp3"
                % ffmpegService.audio_counter
            )


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
        logger.error(f"{e}")
        raise HTTPException(
            status_code=404, detail=str("Error while connecting to GoPro")
        )


@app.get("/is_connected")
def is_connected():
    response = goProService.is_connected()
    return response


@app.get("/get_gopro_data")
async def get_gopro_data():
    try:
        response = await goProService.get_gopro_data()
        return response
    except Exception as e:
        logger.error(f"{e}")
        raise HTTPException(
            status_code=404, detail=str("Error while getting GoPro data")
        )


@app.post("/disconnect")
async def disconnect():
    try:
        response = await goProService.disconnect()
        return response
    except Exception as e:
        logger.error(f"{e}")
        raise HTTPException(
            status_code=404, detail=str("Error while disconnecting from GoPro")
        )


@app.post("/take_photo")
async def take_photo():
    try:
        response = await goProService.take_photo()
        return response
    except Exception as e:
        logger.error(f"{e}")
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
        logger.error(f"{e}")
        raise HTTPException(
            status_code=404, detail=str("Error while taking video with GoPro")
        )


@app.post("/stop_video")
async def stop_video():
    try:
        response = await goProService.stop_video()
        return response
    except Exception as e:
        logger.error(f"{e}")
        raise HTTPException(
            status_code=404, detail=str("Error while stopping video with GoPro")
        )


@app.post("/start_stream")
async def start_stream():
    try:
        global video_stream_task
        global llm_image_to_text_result_task
        global audio_stream_task
        response = await goProService.start_prepare_stream()

        stream_result = udp_stream.delay()
        image_to_text_result = llm_image_to_text.delay()
        audio_stream = generate_audio_stream.delay()

        video_stream_task = stream_result
        llm_image_to_text_result_task = image_to_text_result
        audio_stream_task = audio_stream
        return response
    except Exception as e:
        logger.error(f"{e}")
        raise HTTPException(
            status_code=404, detail=str("Error while starting stream with GoPro")
        )


@app.get("/has_streaming_playlist")
async def has_streaming_playlist():
    if not Path("streaming/video/output.m3u8").exists():
        return {"has_streaming_playlist": False}
    else:
        return {"has_streaming_playlist": True}


@app.get("/has_audio_streaming_playlist")
async def has_streaming_audio_playlist():
    if not Path("streaming/audio/output.m3u8").exists():
        return {"has_streaming_playlist": False}
    else:
        return {"has_streaming_playlist": True}


@app.post("/stop_stream")
async def stop_stream():
    try:
        global video_stream_task
        global llm_image_to_text_result_task
        global audio_stream_task
        response = await goProService.stop_stream()

        if video_stream_task:
            video_stream_task.revoke(terminate=True)
            video_stream_task = None

        if llm_image_to_text_result_task:
            llm_image_to_text_result_task.revoke(terminate=True)
            llm_image_to_text_result_task = None

        if audio_stream_task:
            audio_stream_task.revoke(terminate=True)
            audio_stream_task = None

        return response
    except Exception as e:
        logger.error(f"{e}")
        raise HTTPException(
            status_code=404, detail=str("Error while stopping stream with GoPro")
        )


@app.post("/power_down")
async def power_down():
    try:
        response = await goProService.power_down()
        return response
    except Exception as e:
        logger.error(f"{e}")
        raise HTTPException(
            status_code=404, detail=str("Error while powering down with GoPro")
        )
