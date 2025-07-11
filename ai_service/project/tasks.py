from worker import celery
from model_mistral_tiktok import procesar_receta
from scrapping_clirecipe import parse_recipe_from_url
import whisper
import torch

@celery.task(name="create_task")
def create_task(task_type):
    import time
    time.sleep(int(task_type) * 10)
    return True

@celery.task(bind=True, name="transcribir_audio_task")
def transcribir_audio_task(self, audio_path: str):
    self.update_state(state="PROGRESS", meta={"progreso": 10, "mensaje": "Cargando modelo Whisper..."})
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model = whisper.load_model("tiny", device=device)
    self.update_state(state="PROGRESS", meta={"progreso": 50, "mensaje": "Transcribiendo..."})
    result = model.transcribe(audio_path, language='es')
    return result['text']

@celery.task(bind=True, name="procesar_receta_task")
def procesar_receta_task(self, url: str):
    self.update_state(state="PROGRESS", meta={"progreso": 10, "mensaje": "Descargando video..."})
    # 🔁 Se inyecta la tarea en lugar de importarla desde model_mistral_tiktok
    return procesar_receta(url)

@celery.task(bind=True, name="get_recipe_from_url")
def get_recipe_from_url(self, url: str):
    self.update_state(state="PROGRESS", meta={"progreso": 10, "mensaje": "Analizando la URL..."})
    return parse_recipe_from_url(url)
