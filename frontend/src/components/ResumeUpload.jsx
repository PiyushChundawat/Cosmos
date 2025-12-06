import { useState, useRef } from 'react';
import { Upload, FileText, Sparkles, CheckCircle2 } from 'lucide-react';

function ResumeUpload({ onUploadComplete, goal }) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleScanWithAI = () => {
    if (!file) return;

    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      onUploadComplete(file.name);
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto animate-fadeIn">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
          Upload Your Resume
        </h1>
        <p className="text-gray-600 text-lg">
          Let our AI analyze your resume for{" "}
          {goal === "internship"
            ? "internship"
            : goal === "placement"
            ? "placement"
            : "learning"}{" "}
          opportunities
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-lg">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-3 border-dashed rounded-2xl p-12 transition-all duration-300 ${
            isDragging
              ? "border-blue-600 bg-blue-50 scale-105"
              : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="hidden"
          />

          {!file ? (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mb-6 animate-bounce">
                <Upload className="w-10 h-10 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Drop your resume here
              </h3>

              <p className="text-gray-600 mb-6">or click to browse your files</p>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Choose File
              </button>

              <p className="text-sm text-gray-500 mt-4">
                PDF files only • Max 10MB
              </p>
            </div>
          ) : (
            <div className="text-center animate-fadeIn">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <FileText className="w-10 h-10 text-green-600" />
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {file.name}
              </h3>

              <p className="text-gray-600 mb-2">
                {(file.size / 1024).toFixed(2)} KB
              </p>

              <div className="flex items-center justify-center space-x-2 text-green-600 mb-6">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-semibold">File uploaded successfully</span>
              </div>

              <button
                onClick={() => setFile(null)}
                className="text-blue-600 hover:text-blue-700 font-semibold mr-4"
              >
                Change File
              </button>
            </div>
          )}
        </div>

        {file && (
          <div className="mt-8 animate-fadeIn">
            <button
              onClick={handleScanWithAI}
              disabled={isScanning}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-3 transition-all duration-300 ${
                isScanning
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-2xl hover:scale-105"
              }`}
            >
              {isScanning ? (
                <>
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Scanning with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  <span>Scan with AI</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4 text-center">
        {[
          { label: "AI-Powered", value: "100%" },
          { label: "Secure", value: "256-bit" },
          { label: "Fast", value: "<2s" },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white/60 backdrop-blur-sm rounded-xl p-4 hover:bg-white hover:shadow-lg transition-all duration-300"
          >
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResumeUpload;
