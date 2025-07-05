# pull official base image
FROM python:3.11.2-slim-buster

# set work directory
WORKDIR /usr/src/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Instala dependencias del sistema necesarias para:
# - compilar paquetes (gcc, g++)
# - usar whisper (ffmpeg)
# - llama-cpp-python (cmake)
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    ffmpeg \
    build-essential \
    libopenblas-dev \
    git \
    curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# install dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt .

RUN pip install --upgrade pip setuptools wheel
#RUN pip install --no-cache-dir -r requirements.txt
RUN pip install -r requirements.txt

# Instala whisper por separado para evitar errores de resolución
RUN pip install git+https://github.com/openai/whisper.git

# copy project
COPY . .
