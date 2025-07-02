# 🐾 PawPredict

PawPredict is a full-stack AI web application that classifies uploaded pet images (cat, dog, or neither) and generates a natural language description of the image using image captioning.

---

## 🚀 Features

- 🧠 **Animal Classifier**: Predicts whether the image is of a dog, cat, or something else.
- 📸 **Image Captioning**: Describes the pet in the image using natural language (e.g. “a small dog with curly fur sitting on grass”).
- ⚡ **Redis Caching**: Avoids recomputing predictions for the same image.
- 🐱 **Animated Cat**: A walking cat moves randomly around the screen.
- 🐾 **Paw Prints**: The cat leaves paw prints that disappear after 50 seconds.
- 🖼️ **User Interface**: React + Tailwind UI for uploading an image and viewing predictions.

---

## 🛠 Tech Stack

| Frontend             | Backend | AI Models               | Infrastructure |
|----------------------|---------|--------------------------|----------------|
| React + Tailwind CSS | FastAPI | MobileNet, ViT-GPT2 (HuggingFace) | Docker + Redis |

---

## 📂 Project Structure

PawPredict/
├── backend/
│ └── app/
│ ├── main.py
│ ├── utils.py
│ ├── cache.py
│ └── models/
├── frontend/
│ ├── public/
│ └── src/
│ ├── App.js
│ ├── index.css
│ └── assets/
│ ├── paw.png
│ └── walkingcat.png
├── docker-compose.yml
└── README.md


🧠 Models Used
Animal Classifier: MobileNet (internal)

Image Captioner: nlpconnect/vit-gpt2-image-captioning

👤 Author
GitHub: @Nana-2237

