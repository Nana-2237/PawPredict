import React, { useState } from 'react';
import '../src/index.css';
import pawIcon from './assets/paw.png';

function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [source, setSource] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handleUpload = async () => {
    if (!image) return;
    const formData = new FormData();
    formData.append('file', image);

    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Backend full response:', data);

      // Unwrap the `result` object from the response
      setResult({
        animal: data.result.category,
        description: data.result.description,
      });

      setSource(data.source);
    } catch (error) {
      console.error('Prediction failed:', error);
    }
  };

  const scatteredPaws = [
    { top: '5%', left: '10%' },
    { top: '15%', right: '8%' },
    { bottom: '10%', left: '6%' },
    { bottom: '12%', right: '10%' },
    { top: '30%', left: '4%' },
    { bottom: '30%', right: '4%' },
  ];

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-orange-50 to-white p-10 overflow-hidden">
      {/* Scattered Paw Icons */}
      {scatteredPaws.map((pos, i) => (
        <img
          key={i}
          src={pawIcon}
          alt="paw"
          className="w-8 h-8 absolute opacity-10"
          style={pos}
        />
      ))}

      {/* Logo */}
      <h1 className="text-4xl font-bold text-orange-500 mb-10 flex items-center gap-2">
        <img src={pawIcon} alt="paw" className="w-6 h-6" />
        PawPredict
      </h1>

      {/* Upload Box */}
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center space-y-6">
        <label
          htmlFor="file-upload"
          className="block border-2 border-dashed border-orange-300 rounded-xl p-8 cursor-pointer text-gray-600"
        >
          {image ? image.name : 'Click here to upload an image'}
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={handleUpload}
          disabled={!image}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-full text-lg shadow transition disabled:opacity-50"
        >
          🐶 Predict
        </button>
      </div>

      {/* Result Box */}
      {result && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-8 max-w-md w-full text-left">
          <p className="text-lg font-semibold">
            <strong>Animal:</strong> {result.animal}
          </p>
          <p className="text-gray-700 mt-2 text-base">{result.description}</p>
          <p className="text-sm text-right text-gray-400 italic mt-2">
            Source: {source}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
