from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware 

from .utils import hash_image
from .cache import get_cached_prediction, set_cached_prediction
from .models.animal_classifier import classify_animal
from .models.breed_captioner import generate_caption 
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image_bytes = await file.read()
    hash_key = hash_image(image_bytes)

    cached = get_cached_prediction(hash_key)
    if cached:
        return {"result": json.loads(cached), "source": "cache"}

    category = classify_animal(image_bytes)
    description = generate_caption(image_bytes)

    result = {
        "category": category,
        "description": description
    }

    set_cached_prediction(hash_key, json.dumps(result))
    return {"result": result, "source": "model"}
