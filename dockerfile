# Dockerfile.dev

FROM python:3.10-slim

# Set working directory inside container
WORKDIR /app

# Install system dependencies for image processing and PyTorch
RUN apt-get update && apt-get install -y \
    build-essential \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
 && rm -rf /var/lib/apt/lists/*

# Upgrade pip
RUN pip install --upgrade pip

# Install CPU-only PyTorch
RUN pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu

# Install project dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code into container
COPY . .

# (Optional) Pre-download Hugging Face captioning model
RUN python -c "from transformers import VisionEncoderDecoderModel; VisionEncoderDecoderModel.from_pretrained('nlpconnect/vit-gpt2-image-captioning')"

# Start the FastAPI app
CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
