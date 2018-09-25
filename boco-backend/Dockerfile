FROM python:3.6
LABEL Description="Boco", Vendor="Boco"

ENV PYTHONUNBUFFERED 1
RUN apt-get update && apt-get install -y libpq-dev && apt-get install -y libgdal-dev && apt-get install -y libffi-dev && rm -rf /var/lib/apt/lists/*
RUN pip install  --upgrade pip


COPY ./requirements.txt /code/requirements.txt
RUN pip install -r /code/requirements.txt
COPY . /code/

WORKDIR /code

EXPOSE 80