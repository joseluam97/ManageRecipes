import re
import requests
from bs4 import BeautifulSoup

def parse_recipe_from_url(url: str):
    response = requests.get(url)
    if response.status_code != 200:
        raise Exception("No se pudo acceder a la URL")

    soup = BeautifulSoup(response.text, "html.parser")

    # Nombre e imagen
    name = soup.find("h1", class_="card-title").get_text(strip=True)
    img_tag = soup.find("img", alt=name)
    image = img_tag["src"] if img_tag else None

    # Paso clave: buscar el bloque copiable que contiene todo
    button = soup.find("button", attrs={"@click": re.compile(r"navigator.clipboard.writeText")})
    if not button:
        raise Exception("No se encontró el bloque de texto completo de la receta")

    raw_text = button["@click"]
    match = re.search(r"writeText\(`([\s\S]+?)`\)", raw_text)
    if not match:
        raise Exception("No se pudo extraer el texto del botón copiar")

    full_text = match.group(1)
    full_text = full_text.replace("\\n", "\n").replace("\\'", "'").replace('\\"', '"')

    # Separar bloques
    ingredients = []
    equipment = []
    tips = []
    steps = []

    # Buscar secciones
    current_section = None
    for line in full_text.splitlines():
        line = line.strip()

        if not line:
            continue

        if "Ingredients" in line:
            current_section = "ingredients"
            continue
        elif "Directions" in line:
            current_section = "steps"
            continue
        elif "Equipment" in line:
            current_section = "equipment"
            continue
        elif "Tips" in line:
            current_section = "tips"
            continue

        if current_section == "ingredients" and line.startswith("-"):
            ingredient_line = line[1:].strip()
            match = re.match(r"(?P<quantity>[\d.,]+)?\s*(?P<unit>\w+)?\s*(?P<name>.+)", ingredient_line)
            if match:
                ingredients.append({
                    "name": match.group("name").strip(),
                    "quantity": match.group("quantity") or "",
                    "unit": match.group("unit") or ""
                })
            else:
                ingredients.append({
                    "name": ingredient_line,
                    "quantity": "",
                    "unit": ""
                })

        elif current_section == "equipment" and line.startswith("-"):
            equipment.append(line[1:].strip())

        elif current_section == "tips" and line.startswith("-"):
            tips.append(line[1:].strip())

        elif current_section == "steps" and re.match(r"^\d+\.", line):
            step = line.split(".", 1)[1].strip()
            steps.append(step)

    return {
        "name": name,
        "link": url,
        "image": image,
        "ingredients": ingredients,
        "equipment": equipment,
        "tips": tips,
        "steps": steps
    }

if __name__ == "__main__":
    url = "https://cliprecipe.com/recipe/Xz2ugyK9MAr7rArrkkdNyE"
    resultado = parse_recipe_from_url(url)

    print("------------------------------------RESULTADO------------------------------------")
    print(resultado)