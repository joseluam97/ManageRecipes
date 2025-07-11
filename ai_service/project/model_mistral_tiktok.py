
import os
import yt_dlp
import whisper
from llama_cpp import Llama
import re
import unicodedata
import json
from datetime import datetime
from tqdm import tqdm
import torch

# Carga del modelo Mistral con hilos configurados
mistral = Llama(model_path="./models/mistral-7b-instruct-v0.1.Q4_K_M.gguf", n_ctx=4096, n_threads=8)

def nombre_archivo_valido(texto):
    texto = unicodedata.normalize('NFKD', texto).encode('ascii', 'ignore').decode('ascii')
    texto = texto.replace(" ", "_")
    texto = re.sub(r'[\\/*?:"<>|]', "", texto)
    return texto.lower()

def download_tiktok_video(url, output_path):
    ydl_opts = {
        'outtmpl': output_path,
        'quiet': True,
        'noplaylist': True,
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)
        return (
            info.get('title', 'Receta sin título'),
            info.get('description', ''),
            info.get('thumbnail')
        )

def download_audio_only(url, output_path):
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': output_path,
        'quiet': True,
        'noplaylist': True,
        'postprocessors': [],
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.extract_info(url, download=True)
        return output_path

def transcribe_with_whisper_local(audio_path):
    print("🧠 Transcribiendo con Whisper local...")
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"🧠 Usando dispositivo: {device}")
    model = whisper.load_model("tiny", device=device)
    result = model.transcribe(audio_path, language='es')
    return result['text']

def extract_recipe_with_mistral(description, transcription):
    prompt = f"""
    Extrae la receta del siguiente contenido en formato JSON:

    Descripción:
    {description}

    Transcripción de audio:
    {transcription}

    Devuelve solo un JSON con:
    - titulo
    - ingredientes: (array de json)
        - nombre del ingrediente
        - cantidad
        - unidad de la cantidad (gramos, unidades, litros, mililitros...)
    - pasos (array de strings)
    - tips (Si el usuario comenta algun tips en el video, crea un array de strings)

    Añade en el texto final unicamente el json solicitado
    """
    max_tokens = 512
    stream = mistral(prompt, max_tokens=max_tokens, stream=True)
    tokens = []
    pbar = tqdm(total=max_tokens, desc="Generando respuesta", ncols=80)
    for output in stream:
        token_text = output["choices"][0]["text"]
        tokens.append(token_text)
        pbar.update(1)
    pbar.close()
    texto_completo = "".join(tokens).strip()
    return texto_completo

def procesar_receta(url, task=None):
    from time import sleep

    def update_state(percent, mensaje):
        if task:
            task.update_state(state="PROGRESS", meta={"progreso": percent, "mensaje": mensaje})
        print(f"[{percent}%] {mensaje}")

    timestamp = datetime.now().strftime("%Y%m%d%H%M")

    update_state(5, "📥 Iniciando descarga del vídeo...")
    titulo, descripcion, thumbnail = download_tiktok_video(url, f'./videos/video{timestamp}.mp4')

    update_state(25, "🎧 Extrayendo audio...")
    audio_path = download_audio_only(url, f'./records/audio{timestamp}.m4a')

    update_state(45, "🧠 Transcribiendo con Whisper local...")
    transcripcion = transcribe_with_whisper_local(audio_path)

    update_state(70, "💡 Extrayendo receta con Mistral...")
    receta = extract_recipe_with_mistral(descripcion, transcripcion)

    update_state(90, "💾 Generando archivo local...")
    generar_archivo(receta)

    update_state(100, "✅ Proceso completado")
    return receta

def generar_archivo(receta):
    print("📁 Generando archivo de texto...")
    titulo = ""
    match = re.search(r'\{.*\}', receta, re.DOTALL)
    if match:
        receta_limpia = match.group(0)
        try:
            data = json.loads(receta_limpia)
            titulo = data["titulo"]
            print("📁 Nombre de archivo:", titulo)
        except json.JSONDecodeError as e:
            print("❌ Error al decodificar JSON:", e)
    else:
        print("❌ No se encontró estructura JSON en la variable 'receta'")
    if not titulo:
        ahora = datetime.now().strftime("%Y_%m_%d_%H%M%S")
        titulo = f"Archivo_receta_{ahora}"
        print("📁 Nombre generado automáticamente:", titulo)
    nombre_archivo = nombre_archivo_valido(titulo) + ".txt"
    carpeta_destino = "./reports/"
    os.makedirs(carpeta_destino, exist_ok=True)
    ruta_archivo = os.path.join(carpeta_destino, nombre_archivo)
    with open(ruta_archivo, "w", encoding="utf-8") as f:
        f.write(receta)

if __name__ == "__main__":
    url = "https://www.tiktok.com/@comiendobienn/video/7518837827455552790"
    procesar_receta(url)
