import os
from elevenlabs import Voice
from elevenlabs.client import ElevenLabs
from utils.logger import logger

eleven_labs_api_key = os.environ["ELEVEN_LABS_API_KEY"]

client = ElevenLabs(api_key=eleven_labs_api_key)


class ElevenLabsService:
    counter: int = 0

    def write_audio_to_file(self, audio_stream, output_file_prefix: str):
        output_file = f"{output_file_prefix}_%d.mp3" % self.counter
        logger.info(f"Writing audio to file {output_file}")
        with open(output_file, "wb") as audio_file:
            for chunk in audio_stream:
                audio_file.write(chunk)
        self.counter += 1
        return output_file

    def create_audio_file(self, text: str):
        audio = client.generate(
            text=text,
            voice=Voice(voice_id="TrCDMGfxJKuRlflPn7Vo"),
            model="eleven_monolingual_v1",
            stream=True,
        )

        self.write_audio_to_file(audio, "audio/eleven_labs_audio")

        logger.info(f"Audio stream created {audio}")
