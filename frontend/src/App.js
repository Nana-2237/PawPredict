import React, { useState } from 'react';
import './index.css';
import paw from './assets/paw.png';

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('http://localhost:8000/predict', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    setResult(data);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-orange-50 to-white relative font-sans text-gray-800">
      {/* Corner Paw Prints */}
      <img src={paw} className="w-6 absolute top-4 left-4 opacity-30" alt="paw" />
      <img src={paw} className="w-6 absolute top-4 right-4 opacity-30" alt="paw" />
      <img src={paw} className="w-6 absolute bottom-4 left-4 opacity-30" alt="paw" />
      <img src={paw} className="w-6 absolute bottom-4 right-4 opacity-30" alt="paw" />

      {/* Title */}
      <h1 className="text-3xl font-bold text-orange-500 flex items-center gap-2 mb-6">
        <span className="text-2xl">🐾</span> PawPredict
      </h1>

      {/* Upload Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm flex flex-col items-center">
        <label
          className="w-full text-center border-2 border-dashed border-orange-300 rounded-lg p-6 text-gray-600 cursor-pointer transition hover:bg-orange-50"
        >
          {file ? file.name : 'Click here to upload an image'}
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {file && (
          <button
            onClick={handleUpload}
            className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-orange-600 transition"
          >
            Predict 🐶🐱
          </button>
        )}
      </div>

      {/* Prediction Result */}
      {result && (
        <div className="bg-white rounded-xl shadow-md mt-6 p-4 w-full max-w-sm text-left">
          <p><strong>Animal:</strong> {result.result.category}</p>
          <p className="text-sm mt-2">{result.result.description}</p>
        </div>
      )}
    </div>
  );
}

export default App;
