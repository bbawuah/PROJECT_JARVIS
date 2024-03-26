import base64
import os
from pathlib import Path
from openai import OpenAI
from utils.logger import logger


open_ai_api_key = os.environ["OPEN_AI_API_KEY"]

client = OpenAI(api_key=open_ai_api_key)


class OpenAIService:
    content_analysis: list = []

    def encode_image(self):
        image_path = Path("llm", "llm_frame.jpg")
        with open(image_path, "rb") as image_file:
            image_bytes = image_file.read()
            encoded_image = base64.b64encode(image_bytes).decode("utf-8")
        return encoded_image

    def get_image_to_text_response(self):
        encoded_image = self.encode_image()

        response = client.chat.completions.create(
            model="gpt-4-vision-preview",
            messages=[
                {
                    "role": "system",
                    "content": """
               You work for an elite military unit. Detect anything that could be used as a weapon in the image. 
               Act as if it is a real life scenario. Don't use the word image in your answer.
               Describe how these objects can be used as weapons. Make it educative, fun and short.
               If you don't know what to say, tell me an bible verse or a song about a weapon. 
               Use a maximum of 20 words.
                """,
                },
            ]
            + self.content_analysis
            + [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Is there a weapon in the image?",
                        },
                        {
                            "type": "image",
                            "image_url": {
                                "url": f"data:image/jpg;base64,{encoded_image}"
                            },
                        },
                    ],
                }
            ],
            max_tokens=300,
        )

        result_text = response.choices[0].message.content

        self.content_analysis = self.content_analysis + [
            {"role": "assistant", "content": result_text}
        ]

        logger.info(f"Result: {result_text}")

        return result_text
