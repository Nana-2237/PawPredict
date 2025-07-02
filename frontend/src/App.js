import React, { useState, useEffect, useRef } from 'react';
import pawIcon from './assets/paw.png';
import catIcon from './assets/walkingcat.png';
import './index.css';

function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [source, setSource] = useState(null);
  const [catPos, setCatPos] = useState({ top: 100, left: 100 });
  const [pawTrail, setPawTrail] = useState([]);

  const predictBoxRef = useRef(null); // 📦 reference to the Predict block

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
      setResult({
        animal: data.result.category,
        description: data.result.description,
      });
      setSource(data.source);
    } catch (error) {
      console.error('Prediction failed:', error);
    }
  };

  // Move the cat randomly and avoid the Predict box
  useEffect(() => {
    const moveCat = () => {
      const maxX = window.innerWidth - 100;
      const maxY = window.innerHeight - 100;
      const padding = 20;

      let newTop, newLeft, isOverlapping = true;

      while (isOverlapping) {
        newTop = Math.random() * maxY;
        newLeft = Math.random() * maxX;

        const catBox = {
          top: newTop,
          left: newLeft,
          bottom: newTop + 80,
          right: newLeft + 80,
        };

        const block = predictBoxRef.current?.getBoundingClientRect();
        if (!block) break;

        const predictBox = {
          top: block.top - padding,
          left: block.left - padding,
          bottom: block.bottom + padding,
          right: block.right + padding,
        };

        isOverlapping = !(
          catBox.right < predictBox.left ||
          catBox.left > predictBox.right ||
          catBox.bottom < predictBox.top ||
          catBox.top > predictBox.bottom
        );
      }

      const id = Date.now() + Math.random();

      // Add a new paw print
      setPawTrail((prev) => [
        ...prev,
        { id, top: catPos.top + 20, left: catPos.left + 20 },
      ]);

      // Remove it after 15 seconds
      setTimeout(() => {
        setPawTrail((prev) => prev.filter((p) => p.id !== id));
      }, 50000);

      setCatPos({ top: newTop, left: newLeft });
    };

    const interval = setInterval(moveCat, 2500);
    return () => clearInterval(interval);
  }, [catPos]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-orange-50 to-white p-10 overflow-hidden z-10">

      {/* Paw Prints */}
      {pawTrail.map((pos) => (
        <img
          key={pos.id}
          src={pawIcon}
          alt="paw"
          className="w-6 h-6 absolute opacity-20 pointer-events-none transition-opacity duration-500"
          style={{ top: `${pos.top}px`, left: `${pos.left}px` }}
        />
      ))}

      {/* Walking Cat */}
      <img
        src={catIcon}
        alt="walking cat"
        className="absolute w-20 transition-all duration-1000 ease-in-out pointer-events-none"
        style={{ top: `${catPos.top}px`, left: `${catPos.left}px` }}
      />

      {/* Logo */}
      <h1 className="text-4xl font-bold text-orange-500 mb-10 flex items-center gap-2 z-10">
        <img src={pawIcon} alt="paw" className="w-6 h-6" />
        PawPredict
      </h1>

      {/* Upload & Predict Box */}
      <div
        ref={predictBoxRef}
        className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center space-y-6 z-10"
      >
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

        {result && (
          <div className="mt-6 text-left">
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
    </div>
  );
}

export default App;
