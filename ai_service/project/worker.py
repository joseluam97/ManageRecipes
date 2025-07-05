import os
import time

from celery import Celery
from model_mistral_tiktok import procesar_receta


celery = Celery(__name__)
celery.conf.broker_url = os.environ.get("CELERY_BROKER_URL", "redis://localhost:6379")
celery.conf.result_backend = os.environ.get("CELERY_RESULT_BACKEND", "redis://localhost:6379")


@celery.task(name="create_task")
def create_task(task_type):
    time.sleep(int(task_type) * 10)
    return True

@celery.task(bind=True, name="procesar_receta_task")
def procesar_receta_task(self, url: str) -> str:
    return procesar_receta(url)