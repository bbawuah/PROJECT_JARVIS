from open_gopro import WirelessGoPro, Params, proto
import logging
import asyncio
from pathlib import Path
import subprocess
import time

log =logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger: logging.Logger = logging.getLogger("log")

class GoProService:
    gopro: WirelessGoPro = None
    is_streaming: bool = False
    process: subprocess.Popen = None

    # Connect to a Gopro       
    async def connect(self, target: str):
        # Create a WirelessGopro instance
        self.gopro = WirelessGoPro(target)
        logger.info("Connecting to Gopro...")
        try:
            if not self.gopro.is_open:
                await self.gopro.open()
                response = {
                    "SSID": self.gopro.ssid,
                    "hardware_info": await self.gopro.ble_command.get_hardware_info(),
                    "ble_connected":  self.gopro.is_ble_connected,
                    "is_open": self.gopro.is_open, 
                    "http_connected": self.gopro.is_http_connected
                    } 
                return response
            else:
                logger.info("Gopro is already open")
                response = {
                    "ble_connected":  self.gopro.is_ble_connected,
                    "is_open": self.gopro.is_open,
                    "http_connected":  self.gopro.is_http_connected
                    }
                return response
        except Exception as e:
            logger.info(f"Error while connecting: {e}")
            return {"error": str(e)}

    # Disconnect from a Gopro
    async def disconnect(self):
        try:
            if  self.gopro and self.gopro.is_open:
                await self.gopro.close()
                response = {
                    "is_open":  self.gopro.is_open
                    }
                return response
            else:
                logger.info("Gopro is not open")
                response = {
                    "is_open": self.gopro.is_open,
                    }
                return response
        except Exception as e:
            logger.info(f"Error while disconnecting: {e}")
            return {"error": str(e)}
    
    # Take a photo
    async def take_photo(self):
        try:
            if  self.gopro and self.gopro.is_open:
                # Configure settings to prepare for photo
                await self.gopro.http_setting.video_performance_mode.set(Params.PerformanceMode.MAX_PERFORMANCE)
                await self.gopro.http_setting.max_lens_mode.set(Params.MaxLensMode.DEFAULT)
                await self.gopro.http_setting.camera_ux_mode.set(Params.CameraUxMode.PRO)
                await self.gopro.http_command.set_turbo_mode(mode=Params.Toggle.DISABLE)

                assert (await self.gopro.http_command.load_preset_group(group=proto.EnumPresetGroup.PRESET_GROUP_ID_PHOTO)).ok
                
                # Get the media list 
                media_set_before = set((await self.gopro.http_command.get_media_list()).data.files)

                # Take a photo
                logger.info("Capturing a photo...")
                assert (await self.gopro.http_command.set_shutter(shutter=Params.Toggle.ENABLE)).ok

                # Get the media
                media_set_after = set((await self.gopro.http_command.get_media_list()).data.files)
                
                photo = media_set_after.difference(media_set_before).pop()

                # Download the photo
                logger.info(f"Downloading {photo.filename}...")
                await self.gopro.http_command.download_file(camera_file=photo.filename, local_file=Path("photos", photo.filename))
                logger.info(f"Success!! :smiley: File has been downloaded to {Path('photos', photo.filename)}")
                return {"success": True}
            else:
                logger.error("Gopro is not connected")
                return {"error": "Gopro is not connected"}
        except Exception as e:
            logger.error(f"Error while taking photo: {e}")
            return {"error": str(e)}
    
    # Start the video
    async def start_video(self, record_time: float):
        try:
            # Configure settings to prepare for video
            if self.gopro and self.gopro.is_open:
                await self.gopro.http_command.set_shutter(shutter=Params.Toggle.DISABLE)
                await self.gopro.http_setting.video_performance_mode.set(Params.PerformanceMode.MAX_PERFORMANCE)
                await self.gopro.http_setting.max_lens_mode.set(Params.MaxLensMode.DEFAULT)
                await self.gopro.http_setting.camera_ux_mode.set(Params.CameraUxMode.PRO)
                await self.gopro.http_command.set_turbo_mode(mode=Params.Toggle.DISABLE)
                assert (await self.gopro.http_command.load_preset_group(group=proto.EnumPresetGroup.PRESET_GROUP_ID_VIDEO)).ok

                # Get the media list before
                media_set_before = set((await self.gopro.http_command.get_media_list()).data.files)
                # Take a video
                logger.info("Capturing a video...")
                assert (await self.gopro.http_command.set_shutter(shutter=Params.Toggle.ENABLE)).ok
                await asyncio.sleep(record_time)
                assert (await self.gopro.http_command.set_shutter(shutter=Params.Toggle.DISABLE)).ok

                # Get the media list after
                media_set_after = set((await self.gopro.http_command.get_media_list()).data.files)
                # The video (is most likely) the difference between the two sets
                video = media_set_after.difference(media_set_before).pop()
                # Download the video
                logger.info("Downloading the video...")
                await self.gopro.http_command.download_file(camera_file=video.filename, local_file=Path("videos", video.filename))
                logger.info(f"Success!! :smiley: File has been downloaded to {Path('videos', video.filename)}")
                return {"success": True}
            else:
                logger.error("Gopro is not connected")
                return {"error": "Gopro is not connected"} 
        except Exception as e:
            logger.error(f"Error while taking video: {e}")
            return {"error": str(e)}
    
    # Stop the video
    async def stop_video(self):
        try:
            if self.gopro and self.gopro.is_open:
                logger.info("Stopping the video...")
                assert (await self.gopro.http_command.set_shutter(shutter=Params.Toggle.DISABLE)).ok
                return {"success": True}
            else:
                logger.error("Gopro is not connected")
                return {"error": "Gopro is not connected"}
        except Exception as e:
            logger.error(f"Error while stopping video: {e}")
            return {"error": str(e)}
        
    # Start the preparation to preview stream
    async def start_prepare_stream(self):
        try:
            if  self.gopro and self.gopro.is_open:
                logger.info("Configuring settings to prepare for video...")
                await self.gopro.http_command.set_shutter(shutter=Params.Toggle.DISABLE)
                await self.gopro.http_setting.video_performance_mode.set(Params.PerformanceMode.MAX_PERFORMANCE)
                await self.gopro.http_setting.max_lens_mode.set(Params.MaxLensMode.DEFAULT)
                await self.gopro.http_setting.camera_ux_mode.set(Params.CameraUxMode.PRO)
                await self.gopro.http_command.set_turbo_mode(mode=Params.Toggle.DISABLE)
                await self.gopro.http_command.set_preview_stream(mode=Params.Toggle.DISABLE)

                assert (await self.gopro.http_command.load_preset_group(group=proto.EnumPresetGroup.PRESET_GROUP_ID_VIDEO)).ok

                # Start the preview stream
                await self.gopro.http_command.set_preview_stream(mode=Params.Toggle.ENABLE)
                self.is_streaming = True                

                return {"message": "Stream has started in the background"}
            else:
                logger.error("Gopro is not connected")
                return {"error": "Gopro is not connected"}
        except Exception as e:
            logger.error(f"Error while preparing to start preview stream: {e}")
            return {"error": str(e)}
    
    # Start stream
    def start_stream(self):
        logger.info("Starting preview stream...")

        self.convert_udp_stream_to_hls(8554, 'streaming')

        logger.info("Preview stream started")

        # Start the UDP stream
        while self.is_streaming:
            time.sleep(0.5)
            
    # Stop the preview stream
    async def stop_stream(self):
        try:
            if  self.gopro and self.gopro.is_open:
                # Stop the UDP stream
                self.is_streaming = False
                try:
                    if self.process:      
                        self.process.terminate()
                    logger.info("Stopping preview stream...")
                    await self.gopro.http_command.set_preview_stream(mode=Params.Toggle.DISABLE)
                    logger.info("Preview stream stopped")
                    return {"message": "Preview stream stopped"}
                except Exception as e:
                    logger.error(f"Error while stopping preview stream: {e}")
                    return {"error": str(e)}
            else:
                logger.error("Gopro is not connected")
                return {"error": "Gopro is not connected"}
        except Exception as e:
            logger.error(f"Error while stopping stream: {e}")
            return {"error": str(e)}
    
    # Power down
    async def power_down(self):
        if  self.gopro and self.gopro.is_open:
            try:
                logger.info("Powering down...")
                await self.gopro.ble_command.power_down()
                logger.info("Powered down")
                return {"message": "Powered down"}
            except Exception as e:
                logger.error(f"Error while powering down: {e}")
                return {"error": str(e)}
        else:
            logger.error("Gopro is not connected")
            return {"error": "Gopro is not connected"}

    def convert_udp_stream_to_hls(self, port, output_dir):
        udp_url = f'udp://0.0.0.0:{port}' 
        command = [
            'ffmpeg',
            '-i', udp_url,
            '-codec:', 'copy',
            '-start_number', '0',
            '-hls_time', '10',
            '-hls_list_size', '0',
            '-f', 'hls',
            f'{output_dir}/output.m3u8'
        ]
        self.process = subprocess.Popen(command) 
                    

