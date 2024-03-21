# GOPRO project

This is a project for the GOPRO application. It is an application that sends commands from a web application to the robot.

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

#### Navigate to the project folder gopro-api

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
