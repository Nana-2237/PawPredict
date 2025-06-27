from fastapi import FastAPI, File, UploadFile
from .utils import hash_image
from .cache import get_cached_prediction, set_cached_prediction
from .models.animal_classifier import classify_animal
import json

app = FastAPI()

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image_bytes = await file.read()
    hash_key = hash_image(image_bytes)

    cached = get_cached_prediction(hash_key)
    if cached:
        return {"result": json.loads(cached), "source": "cache"}

    category = classify_animal(image_bytes)
    result = {"category": category}

    set_cached_prediction(hash_key, json.dumps(result))
    return {"result": result, "source": "model"}
