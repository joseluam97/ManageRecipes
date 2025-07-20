import os
import unicodedata
from supabase import create_client

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
supabase = create_client(url, key)

async def send_recipe_by_url(update, url):
    # Consulta con joins para mostrar los nombres
    response = supabase.table("Recipes").select(
        "id, name, link, created_at, image, tag, elaboration, preparation_time, country_origin,"
        "type(name), difficulty(name), source(name), order(name)"
    ).eq("link", url).maybe_single().execute()

    if not response:
        await update.message.reply_text("📭 No se encontró ninguna receta con esa URL.")
        return

    receta = response.data

    # Obtener ingredientes de la receta
    ingredientes_response = supabase.table("Ingredients_recipes").select(
        "cuantity, ingredient(name), unit(name)"
    ).eq("recipe", receta["id"]).execute()

    ingredientes = ingredientes_response.data

    ingredientes_formateados = "\n".join(
        f"🍃 {i['cuantity']} {i.get('unit', {}).get('name', '')} {i.get('ingredient', {}).get('name', '')}"
        for i in ingredientes
    ) or "Sin ingredientes registrados"
    
    # Formatear los datos
    
    nombre = receta.get("name", "Sin nombre")
    tipo = (receta.get("type") or {}).get("name", "Desconocido")
    dificultad = (receta.get("difficulty") or {}).get("name", "Desconocida")
    fuente = (receta.get("source") or {}).get("name", "Desconocida")
    orden = (receta.get("order") or {}).get("name", "Sin orden")
    tiempo = receta.get("preparation_time") or "N/D"
    pais = receta.get("country_origin") or "N/D"
    etiquetas = ", ".join(receta.get("tag") or []) or "Sin etiquetas"
    
    pasos = "\n".join(f"- {paso}" for paso in receta.get("elaboration", [])) or "No hay pasos"

    mensaje = (
        f"🍽️ <b>{nombre}</b>\n"
        f"🔗 URL: {receta['link']}\n"
        f"🕒 Tiempo: {tiempo} min\n"
        f"🌍 Origen: {pais}\n"
        f"📚 Tipo: {tipo}\n"
        f"🎯 Dificultad: {dificultad}\n"
        f"📥 Fuente: {fuente}\n"
        f"📦 Orden: {orden}\n"
        f"🏷️ Etiquetas: {etiquetas}\n\n"
        f"🧂 <b>Ingredientes:</b>\n"
        f"{ingredientes_formateados}\n\n"
        f"👨‍🍳 <b>Elaboración:</b>\n"
        f"{pasos}"
    )

    if receta.get("image"):
        await update.message.reply_photo(
            photo=receta["image"],
            caption=mensaje,
            parse_mode="HTML"
        )
    else:
        await update.message.reply_text(
            mensaje,
            parse_mode="HTML"
        )

# 🔤 Normaliza texto para comparar sin tildes y sin mayúsculas
def normalizar(texto):
    if texto is None:
        return ""
    return unicodedata.normalize("NFKD", texto).encode("ASCII", "ignore").decode().lower()

# 🔍 Busca un ingrediente ignorando tildes/mayúsculas
def buscar_ingrediente(nombre_normalizado):
    result_ingredient = supabase.table("Ingredients").select("*").eq("name", nombre_normalizado).maybe_single().execute()
    if not result_ingredient is None:
        print("------------------result_ingredient--------------------")
        print(result_ingredient)
        print("------------------------------------------------")
        return result_ingredient.data
    return None

# 🔍 Busca una unidad de medida ignorando tildes/mayúsculas
def buscar_unidad(nombre_normalizado):
    result_unit = supabase.table("Units").select("*").eq("name", nombre_normalizado).maybe_single().execute()
    if not result_unit is None:
        print("------------------result_unit--------------------")
        print(result_unit)
        print("------------------------------------------------")
        return result_unit.data
    return None

# 🚀 Inserta receta completa
async def insertar_receta_desde_json(data, link_recipe):
    
    print("------------------data--------------------")
    print(data)
    print("------------------------------------------------")

    nombre_receta = data["titulo"]
    pasos = data["pasos"]
    ingredientes = data["ingredientes"]
    tiempo = data["tiempo"]
    pais = data["pais"]
    difficulty = data["difficulty"]
    order = data["order"]
    etiquetas = data["etiquetas"]

    source_tiktok = supabase.table("Sources").select("*").eq("name", "TikTok").maybe_single().execute()
    source_tiktok_id = source_tiktok.data["id"]

    level_receive = supabase.table("Levels").select("*").eq("name", difficulty).maybe_single().execute()
    level_receive_id = level_receive.data["id"]

    order_receive = supabase.table("Orders").select("*").eq("name", order).maybe_single().execute()
    order_receive_id = order_receive.data["id"]

    # 1. Crear receta
    receta_response = supabase.table("Recipes").insert({
        "name": nombre_receta,
        "elaboration": pasos,
        "link": link_recipe,
        "source": source_tiktok_id,
        "preparation_time": tiempo,
        "country_origin": pais,
        "difficulty": level_receive_id,
        "order": order_receive_id,
        "tag": etiquetas
    }).execute()

    receta_id = receta_response.data[0]["id"]

    for ing in ingredientes:
        nombre = ing["nombre"]
        cantidad = ing["cantidad"]
        unidad = ing["unidad"]

        nombre_norm = normalizar(nombre)
        unidad_norm = normalizar(unidad)

        # 2. Buscar o crear ingrediente
        ingrediente = buscar_ingrediente(nombre_norm)
        if not ingrediente:
            ingrediente_response = supabase.table("Ingredients").insert({"name": nombre_norm}).execute()
            ingrediente_id = ingrediente_response.data[0]["id"]
        else:
            print("------------------ingrediente--------------------")
            print(ingrediente)
            print("------------------------------------------------")
            ingrediente_id = ingrediente["id"]

        # 3. Buscar o crear unidad
        unidad_obj = buscar_unidad(unidad_norm)
        if not unidad_obj:
            unidad_response = supabase.table("Units").insert({"name": unidad_norm}).execute()
            unidad_id = unidad_response.data[0]["id"]
        else:
            print("------------------unidad_obj--------------------")
            print(unidad_obj)
            print("------------------------------------------------")
            unidad_id = unidad_obj["id"]

        # 4. Insertar en Ingredients_recipes
        try:
            cantidad_num = float(str(cantidad).replace(",", ".").replace("g", ""))
        except:
            cantidad_num = None  # Por si no es numérico

        supabase.table("Ingredients_recipes").insert({
            "recipe": receta_id,
            "ingredient": ingrediente_id,
            "cuantity": cantidad_num,
            "unit": unidad_id
        }).execute()

    return receta_id