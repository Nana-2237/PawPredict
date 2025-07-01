from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from .utils import hash_image
from .cache import get_cached_prediction, set_cached_prediction
from .models.animal_classifier import classify_animal
from .models.breed_captioner import generate_caption
import json

app = FastAPI()

# Allow requests from your React app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Read image bytes from uploaded file
    image_bytes = await file.read()

    # Generate a hash to use as a cache key
    hash_key = hash_image(image_bytes)

    # Check if prediction exists in cache
    cached = get_cached_prediction(hash_key)
    if cached:
        return {
            "result": json.loads(cached),
            "source": "cache"
        }

    # Run model predictions
    category = classify_animal(image_bytes)           
    description = generate_caption(image_bytes)     

    result = {
        "category": category,
        "description": description
    }

    # Save to cache for future use
    set_cached_prediction(hash_key, json.dumps(result))

    # Return result to frontend
    return {
        "result": result,
        "source": "model"
    }
