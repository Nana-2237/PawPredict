from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2, decode_predictions, preprocess_input
from tensorflow.keras.preprocessing import image
import numpy as np
from PIL import Image
from io import BytesIO

model = MobileNetV2(weights="imagenet")

def extract_labels(img_bytes: bytes, top_n=3) -> list[str]:
    img = Image.open(BytesIO(img_bytes)).convert("RGB")
    img = img.resize((224, 224))
    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    x = preprocess_input(x)

    preds = model.predict(x)
    decoded = decode_predictions(preds, top=top_n)[0]
    labels = [entry[1].lower() for entry in decoded]
    return labels
