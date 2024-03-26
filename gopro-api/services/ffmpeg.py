import subprocess
import os
from utils.logger import logger


class FfmpegService:
    video_process: subprocess.Popen = None
    audio_process: subprocess.Popen = None
    audio_counter: int = 0

    def __init__(self):
        pass

    def convert_udp_stream_to_hls_and_capture_frames(
        self, port, output_dir_stream, output_dir_llm_frames
    ):
        udp_url = f"udp://0.0.0.0:{port}"
        command = [
            "ffmpeg",
            "-y",
            "-i",
            udp_url,
            "-codec:",
            "copy",
            "-an",
            "-start_number",
            "0",
            "-hls_time",
            "10",
            "-hls_list_size",
            "0",
            "-f",
            "hls",
            f"{output_dir_stream}/video/output.m3u8",
            "-vf",
            "fps=1/5,scale=640:-1,eq=brightness=0.06",
            "-update",
            "1",
            f"{output_dir_llm_frames}/llm_frame.jpg",
        ]
        self.video_process = subprocess.Popen(command)

    def create_hls_audio_stream(self, input_file, output_dir: str):
        logger.info(f"Creating audio stream from {input_file}")

        command = [
            "ffmpeg",
            "-i",
            input_file,
            "-c:a",
            "copy",
            "-hls_time",
            "10",
            "-hls_list_size",
            "0",
            "-hls_flags",
            "append_list+omit_endlist",
            "-start_number",
            str(self.audio_counter),
            "-hls_segment_filename",
            f"{output_dir}/audio/output%d.ts",
            f"{output_dir}/audio/output.m3u8",
        ]

        self.audio_process = subprocess.Popen(command)
        self.audio_counter += 1
