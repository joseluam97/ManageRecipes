
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

def limpiar_transcripcion(texto):
    texto = re.sub(r'[^\w\sáéíóúñÁÉÍÓÚÑ,.]', '', texto)  # quita símbolos raros
    texto = re.sub(r'\s+', ' ', texto)  # colapsa espacios múltiples
    return texto.strip()

def transcribe_with_whisper_local(audio_path):
    print("🧠 Transcribiendo con Whisper local...")
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"🧠 Usando dispositivo: {device}")
    model = whisper.load_model("medium", device=device)
    result = model.transcribe(audio_path, language='es')
    result_clean = limpiar_transcripcion(result['text'])
    return result_clean

def extract_recipe_with_mistral(description, transcription, task=None, intento=1):
    prompt = ""
    prompt_principal = f"""
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

    prompt_alternativo = f"""
    Eres un asistente que **únicamente devuelve recetas en formato JSON** a partir de contenido textual.

    A continuación, se proporciona una **descripción** y una **transcripción de audio** de un vídeo de cocina.

    --- DESCRIPCIÓN ---
    {description}

    --- TRANSCRIPCIÓN ---
    {transcription}

    --- INSTRUCCIONES ---

    Analiza ambos textos y genera **solamente un JSON** con esta estructura exacta:

    {{
    "titulo": "...",
    "ingredientes": [
        {{
        "nombre": "...",
        "cantidad": ...,
        "unidad": "..."
        }}
    ],
    "pasos": ["...", "..."],
    "tips": ["...", "..."]
    }}

    ⚠️ IMPORTANTE:
    - Si no hay tips, devuelve un array vacío: "tips": []
    - Si falta algún dato, déjalo como string vacío `""`
    - NO escribas ningún texto fuera del JSON. NO respondas con frases como “¡Buena suerte!” ni comentarios.
    - El resultado no debe tener ningún texto adicional que no sea el json.

    --- FIN DEL PROMPT ---
    """

    # Select prompt
    if intento == 1 or intento == 3:
        prompt = prompt_principal
    elif intento == 2:
        prompt = prompt_alternativo

    # max_tokens = 512
    max_tokens = 2048
    progreso = 20
    progreso_final = 90
    num_tokens_to_progress = 20

    stream = mistral(prompt, max_tokens=max_tokens, stream=True)
    tokens = []
    pbar = tqdm(total=max_tokens, desc="Generando respuesta", ncols=80)

    for i, output in enumerate(stream, start=1):
        token_text = output["choices"][0]["text"]
        tokens.append(token_text)
        pbar.update(1)

        if i % num_tokens_to_progress == 0:
            if progreso <= progreso_final:
                progreso = progreso + 1
            if task:
                task.update_state(
                    state="PROGRESS",
                    meta={"n_task": "4/6", "progreso": progreso, "mensaje": "💡 Extrayendo receta completa..."}
                )
            print(f"[{progreso}%] 💡 Extrayendo receta completa...")

    pbar.close()
    return "".join(tokens).strip()

def is_valid_json(texto):
    try:
        data = json.loads(texto)
        return (
            isinstance(data, dict)
            and "titulo" in data
            and "ingredientes" in data
            and "pasos" in data
        )
    except json.JSONDecodeError:
        return False

def normalizar_claves(data):
    if not isinstance(data, dict):
        return data

    claves_corregidas = {
        "Titulo": "titulo",
        "title": "titulo",
        "Title": "titulo",
        "Ingredientes": "ingredientes",
        "ingredients": "ingredientes",
        "Ingredients": "ingredientes",
        "Pasos": "pasos",
        "steps": "pasos",
        "Steps": "pasos",
        "tip": "tips",
        "Tip": "tips",
        "Tips": "tips",
    }

    nuevo = {}
    for k, v in data.items():
        clave = claves_corregidas.get(k, k)
        nuevo[clave] = v
    return nuevo


def procesar_receta(url, task=None):
    from time import sleep

    def update_state(n_task, percent, mensaje):
        if task:
            task.update_state(state="PROGRESS", meta={"n_task": n_task, "progreso": percent, "mensaje": mensaje})
        print(f"[{percent}%] {mensaje}")

    timestamp = datetime.now().strftime("%Y%m%d%H%M")

    update_state("1/6", 5, "📥 Iniciando descarga del vídeo...")
    titulo, descripcion, thumbnail = download_tiktok_video(url, f'./videos/video{timestamp}.mp4')

    update_state("2/6", 10, "🎧 Extrayendo audio...")
    audio_path = download_audio_only(url, f'./records/audio{timestamp}.m4a')

    update_state("3/6", 15, "🧠 Transcribiendo el video...")
    transcripcion = transcribe_with_whisper_local(audio_path)

    print(f"🧠 descripcion")
    print(descripcion)
    print(f"🧠 transcripcion")
    print(transcripcion)

    update_state("4/6", 20, "💡 Extrayendo receta completa...")
    #receta = extract_recipe_with_mistral(descripcion, transcripcion, task, 1)

    intentos_maximos = 3
    for intento in range(1, intentos_maximos + 1):
        receta = extract_recipe_with_mistral(descripcion, transcripcion, task, intento)
        receta = normalizar_claves(receta)
        if is_valid_json(receta):
            break
        print(f"⚠️⚠️ Intento {intento} fallido: JSON inválido.⚠️⚠️")
        print(receta)

        if task:
            task.update_state(
                state="PROGRESS",
                meta={"n_task": "4/6", "progreso": 20 + intento * 5, "mensaje": f"🔁 Reintentando extracción ({intento}/{intentos_maximos})..."}
            )
    else:
        receta = json.dumps({
            "titulo": "",
            "ingredientes": [],
            "pasos": [],
            "tips": [],
            "error": "No se pudo extraer una receta válida del modelo."
        }, indent=2)

    update_state("5/6", 90, "💾 Generando archivo...")
    #generar_archivo(receta)

    update_state("6/6", 100, "✅ Proceso completado")
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
