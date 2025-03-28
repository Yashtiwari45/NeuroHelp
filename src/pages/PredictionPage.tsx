import React, { useState } from 'react';
import { Brain, Upload, History, AlertCircle, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const CLASS_LABELS = ['mildly demented', 'moderately demented', 'non demented', 'very mildly demented'];

interface ScanHistory {
  id: string;
  date: string;
  prediction: string;
  confidence: number;
  imageUrl: string;
}

function PredictionPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [probability, setProbability] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<ScanHistory[]>([]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file.');
        return;
      }
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setPrediction(null);
      setProbability(null);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedImage);

    try {
      const response = await axios.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('API Response:', response.data);

      if (response.data && typeof response.data.label === 'number') {
        const labelIndex = response.data.label;
        if (labelIndex >= 0 && labelIndex < CLASS_LABELS.length) {
          const predictedLabel = CLASS_LABELS[labelIndex];
          setPrediction(predictedLabel);
          setProbability(response.data.probability);

          const newScan: ScanHistory = {
            id: Date.now().toString(),
            date: new Date().toLocaleString(),
            prediction: predictedLabel,
            confidence: response.data.probability,
            imageUrl: previewUrl!,
          };
          setHistory(prev => [newScan, ...prev]);
        } else {
          setError('Invalid prediction result received from the server.');
        }
      } else {
        setError('Invalid response format from the server.');
      }
    } catch (err) {
      console.error('API Error:', err);
      if (axios.isAxiosError(err)) {
        if (err.response) {
          setError(`Server error: ${err.response.status} - ${err.response.statusText}`);
        } else if (err.request) {
          setError('No response received from the server. Please check your connection.');
        } else {
          setError('Error setting up the request. Please try again.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="bg-gray-800/50 rounded-xl p-6 shadow-xl">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-blue-400" />
            Upload Brain Scan
          </h2>
          
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
            <input
              accept="image/*"
              className="hidden"
              id="image-upload"
              type="file"
              onChange={handleImageUpload}
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer"
            >
              {previewUrl ? (
                <div>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-64 mx-auto rounded-lg"
                  />
                  <p className="mt-4 text-sm text-gray-400">Click to upload a different image</p>
                </div>
              ) : (
                <div className="py-12">
                  <Brain className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                  <p className="text-gray-400">Drag and drop or click to upload brain scan image</p>
                </div>
              )}
            </label>
          </div>

          {selectedImage && !loading && (
            <button
              onClick={handleSubmit}
              className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              Analyze Scan
            </button>
          )}
        </div>

        {/* Results Section */}
        <div className="bg-gray-800/50 rounded-xl p-6 shadow-xl">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-400" />
            Analysis Results
          </h2>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400"></div>
              <p className="mt-4 text-gray-400">Analyzing brain scan...</p>
            </div>
          ) : error ? (
            <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400">{error}</p>
            </div>
          ) : prediction ? (
            <div className="space-y-6">
              <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-green-400">Diagnosis</h3>
                  <p className="text-2xl font-semibold mt-1">{prediction}</p>
                </div>
              </div>

              {probability && (
                <div>
                  <h3 className="text-gray-400 mb-2">Confidence Score</h3>
                  <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${probability * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-right mt-1 text-sm text-gray-400">
                    {(probability * 100).toFixed(1)}%
                  </p>
                </div>
              )}

              <div className="border-t border-gray-700 pt-4">
                <h3 className="text-gray-400 mb-3">Recommendations</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    Consult with a neurologist for detailed evaluation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    Schedule regular follow-up scans
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    Consider cognitive enhancement exercises
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              Upload a brain scan to begin analysis
            </div>
          )}
        </div>
      </div>

      {/* History Section */}
      {history.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <History className="w-5 h-5 text-blue-400" />
            Scan History
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map(scan => (
              <div key={scan.id} className="bg-gray-800/50 rounded-lg overflow-hidden shadow-xl">
                <img src={scan.imageUrl} alt="Scan" className="w-full h-48 object-cover" />
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{scan.prediction}</h3>
                      <p className="text-sm text-gray-400">{scan.date}</p>
                    </div>
                    <span className="bg-blue-500/20 text-blue-400 text-sm px-2 py-1 rounded">
                      {(scan.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PredictionPage;