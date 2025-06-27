import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image
from io import BytesIO
from PIL import Image

# Load the pretrained Keras model
model = tf.keras.models.load_model("backend/app/models/catdog_best.keras")

def classify_animal(img_bytes: bytes) -> str:
    img = Image.open(BytesIO(img_bytes)).convert("RGB")
    img = img.resize((240, 240))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = tf.keras.applications.efficientnet.preprocess_input(img_array)

    prediction = model.predict(img_array)
    score = prediction[0][0]

    return "cat" if score < 0.5 else "dog"
