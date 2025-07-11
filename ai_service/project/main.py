from fastapi import Body, FastAPI, Form, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from celery.result import AsyncResult
from worker import celery
from pydantic import BaseModel
from tasks import procesar_receta_task, get_recipe_from_url, create_task
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# 🔓 Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    #allow_origins=["http://localhost:3000"],  # Production => Origen del frontend
    allow_origins=["*"], # Development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class URLInput(BaseModel):
    url: str

@app.get("/")
def home(request: Request):
    return templates.TemplateResponse("home.html", context={"request": request})

@app.post("/tareas")
def ejecutar_tarea(payload: dict):
    tipo = payload["type"]
    url = payload["url"]
    
    if not url:
        return {"error": "URL no proporcionada"}
    
    try:
        if tipo == "scrape":
            task = get_recipe_from_url.delay(url)
        elif tipo == "ia":
            task = procesar_receta_task.delay(url)
        else:
            raise HTTPException(400, "Tipo de tarea no válido")

        return {"task_id": task.id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/tasks", status_code=201)
def run_task(payload = Body(...)):
    task_type = payload["type"]
    task = create_task.delay(int(task_type))
    return JSONResponse({"task_id": task.id})

@app.get("/tasks/{task_id}")
def get_status(task_id):
    task_result = AsyncResult(task_id)
    result = {
        "task_id": task_id,
        "task_status": task_result.status,
        "task_result": task_result.result
    }
    return JSONResponse(result)


@app.get("/estado/{task_id}")
def obtener_estado(task_id: str):
    task_result = AsyncResult(task_id, app=celery)

    # Si info no es un dict, usamos uno vacío
    info = task_result.info if isinstance(task_result.info, dict) else {}

    return {
        "task_id": task_id,
        "estado": task_result.status,
        "resultado": task_result.result,
        "progreso": info.get("progreso"),
        "mensaje": info.get("mensaje"),
    }


@app.post("/extract")
def extract_recipe(data: URLInput):
    try:
        task = get_recipe_from_url.delay(data.url)
        return {"task_id": task.id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/procesar")
async def lanzar_procesamiento(request: Request):
    data = await request.json()
    url = data.get("url")
    if not url:
        return {"error": "URL no proporcionada"}
    
    task = procesar_receta_task.delay(url)
    return {"task_id": task.id}
