from telegram import Update, ReplyKeyboardMarkup
from telegram.ext import (
    ApplicationBuilder,
    CommandHandler,
    MessageHandler,
    filters,
    ContextTypes,
    ConversationHandler,
)
import requests
import asyncio
import json

# Estados de la conversación
WAITING_CONFIRM = 1

# Guarda aquí resultados temporales por usuario
temp_results = {}

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    print("🟢 /start recibido")
    await update.message.reply_text("A traves de /procesar <URL TikTok> para comenzar.")

import re

async def procesar(update: Update, context: ContextTypes.DEFAULT_TYPE):
    print("🟢 /procesar recibido")
    print(update.message.text)
    print("🟢 /procesar recibido")
    # Extraemos la URL desde el texto completo del mensaje
    message_text = update.message.text
    match = re.search(r"https?://[^\s]+", message_text)

    if not match:
        await update.message.reply_text("❌ Debes proporcionar una URL válida tras el comando.")
        return ConversationHandler.END

    url = match.group(0)
    print(f"🔗 URL detectada: {url}")
    msg = await update.message.reply_text("⏳ Procesando video...")

    API_URL = os.getenv("API_URL") or "http://localhost:8000"
    try:
        resp = requests.post(f"{API_URL}/procesar", json={"url": url})
    except Exception as e:
        print(f"❌ Error en la llamada a la API: {e}")
        await update.message.reply_text("❌ No se pudo conectar con el servicio.")
        return ConversationHandler.END

    if resp.status_code != 200:
        await update.message.reply_text("❌ Error al iniciar la tarea.")
        return ConversationHandler.END

    task_id = resp.json().get("task_id")
    print(f"🆔 Task ID recibido: {task_id}")
    await update.message.reply_text("🟢 Tarea generada con id:" + task_id)

    result = await check_status(update, task_id)
    if not result:
        await asyncio.sleep(15)
        r = requests.get(f"{API_URL}/estado/{task_id}")
        data = r.json()

        result = data["resultado"]

    if not result:
        await update.message.reply_text("❌ Fallo al obtener el resultado.")
        return ConversationHandler.END

    # Guardamos el resultado en una variable de sesión
    user_id = update.effective_user.id
    temp_results[user_id] = result

    if is_valid_json(result):
        await update.message.reply_text(
            f"✅ Resultado:\n{result}\n\n¿Deseas guardar este resultado?",
            reply_markup=ReplyKeyboardMarkup([["Sí", "No"]], one_time_keyboard=True)
        )
    else:
        await update.message.reply_text("❌ El resultado obtenido no tiene un formato valido, intentelo de nuevo mas tarde.")


    return WAITING_CONFIRM


async def check_status(update, task_id):
    print("🟢 /check_status")
    print(task_id)
    last_progress_report = 0
    API_URL = os.getenv("API_URL")
    MAX_WAIT_TIME_SECONDS = 180
    for _ in range(MAX_WAIT_TIME_SECONDS):  # 180 * 5s = 900s máx de espera = 15 minutos máx de espera
        r = requests.get(f"{API_URL}/estado/{task_id}")
        data = r.json()
        print("🟢 data:")
        print(data)
        if data["estado"] == "SUCCESS":
            return data["resultado"]
        elif data["estado"] == "FAILURE":
            return None
        else:
            current_progress = data["progreso"]
            current_message = data["mensaje"]
            message_send = "⏳ " + str(current_progress) + "% - " + current_message
            if current_progress != last_progress_report:
                await update.message.reply_text(message_send)
            last_progress_report = current_progress
        await asyncio.sleep(5)

    await update.message.reply_text("❌ El tiempo del procesado ha experido")
    return None

async def handle_confirmation(update: Update, context: ContextTypes.DEFAULT_TYPE):
    print("🟢 /handle_confirmation")
    user_response = update.message.text.lower()
    user_id = update.effective_user.id
    result = temp_results.get(user_id)

    if not result:
        await update.message.reply_text("⚠️ No se encontró resultado para guardar.")
        return ConversationHandler.END

    if user_response in ["sí", "si"]:
        # Aquí podrías guardar en tu DB, enviarlo a otro sistema, etc.
        # TODO: Capture the response to store the response in the database
        await update.message.reply_text("✅ Resultado guardado con éxito.")
    else:
        await update.message.reply_text("🗑️ Resultado descartado.")

    # Limpiar resultados temporales
    temp_results.pop(user_id, None)
    return ConversationHandler.END

async def cancel(update: Update, context: ContextTypes.DEFAULT_TYPE):
    print("🟢 /cancel recibido")
    await update.message.reply_text("❌ Proceso cancelado.")
    return ConversationHandler.END

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

if __name__ == "__main__":
    import os
    TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')

    if TOKEN is None or TOKEN == "":
        print("❌ No se ha detectado token para el chat")
        exit

    app = ApplicationBuilder().token(TOKEN).build()

    print("🔧 Iniciando bot...")
    print(f"🔑 TOKEN (últimos dígitos): ...{TOKEN[-5:]}")
    print(f"🌐 API_URL: {os.getenv('API_URL')}")

    conv_handler = ConversationHandler(
        entry_points=[MessageHandler(filters.TEXT & filters.Regex(r"^/procesar"), procesar)],
        states={
            WAITING_CONFIRM: [MessageHandler(filters.TEXT & ~filters.COMMAND, handle_confirmation)],
        },
        fallbacks=[CommandHandler("cancel", cancel)],
    )

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("procesar", procesar))
    app.add_handler(CommandHandler("cancel", cancel))
    app.add_handler(conv_handler)
    app.run_polling()

    print("🔧 RUN... ")
