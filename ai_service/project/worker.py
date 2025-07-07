import os
import time

from celery import Celery
from model_mistral_tiktok import procesar_receta
from scrapping_clirecipe import parse_recipe_from_url


celery = Celery(__name__)
celery.conf.broker_url = os.environ.get("CELERY_BROKER_URL", "redis://localhost:6379")
celery.conf.result_backend = os.environ.get("CELERY_RESULT_BACKEND", "redis://localhost:6379")


@celery.task(name="create_task")
def create_task(task_type):
    time.sleep(int(task_type) * 10)
    return True

@celery.task(bind=True, name="procesar_receta_task")
def procesar_receta_task(self, url: str) -> str:
    self.update_state(state="PROGRESS", meta={"progreso": 10, "mensaje": "Descargando video..."})
    result = procesar_receta(url)
    return result

@celery.task(bind=True, name="get_recipe_from_url")
def get_recipe_from_url(self, url: str) -> str:
    self.update_state(state="PROGRESS", meta={"progreso": 10, "mensaje": "Analizando la URL..."})
    return parse_recipe_from_url(url)
